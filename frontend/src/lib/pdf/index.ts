import type { DocumentData } from "@/src/store";

export async function exportToPDF(
	data: DocumentData,
	filename: string,
	language: "en" | "ar" = "en"
) {
	// Dynamic import keeps @react-pdf/renderer out of the SSR bundle
	const { generatePDFBlob } = await import("./document");

	const blob = await generatePDFBlob(data, language);

	const url = URL.createObjectURL(blob);

	// Safari and iOS (all browsers on iOS use WebKit) don't honour the
	// download attribute on programmatic clicks — open in a new tab instead
	// so the user can save via the browser Share / Save to Files menu.
	const ua = navigator.userAgent;
	const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
	const isIOS = /iPad|iPhone|iPod/.test(ua);

	if (isSafari || isIOS) {
		window.open(url, "_blank");
		// Revoke after a short delay so the new tab has time to load the blob
		setTimeout(() => URL.revokeObjectURL(url), 10_000);
	} else {
		const link = document.createElement("a");
		link.href = url;
		link.download = `${filename}.pdf`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}
}

import type { DocumentData } from "@/src/store";

export async function exportToPDF(data: DocumentData, filename: string) {
	// Dynamic import keeps @react-pdf/renderer out of the SSR bundle
	const { generatePDFBlob } = await import("./document");

	const blob = await generatePDFBlob(data);

	const url = URL.createObjectURL(blob);

	// Safari doesn't honour the download attribute on programmatic clicks.
	// Detect it via userAgent and fall back to window.open so the PDF at least
	// opens in a new tab (from which the user can save via the browser menu).
	const isSafari =
		/^((?!chrome|android).)*safari/i.test(navigator.userAgent);

	if (isSafari) {
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

import type { DocumentData } from "@/src/store";

export async function exportToPDF(
	data: DocumentData,
	filename: string,
	language: "en" | "ar" | "tr" = "en"
) {
	// Dynamic import keeps @react-pdf/renderer out of the SSR bundle
	const { generatePDFBlob } = await import("./document");

	const blob = await generatePDFBlob(data, language);

	const safeFilename = `${filename}.pdf`;
	const file = new File([blob], safeFilename, { type: "application/pdf" });

	// On iOS/mobile, use the Web Share API (triggers native "Save to Files" sheet).
	// This is the only reliable way to get a real download on iOS.
	const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
	const isMobile = isIOS || /Android/i.test(navigator.userAgent);

	if (isMobile && "canShare" in navigator && navigator.canShare({ files: [file] })) {
		try {
			await navigator.share({ files: [file], title: safeFilename });
			return;
		} catch (e) {
			// User dismissed share sheet — not an error, just return
			if ((e as DOMException).name === "AbortError") return;
			// Otherwise fall through to blob URL approach
		}
	}

	// Desktop (and fallback): programmatic anchor click
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = safeFilename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	// Small delay on iOS Safari before revoking so WebKit has time to read the blob
	setTimeout(() => URL.revokeObjectURL(url), 5_000);
}

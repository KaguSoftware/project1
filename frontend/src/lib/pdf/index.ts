import type { DocumentData } from "@/src/store";

export async function exportToPDF(data: DocumentData, filename: string) {
	// Dynamic import keeps @react-pdf/renderer out of the SSR bundle
	const { generatePDFBlob } = await import("./document");

	const blob = await generatePDFBlob(data);

	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = `${filename}.pdf`;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}

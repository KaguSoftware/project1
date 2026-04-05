import jsPDF from "jspdf";

export async function exportToPDF(elementId: string, filename: string) {
	if (typeof window === "undefined") return;

	try {
		const domtoimage = (await import("dom-to-image-more")).default;
		const element = document.getElementById(elementId);
		if (!element) return;

		const scale = 2;
		const dataUrl = await domtoimage.toPng(element, {
			width: element.offsetWidth * scale,
			height: element.offsetHeight * scale,
			style: {
				transform: `scale(${scale})`,
				transformOrigin: "top left",
				width: element.offsetWidth + "px",
				height: element.offsetHeight + "px",
			},
			quality: 1.0,
			bgcolor: "#ffffff",
		});

		const pdf = new jsPDF("p", "px", "a4");
		const pdfWidth = pdf.internal.pageSize.getWidth();
		const pageHeight = pdf.internal.pageSize.getHeight();
		const pdfHeight =
			(element.offsetHeight * pdfWidth) / element.offsetWidth;

		let heightLeft = pdfHeight;
		let position = 0;

		// Add the first page
		pdf.addImage(dataUrl, "PNG", 0, position, pdfWidth, pdfHeight);
		heightLeft -= pageHeight;

		// Loop and add new pages as long as there is still image left
		while (heightLeft > 0) {
			position = heightLeft - pdfHeight;
			pdf.addPage();
			pdf.addImage(dataUrl, "PNG", 0, position, pdfWidth, pdfHeight);
			heightLeft -= pageHeight;
		}

		pdf.save(`${filename}.pdf`);
	} catch (error) {
		console.error("Failed to generate PDF:", error);
	}
}

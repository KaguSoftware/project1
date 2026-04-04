import jsPDF from "jspdf";

export async function exportToPDF(elementId: string, filename: string) {
	// Add a quick safety check to ensure we are in the browser
	if (typeof window === "undefined") return;

	try {
		// Dynamically import the library only when the function is called
		const domtoimage = (await import("dom-to-image-more")).default;

		const element = document.getElementById(elementId);
		if (!element) return;

		const scale = 2;
		const style = {
			transform: `scale(${scale})`,
			transformOrigin: "top left",
			width: element.offsetWidth + "px",
			height: element.offsetHeight + "px",
		};

		const dataUrl = await domtoimage.toPng(element, {
			width: element.offsetWidth * scale,
			height: element.offsetHeight * scale,
			style: style,
			quality: 1.0,
			bgcolor: "#ffffff",
		});

		const pdf = new jsPDF({
			orientation: "portrait",
			unit: "px",
			format: "a4",
		});

		const pdfWidth = pdf.internal.pageSize.getWidth();
		const pdfHeight =
			(element.offsetHeight * pdfWidth) / element.offsetWidth;

		pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
		pdf.save("document.pdf");
	} catch (error) {
		console.error("Failed to generate PDF:", error);
	}
}

import jsPDF from "jspdf";

export const exportToPDF = async (elementId: string, filename: string) => {
	const element = document.getElementById(elementId);
	if (!element) {
		console.error("Could not find the document element");
		return;
	}

	try {
		// 1. We dynamically import it here, so it only loads in the browser
		const domtoimage = (await import("dom-to-image-more")).default;

		const scale = 2;

		const imgData = await domtoimage.toPng(element, {
			quality: 1,
			bgcolor: "#ffffff",
			width: element.clientWidth * scale,
			height: element.clientHeight * scale,
			style: {
				transform: `scale(${scale})`,
				transformOrigin: "top left",
				width: `${element.clientWidth}px`,
				height: `${element.clientHeight}px`,
			},
		});

		const pdf = new jsPDF({
			orientation: "portrait",
			unit: "px",
			format: "a4",
		});

		const pdfWidth = pdf.internal.pageSize.getWidth();
		const pdfHeight =
			(element.clientHeight * pdfWidth) / element.clientWidth;

		pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
		pdf.save(`${filename}.pdf`);
	} catch (error) {
		console.error("Failed to generate PDF:", error);
	}
};

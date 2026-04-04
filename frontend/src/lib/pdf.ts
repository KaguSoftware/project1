import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const exportToPDF = async (elementId: string, filename: string) => {
	const element = document.getElementById(elementId);
	if (!element) return;

	const canvas = await html2canvas(element, {
		scale: 2,
		useCORS: true,
		logging: false,
		backgroundColor: "#ffffff",
		// THE FIX: This function runs on a hidden copy of your page before the PDF is made
		onclone: (clonedDoc) => {
			const clonedElement = clonedDoc.getElementById(elementId);
			if (!clonedElement) return;

			// Find every single element and convert oklch/lab colors to standard RGB
			const allElements = clonedElement.getElementsByTagName("*");
			for (let i = 0; i < allElements.length; i++) {
				const el = allElements[i] as HTMLElement;
				const style = window.getComputedStyle(el);

				// Force convert colors to RGB strings (browser handles the conversion)
				if (
					style.color.includes("oklch") ||
					style.color.includes("lab")
				) {
					el.style.color = "rgb(30, 41, 59)"; // Slate-800
				}
				if (
					style.backgroundColor.includes("oklch") ||
					style.backgroundColor.includes("lab")
				) {
					// If it's a background, usually it's white or light slate
					el.style.backgroundColor =
						el.tagName === "DIV" ? "#ffffff" : "rgb(248, 250, 252)";
				}
				if (
					style.borderColor.includes("oklch") ||
					style.borderColor.includes("lab")
				) {
					el.style.borderColor = "rgb(226, 232, 240)"; // Slate-200
				}
			}

			// Force the main container to be safe
			clonedElement.style.fontFamily = "Arial, sans-serif";
		},
	});

	const imgData = canvas.toDataURL("image/png");
	const pdf = new jsPDF({
		orientation: "p",
		unit: "px",
		format: "a4",
	});

	const width = pdf.internal.pageSize.getWidth();
	const height = (canvas.height * width) / canvas.width;

	pdf.addImage(imgData, "PNG", 0, 0, width, height);
	pdf.save(`${filename}.pdf`);
};

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
	try {
		const doc = await req.json();
		const { type, projectTitle, clientName } = doc;

		const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

		const prompt = `
      Act as a world-class business consultant. Generate a full ${type} for "${projectTitle}" for the client "${clientName}".
      
      You must return ONLY a valid JSON object with the following structure:
      {
        "aiIntro": "A 2-paragraph professional executive summary",
        "scopeOfWork": "A detailed 3-4 paragraph breakdown of the project scope",
        "deliverables": [
          {"deliverable": "Name of task", "timeline": "e.g. Week 1", "status": "Pending"}
        ],
        "terms": ["Clause 1", "Clause 2"]
      }

      Context for content:
      Type: ${type}
      Project: ${projectTitle}
      Client: ${clientName}
      
      Ensure the tone is premium, expert, and highly specific to the industry implied by the title.
    `;

		const result = await model.generateContent(prompt);
		const response = await result.response;
		// Clean the text in case Gemini adds markdown code blocks
		const cleanedText = response
			.text()
			.replace(/```json/g, "")
			.replace(/```/g, "")
			.trim();
		const aiData = JSON.parse(cleanedText);

		return NextResponse.json(aiData);
	} catch (error) {
		console.error("Gemini Error:", error);
		return NextResponse.json({ error: "Failed" }, { status: 500 });
	}
}

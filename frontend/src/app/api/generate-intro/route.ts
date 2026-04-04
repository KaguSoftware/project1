// src/app/api/generate-intro/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
	try {
		const doc = await req.json();
		const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Use 1.5 or 2.0 flash

		const prompt = `
      Act as a senior legal and business consultant. 
      Generate a full, professional ${doc.type} for "${doc.projectTitle}" for client "${doc.clientName}".

      REQUIREMENTS:
      1. Use formal business language. 
      2. No flowery language or "marketing fluff."
      3. Return ONLY a JSON object.

      STRUCTURE:
      {
        "aiIntro": "2 paragraphs of executive summary",
        "scopeOfWork": "Detailed project scope",
        "pricingPackage": "Specify a professional price or breakdown based on the project title",
        "deliverables": [
          {"deliverable": "Task name", "timeline": "e.g. Phase 1", "status": "Pending"}
        ],
        "termsAndConditions": [
          {"text": "Standard legal clause relevant to this project type"}
        ]
      }
    `;

		const result = await model.generateContent(prompt);
		const response = await result.response;
		const text = response
			.text()
			.replace(/```json/g, "")
			.replace(/```/g, "")
			.trim();

		return NextResponse.json(JSON.parse(text));
	} catch (error) {
		return NextResponse.json({ error: "AI Failed" }, { status: 500 });
	}
}

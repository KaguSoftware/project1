// src/app/api/generate-intro/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

function buildPrompt(doc: any, providedData: string) {
	const baseRules = `
        Act as a senior legal and business consultant.

        Generate a professional ${doc.type || "document"} for "${doc.projectTitle || "the project"}"
        for client "${doc.clientName || "the client"}".

        Here is the current data already filled by the user:
        ${providedData}

        RULES:
        1. Use all provided fields as context.
        2. If a field already has a non-empty user value, preserve it unless improvement is explicitly required.
        3. Only generate values for fields that are empty or missing.
        4. Do not invent or return legal clauses or terms and conditions.
        5. In the written paragraphs, explicitly reference relevant provided fields when they exist, such as:
        - projectTitle
        - clientName
        - pricingPackage
        - totalPrice
        - defaultCurrency
        - timeline
        - validUntil
        - scopeOfWork
        - deliverables
        6. The executive summary / overview must sound grounded in the user's actual inputs, not generic.
        7. Return ONLY a JSON object.
    `;

	switch (doc.type) {
		case "proposal":
			return `
        ${baseRules}

            Return ONLY a JSON object using this exact structure:

            {
            "aiIntro": "2 paragraphs of executive summary",
            "scopeOfWork": "Detailed project scope based on the provided data",
            "pricingPackage": "basic | standard | premium",
            "defaultCurrency": "Use the user's provided currency if available",
            "totalPrice": "Professional price string in the selected currency",
            "timeline": "Project timeline string",
            "validUntil": "Validity date string",
            "deliverables": [
                { "deliverable": "Task name", "timeline": "e.g. Phase 1", "status": "Pending" }
            ]
            }
            The "aiIntro" must clearly mention the project title, the nature of the work, and when available the selected pricing package, total price, currency, timeline, and validity period in a natural professional way.
            The "scopeOfWork" must reflect the actual filled project details and not remain generic.
        `;
		case "contract":
			return `
${baseRules}

Return ONLY a JSON object using this exact structure:

{
  "aiIntro": "1 to 2 short professional introductory paragraphs",
  "agreementOverview": "A concise agreement overview describing the nature and purpose of the contract",
  "scopeOfWork": "Clear scope of services",
  "deliverables": [
    { "deliverable": "Task name", "timeline": "e.g. Phase 1", "status": "Pending" }
  ]
}
`;
		default:
			return `
        ${baseRules}

        Return ONLY a JSON object using this exact structure:

        {
        "aiIntro": "Professional summary based on the provided data"
        }
        The "aiIntro" and "agreementOverview" must clearly mention the project title, client name, nature of services, and any relevant scope, deliverables, or timeline already provided.
        The wording should reflect the user's actual business context rather than a generic template.
`;
	}
}

export async function POST(req: Request) {
	try {
		const doc = await req.json();
		console.log("Incoming doc:", doc);

		const model = genAI.getGenerativeModel({
			model: "gemini-2.5-flash",
			generationConfig: { responseMimeType: "application/json" },
		});

		const providedData = JSON.stringify(doc, null, 2);
		const prompt = buildPrompt(doc, providedData);

		const result = await model.generateContent(prompt);
		const text = result.response.text();

		console.log("AI raw response:", text);

		return NextResponse.json(JSON.parse(text));
	} catch (error) {
		console.error("AI Generation Error:", error);
		return NextResponse.json(
			{ error: "AI Failed to generate valid data" },
			{ status: 500 },
		);
	}
}

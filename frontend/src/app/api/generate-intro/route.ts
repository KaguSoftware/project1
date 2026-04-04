import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI();

export async function POST(req: Request) {
	try {
		const { title, clientName, deliverables } = await req.json();

		const prompt = `
      You are an expert sales executive writing a professional introduction for a business proposal.
      Proposal Title: ${title}
      Client Name: ${clientName}
      Deliverables: ${deliverables}

      Write a highly persuasive, 2-paragraph introduction. Explicitly state that we will accelerate their sales and build their brand identity. Keep the tone premium and direct.
    `;

		const response = await openai.chat.completions.create({
			model: "gpt-4o-mini",
			messages: [{ role: "user", content: prompt }],
			temperature: 0.7,
		});

		return NextResponse.json({
			intro: response.choices[0].message.content,
		});
	} catch (error) {
		console.error("AI Generation Error:", error);
		return NextResponse.json(
			{ error: "Failed to generate text" },
			{ status: 500 },
		);
	}
}

import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
	try {
		const doc = await req.json();
		const { type, projectTitle, clientName } = doc;

		if (
			!process.env.OPENAI_API_KEY ||
			process.env.OPENAI_API_KEY.includes("your-key")
		) {
			return NextResponse.json({
				intro: `[Mock] Professional AI content generated for ${projectTitle}.`,
			});
		}

		const openai = new OpenAI();

		// This logic ensures the AI knows exactly what data it has access to
		let dataSummary = `Project: ${projectTitle}, Client: ${clientName}. `;

		if (type === "social_media_report") {
			dataSummary += `Metrics: ${JSON.stringify(doc.performanceMetrics)}`;
		} else if (type === "influencer_campaign") {
			dataSummary += `KPIs: Views ${doc.influencerKPIs.views}, ROI ${doc.influencerKPIs.roi}. Roster: ${JSON.stringify(doc.influencers)}`;
		}

		const prompt = `
      Act as a premium business consultant. Write a professional executive summary for a ${type.replace(/_/g, " ")}.
      
      CONTEXT DATA:
      ${dataSummary}

      INSTRUCTIONS:
      1. Tone: Sophisticated, data-driven, and persuasive.
      2. Format: Two clean paragraphs. 
      3. Language: Match the professional standards of top-tier agencies.
      4. Focus: If it's a report, highlight growth. If it's a proposal, highlight ROI and future success.
    `;

		const response = await openai.chat.completions.create({
			model: "gpt-4o", // Higher quality for "perfect" generation
			messages: [{ role: "user", content: prompt }],
			temperature: 0.7,
		});

		return NextResponse.json({
			intro: response.choices[0].message.content,
		});
	} catch (error) {
		return NextResponse.json(
			{ error: "Generation failed" },
			{ status: 500 },
		);
	}
}

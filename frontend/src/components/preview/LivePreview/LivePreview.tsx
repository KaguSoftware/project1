"use client";
import { useState } from "react";
import { useAppStore } from "@/src/store";
import { exportToPDF } from "@/src/lib/pdf";
import type { LivePreviewProps } from "./types";
import { DocHeader } from "./sections/DocHeader";
import { EngagementOverviewPreview, DeliverablesPreview } from "./sections/ProposalContract";
import { InvoicePreview } from "./sections/Invoice";
import { PerformanceMetricsPreview, TopPostsPreview } from "./sections/SocialMedia";
import { SalesMetricsPreview, DealBreakdownPreview } from "./sections/Sales";
import { KPIGridPreview, InfluencerRosterPreview } from "./sections/Influencer";
import { TermsPreview, TextSectionPreview } from "./sections/Common";

export const LivePreview = ({ className = "" }: LivePreviewProps) => {
	const { document: doc } = useAppStore();
	const [isExporting, setIsExporting] = useState(false);

	const handleDownload = async () => {
		setIsExporting(true);
		try {
			const filename = `${doc.type}-${
				doc.clientName.replace(/\s+/g, "-").toLowerCase() || "draft"
			}`;
			await exportToPDF(doc, filename);
		} catch (error) {
			console.error("PDF export failed:", error);
		} finally {
			setIsExporting(false);
		}
	};

	const today = new Date().toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	return (
		<div
			className={`flex-1 flex flex-col items-center gap-6 overflow-y-auto ${className}`}
		>
			{/* Action Bar */}
			<div className="w-full max-w-200 flex justify-end">
				<button
					onClick={handleDownload}
					disabled={isExporting}
					className="btn bg-slate-900 text-white hover:bg-slate-800 border-none shadow-md px-6 rounded-xl"
				>
					{isExporting ? "Exporting..." : "Download Clean PDF"}
				</button>
			</div>

			{/* Paper */}
			<div className="shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] mb-20 border border-slate-200 rounded-sm">
				<div
					id="document-page"
					className="bg-white w-198.5 min-h-280.75 px-16 py-20 relative flex flex-col text-slate-800 pdf-safe-mode"
				>
					<DocHeader doc={doc} today={today} />

					<div className="w-full h-1 bg-slate-900 mb-12" />

					{/* CLIENT / PROJECT ROW */}
					<div className="grid grid-cols-2 gap-8 mb-16">
						<div>
							<p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 font-black">
								Prepared For
							</p>
							<p className="text-2xl font-bold text-slate-900">
								{doc.clientName || "Client Name"}
							</p>
						</div>
						<div className="text-right">
							<p className="text-2xl font-bold text-slate-900">
								{doc.projectTitle || "Project Description"}
							</p>
						</div>
					</div>

					<div className="flex-1 space-y-12">
						{/* EXECUTIVE SUMMARY */}
						{doc.aiIntro && (
							<section>
								<h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-4 font-black">
									Executive Summary
								</h3>
								<p className="text-slate-700 leading-loose text-lg italic border-l-4 border-slate-100 pl-6">
									{doc.aiIntro}
								</p>
							</section>
						)}

						{/* ── PROPOSAL ── */}
						{doc.type === "proposal" && (
							<EngagementOverviewPreview doc={doc} />
						)}

						{/* ── CONTRACT ── */}
						{doc.type === "contract" && doc.agreementOverview && (
							<TextSectionPreview
								text={doc.agreementOverview}
								label="Agreement Overview"
							/>
						)}

						{/* ── INFLUENCER CAMPAIGN OVERVIEW ── */}
						{doc.type === "influencer_campaign" && doc.campaignOverview && (
							<TextSectionPreview
								text={doc.campaignOverview}
								label="Campaign Overview"
							/>
						)}

						{/* SCOPE OF WORK / BODY */}
						{(doc.scopeOfWork || doc.body) && (
							<TextSectionPreview
								text={doc.scopeOfWork || doc.body}
								label={doc.type === "letter" ? "Message" : "Scope of Work"}
							/>
						)}

						{/* DELIVERABLES */}
						<DeliverablesPreview doc={doc} />

						{/* TERMS */}
						<TermsPreview doc={doc} />

						{/* ── INVOICE ── */}
						{doc.type === "invoice" && <InvoicePreview doc={doc} />}

						{/* ── SOCIAL MEDIA REPORT ── */}
						{doc.type === "social_media_report" && (
							<>
								<PerformanceMetricsPreview doc={doc} />
								<TopPostsPreview doc={doc} />
							</>
						)}

						{/* ── WEEKLY SALES REPORT ── */}
						{doc.type === "weekly_sales_report" && (
							<>
								<SalesMetricsPreview doc={doc} />
								<DealBreakdownPreview doc={doc} />
							</>
						)}

						{/* ── INFLUENCER CAMPAIGN ── */}
						{doc.type === "influencer_campaign" && (
							<>
								<KPIGridPreview doc={doc} />
								<InfluencerRosterPreview doc={doc} />
							</>
						)}

						{/* ADDITIONAL NOTES */}
						{doc.additionalNotes && (
							<TextSectionPreview
								text={doc.additionalNotes}
								label="Additional Notes"
							/>
						)}
					</div>

					{/* FOOTER */}
					<div className="w-full h-px bg-slate-200 mb-6 mt-20" />
					<div className="flex justify-between items-center text-slate-400">
						<p className="text-[10px] tracking-widest uppercase font-bold italic">
							GENBUZZ INTERNAL SYSTEMS
						</p>
						<p className="text-[10px] tracking-widest uppercase font-bold">
							Confidential • 2026
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

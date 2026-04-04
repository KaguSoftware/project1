"use client";
import { useState } from "react";
// 1. Updated import to point to your new clean store folder
import { useAppStore } from "@/src/store";
import { exportToPDF } from "@/src/lib/pdf";
import type { LivePreviewProps } from "./types";

export const LivePreview = ({ className = "" }: LivePreviewProps) => {
	const { document: doc } = useAppStore();
	const [isExporting, setIsExporting] = useState(false);

	const handleDownload = async () => {
		setIsExporting(true);
		const filename = `${doc.type}-${doc.clientName.replace(/\s+/g, "-").toLowerCase() || "draft"}`;
		await exportToPDF("document-page", filename);
		setIsExporting(false);
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
			<div className="w-full max-w-[800px] flex justify-end">
				<button
					onClick={handleDownload}
					disabled={isExporting}
					className="btn bg-slate-900 text-white hover:bg-slate-800 border-none shadow-md px-6 rounded-xl"
				>
					{isExporting ? "Exporting..." : "Download Clean PDF"}
				</button>
			</div>

			{/* The Paper Context */}
			<div className="shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] mb-20 border border-slate-200 rounded-sm">
				<div
					id="document-page"
					className="bg-white w-[794px] min-h-[1123px] px-16 py-20 relative flex flex-col text-slate-800"
				>
					<style
						dangerouslySetInnerHTML={{
							__html: `#document-page * { border-style: hidden !important; }`,
						}}
					/>

					{/* --- DYNAMIC HEADER --- */}
					<div className="flex justify-between items-start mb-8">
						<div>
							<h1 className="text-4xl font-black text-slate-900 mb-2 uppercase tracking-widest">
								{doc.type.replace(/_/g, " ")}
							</h1>
							<p className="text-slate-500 font-medium tracking-widest uppercase text-[10px] italic">
								Reference:{" "}
								{doc.projectTitle || "Untitled Project"} •{" "}
								{today}
							</p>
						</div>
						<div className="text-right">
							<div className="bg-slate-900 text-white px-4 py-2 rounded-lg font-black text-xl tracking-tighter mb-1">
								GENBUZZ
							</div>
							<p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">
								Official Document
							</p>
						</div>
					</div>

					<div className="w-full h-1 bg-slate-900 mb-12"></div>

					{/* --- CLIENT INFO --- */}
					<div className="grid grid-cols-2 gap-8 mb-16">
						<div>
							<p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 font-black">
								Prepared For
							</p>
							<p className="text-2xl font-bold text-slate-900">
								{doc.clientName || "Client Name"}
							</p>
							<p className="text-slate-500 mt-1">
								{doc.projectTitle || "Project Description"}
							</p>
						</div>
						<div className="text-right">
							<p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 font-black">
								Document Status
							</p>
							<p className="text-lg font-bold text-primary uppercase">
								Draft / Finalization
							</p>
						</div>
					</div>

					{/* --- DYNAMIC CONTENT SECTIONS --- */}
					<div className="flex-1 space-y-12">
						{/* Executive Intro (Universal for most types) */}
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

						{/* INVOICE LINE ITEMS */}
						{doc.type === "invoice" && (
							<section>
								<h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-4 font-black">
									Billing Details
								</h3>
								<table className="w-full text-left">
									<thead>
										<tr className="border-b border-slate-900">
											<th className="py-4 text-[10px] uppercase font-black">
												Description
											</th>
											<th className="py-4 text-[10px] uppercase font-black text-center">
												Qty
											</th>
											<th className="py-4 text-[10px] uppercase font-black text-right">
												Rate
											</th>
											<th className="py-4 text-[10px] uppercase font-black text-right">
												Total
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-slate-100">
										{doc.lineItems.map((item) => (
											<tr key={item.id}>
												<td className="py-4 font-medium">
													{item.description}
												</td>
												<td className="py-4 text-center">
													{item.qty}
												</td>
												<td className="py-4 text-right">
													${item.rate}
												</td>
												<td className="py-4 text-right font-bold">
													${item.qty * item.rate}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</section>
						)}

						{/* SOCIAL MEDIA PERFORMANCE */}
						{doc.type === "social_media_report" && (
							<section className="grid grid-cols-2 gap-12">
								<div>
									<h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-4 font-black">
										Metric Performance
									</h3>
									<div className="space-y-4">
										{doc.performanceMetrics.map((m) => (
											<div
												key={m.id}
												className="flex justify-between border-b border-slate-50 pb-2"
											>
												<span className="font-bold text-slate-600">
													{m.metric}
												</span>
												<div className="text-right">
													<p className="font-black text-slate-900">
														{m.number}
													</p>
													<p
														className={`text-[10px] font-bold ${m.delta.startsWith("-") ? "text-red-500" : "text-emerald-500"}`}
													>
														{m.delta}
													</p>
												</div>
											</div>
										))}
									</div>
								</div>
								<div>
									<h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-4 font-black">
										Key Insights
									</h3>
									<p className="text-sm text-slate-600 leading-relaxed">
										Top post engagement remains steady.
										Recommend increasing video frequency.
									</p>
								</div>
							</section>
						)}

						{/* INFLUENCER CAMPAIGN KPIs */}
						{doc.type === "influencer_campaign" && (
							<section>
								<h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-6 font-black">
									Campaign Impact Score
								</h3>
								<div className="grid grid-cols-5 gap-4 mb-12">
									{[
										{
											label: "Views",
											val: doc.influencerKPIs.views,
										},
										{
											label: "Engagement",
											val: doc.influencerKPIs.engagement,
										},
										{
											label: "Clicks",
											val: doc.influencerKPIs.clicks,
										},
										{
											label: "Conversions",
											val: doc.influencerKPIs.conversions,
										},
										{
											label: "ROI",
											val: doc.influencerKPIs.roi,
										},
									].map((k) => (
										<div
											key={k.label}
											className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100"
										>
											<p className="text-[9px] font-black uppercase text-slate-400 mb-1">
												{k.label}
											</p>
											<p className="text-xl font-black text-slate-900">
												{k.val || "0"}
											</p>
										</div>
									))}
								</div>
							</section>
						)}

						{/* UNIVERSAL SCOPE/BODY */}
						{(doc.scopeOfWork || doc.body) && (
							<section>
								<h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-4 font-black">
									Details & Clauses
								</h3>
								<div className="whitespace-pre-wrap text-slate-700 leading-relaxed text-base">
									{doc.scopeOfWork || doc.body}
								</div>
							</section>
						)}
					</div>

					{/* --- FOOTER --- */}
					<div className="w-full h-px bg-slate-200 mb-6 mt-20"></div>
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

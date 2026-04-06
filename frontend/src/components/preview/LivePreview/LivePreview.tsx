"use client";
import { useState } from "react";
import { useAppStore } from "@/src/store";
import { exportToPDF } from "@/src/lib/pdf";
import type { LivePreviewProps } from "./types";

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

	const showDeliverables =
		(doc.type === "proposal" || doc.type === "contract") &&
		doc.deliverables.some((d) => d.deliverable);

	const showTerms =
		(doc.type === "proposal" || doc.type === "invoice") &&
		doc.termsAndConditions.some((c) => c.text);

	const showTopPosts =
		doc.type === "social_media_report" && doc.topPosts.some((p) => p.post);

	const showSalesMetrics =
		doc.type === "weekly_sales_report" &&
		doc.salesMetrics.some((m) => m.title);

	const showDealBreakdown =
		doc.type === "weekly_sales_report" &&
		doc.dealBreakdown.some((d) => d.client);

	const showInfluencers =
		doc.type === "influencer_campaign" &&
		doc.influencers.some((i) => i.name);

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
					{/* HEADER */}
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

						{/* PROPOSAL / CONTRACT — pricing meta row */}
						{doc.type === "proposal" &&
							(doc.pricingPackage ||
								doc.timeline ||
								doc.totalPrice ||
								doc.validUntil) && (
								<section>
									<h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-4 font-black">
										Engagement Overview
									</h3>
									<div className="grid grid-cols-4 gap-4">
										{doc.pricingPackage && (
											<div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
												<p className="text-[9px] font-black uppercase text-slate-400 mb-1">
													Package
												</p>
												<p className="font-black text-slate-900 capitalize">
													{doc.pricingPackage}
												</p>
											</div>
										)}
										{doc.timeline && (
											<div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
												<p className="text-[9px] font-black uppercase text-slate-400 mb-1">
													Timeline
												</p>
												<p className="font-black text-slate-900">
													{doc.timeline}
												</p>
											</div>
										)}
										{doc.totalPrice && (
											<div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
												<p className="text-[9px] font-black uppercase text-slate-400 mb-1">
													Total
												</p>
												<p className="font-black text-slate-900">
													{doc.defaultCurrency}{" "}
													{doc.totalPrice}
												</p>
											</div>
										)}
										{doc.validUntil && (
											<div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
												<p className="text-[9px] font-black uppercase text-slate-400 mb-1">
													Valid Until
												</p>
												<p className="font-black text-slate-900">
													{doc.validUntil}
												</p>
											</div>
										)}
									</div>
								</section>
							)}

						{/* AGREEMENT OVERVIEW — contract */}
						{doc.type === "contract" && doc.agreementOverview && (
							<section>
								<h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-4 font-black">
									Agreement Overview
								</h3>
								<div className="whitespace-pre-wrap text-slate-700 leading-relaxed text-base">
									{doc.agreementOverview}
								</div>
							</section>
						)}

						{/* CAMPAIGN OVERVIEW — influencer */}
						{doc.type === "influencer_campaign" &&
							doc.campaignOverview && (
								<section>
									<h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-4 font-black">
										Campaign Overview
									</h3>
									<div className="whitespace-pre-wrap text-slate-700 leading-relaxed text-base">
										{doc.campaignOverview}
									</div>
								</section>
							)}

						{/* SCOPE OF WORK / BODY */}
						{(doc.scopeOfWork || doc.body) && (
							<section>
								<h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-4 font-black">
									{doc.type === "letter"
										? "Message"
										: "Scope of Work"}
								</h3>
								<div className="whitespace-pre-wrap text-slate-700 leading-relaxed text-base">
									{doc.scopeOfWork || doc.body}
								</div>
							</section>
						)}

						{/* DELIVERABLES — proposal + contract */}
						{showDeliverables && (
							<section>
								<h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-4 font-black">
									Deliverables
								</h3>
								<table className="w-full text-left">
									<thead>
										<tr className="border-b border-slate-900">
											<th className="py-3 text-[10px] uppercase font-black">
												Deliverable
											</th>
											<th className="py-3 text-[10px] uppercase font-black">
												Timeline
											</th>
											<th className="py-3 text-[10px] uppercase font-black text-right">
												Status
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-slate-100">
										{doc.deliverables.map((item) => (
											<tr key={item.id}>
												<td className="py-3 font-medium text-slate-700">
													{item.deliverable}
												</td>
												<td className="py-3 text-slate-500 text-sm">
													{item.timeline}
												</td>
												<td className="py-3 text-right">
													<span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-slate-100 text-slate-500">
														{item.status ||
															"Pending"}
													</span>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</section>
						)}

						{/* TERMS & CONDITIONS */}
						{showTerms && (
							<section>
								<h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-4 font-black">
									{doc.type === "invoice"
										? "Payment Terms"
										: "Terms & Conditions"}
								</h3>
								<ol className="space-y-3">
									{doc.termsAndConditions
										.filter((c) => c.text)
										.map((clause, idx) => (
											<li
												key={clause.id}
												className="flex gap-3 text-sm text-slate-600"
											>
												<span className="w-5 h-5 flex-shrink-0 flex items-center justify-center rounded-full bg-slate-100 text-[10px] font-black text-slate-500 mt-0.5">
													{idx + 1}
												</span>
												{clause.text}
											</li>
										))}
								</ol>
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
									<tfoot>
										<tr className="border-t-2 border-slate-900">
											<td
												colSpan={3}
												className="pt-4 font-black text-right uppercase text-xs tracking-widest"
											>
												Total
											</td>
											<td className="pt-4 text-right font-black text-lg">
												$
												{doc.lineItems
													.reduce(
														(sum, i) =>
															sum +
															i.qty * i.rate,
														0,
													)
													.toLocaleString()}
											</td>
										</tr>
									</tfoot>
								</table>
							</section>
						)}

						{/* SOCIAL MEDIA PERFORMANCE */}
						{doc.type === "social_media_report" &&
							doc.performanceMetrics.some((m) => m.metric) && (
								<section>
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
														className={`text-[10px] font-bold ${m.delta?.startsWith("-") ? "text-red-500" : "text-emerald-500"}`}
													>
														{m.delta}
													</p>
												</div>
											</div>
										))}
									</div>
								</section>
							)}

						{/* TOP POSTS — social media */}
						{showTopPosts && (
							<section>
								<h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-4 font-black">
									Top Performing Posts
								</h3>
								<table className="w-full text-left">
									<thead>
										<tr className="border-b border-slate-900">
											<th className="py-3 text-[10px] uppercase font-black">
												Post
											</th>
											<th className="py-3 text-[10px] uppercase font-black text-center">
												Likes
											</th>
											<th className="py-3 text-[10px] uppercase font-black text-center">
												Comments
											</th>
											<th className="py-3 text-[10px] uppercase font-black text-center">
												Shares
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-slate-100">
										{doc.topPosts.map((p) => (
											<tr key={p.id}>
												<td className="py-3 font-medium text-slate-700">
													{p.post}
												</td>
												<td className="py-3 text-center text-slate-500">
													{p.likes}
												</td>
												<td className="py-3 text-center text-slate-500">
													{p.comments}
												</td>
												<td className="py-3 text-center text-slate-500">
													{p.shares}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</section>
						)}

						{/* SALES METRICS — weekly_sales_report */}
						{showSalesMetrics && (
							<section>
								<h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-4 font-black">
									Weekly Sales Metrics
								</h3>
								<div className="space-y-4">
									{doc.salesMetrics.map((m) => (
										<div
											key={m.id}
											className="flex justify-between border-b border-slate-50 pb-2"
										>
											<span className="font-bold text-slate-600">
												{m.title}
											</span>
											<div className="text-right">
												<p className="font-black text-slate-900">
													{m.money}
												</p>
												{m.delta && (
													<p
														className={`text-[10px] font-bold ${m.delta.startsWith("-") ? "text-red-500" : "text-emerald-500"}`}
													>
														{m.delta}
													</p>
												)}
											</div>
										</div>
									))}
								</div>
							</section>
						)}

						{/* DEAL BREAKDOWN — weekly_sales_report */}
						{showDealBreakdown && (
							<section>
								<h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-4 font-black">
									Deal Breakdown
								</h3>
								<table className="w-full text-left">
									<thead>
										<tr className="border-b border-slate-900">
											<th className="py-3 text-[10px] uppercase font-black">
												Client
											</th>
											<th className="py-3 text-[10px] uppercase font-black">
												Deal Value
											</th>
											<th className="py-3 text-[10px] uppercase font-black text-right">
												Stage
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-slate-100">
										{doc.dealBreakdown.map((d) => (
											<tr key={d.id}>
												<td className="py-3 font-medium text-slate-700">
													{d.client}
												</td>
												<td className="py-3 text-slate-500">
													{d.dealValue}
												</td>
												<td className="py-3 text-right">
													<span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-slate-100 text-slate-500">
														{d.stage}
													</span>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</section>
						)}

						{/* INFLUENCER CAMPAIGN KPIs */}
						{doc.type === "influencer_campaign" &&
							Object.values(doc.influencerKPIs).some(Boolean) && (
								<section>
									<h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-6 font-black">
										Campaign KPIs
									</h3>
									<div className="grid grid-cols-5 gap-4">
										{[
											{
												label: "Views",
												val: doc.influencerKPIs.views,
											},
											{
												label: "Engagement",
												val: doc.influencerKPIs
													.engagement,
											},
											{
												label: "Clicks",
												val: doc.influencerKPIs.clicks,
											},
											{
												label: "Conversions",
												val: doc.influencerKPIs
													.conversions,
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
													{k.val || "—"}
												</p>
											</div>
										))}
									</div>
								</section>
							)}

						{/* INFLUENCER ROSTER — influencer_campaign */}
						{showInfluencers && (
							<section>
								<h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-4 font-black">
									Influencer Roster
								</h3>
								<table className="w-full text-left">
									<thead>
										<tr className="border-b border-slate-900">
											<th className="py-3 text-[10px] uppercase font-black">
												Name
											</th>
											<th className="py-3 text-[10px] uppercase font-black">
												Platform
											</th>
											<th className="py-3 text-[10px] uppercase font-black text-center">
												Followers
											</th>
											<th className="py-3 text-[10px] uppercase font-black text-right">
												Rate
											</th>
											<th className="py-3 text-[10px] uppercase font-black text-right">
												Status
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-slate-100">
										{doc.influencers.map((inf) => (
											<tr key={inf.id}>
												<td className="py-3 font-medium text-slate-700">
													{inf.name}
												</td>
												<td className="py-3 text-slate-500">
													{inf.platform}
												</td>
												<td className="py-3 text-center text-slate-500">
													{inf.followers}
												</td>
												<td className="py-3 text-right font-bold text-slate-700">
													{inf.rate}
												</td>
												<td className="py-3 text-right">
													<span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-slate-100 text-slate-500">
														{inf.status || "—"}
													</span>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</section>
						)}

						{/* ADDITIONAL NOTES — all types */}
						{doc.additionalNotes && (
							<section>
								<h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-4 font-black">
									Additional Notes
								</h3>
								<div className="whitespace-pre-wrap text-slate-700 leading-relaxed text-base">
									{doc.additionalNotes}
								</div>
							</section>
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

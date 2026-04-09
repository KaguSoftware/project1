"use client";
import { useState, type ReactNode } from "react";

import { useAppStore } from "@/src/store";
import { exportToPDF } from "@/src/lib/pdf";
import type { CustomSectionType, CustomSection } from "@/src/store";
import { generateId } from "@/src/store/initialState";
import { t } from "@/src/lib/translations";
import type { LivePreviewProps } from "./types";

import { DocHeader } from "./sections/DocHeader";
import { TextSectionPreview, TermsPreview, DeliverablesPreview, CustomSectionPreview } from "./sections/Common";
import { EngagementOverviewPreview } from "./sections/ProposalContract";
import { InvoicePreview } from "./sections/Invoice";
import { PerformanceMetricsPreview, TopPostsPreview } from "./sections/SocialMedia";
import { SalesMetricsPreview, DealBreakdownPreview } from "./sections/Sales";
import { KPIGridPreview, InfluencerRosterPreview } from "./sections/Influencer";
import { AddSectionBar } from "./AddSectionBar";

type SectionEntry = { id: string; label: string; node: ReactNode };

export const LivePreview = ({ className = "" }: LivePreviewProps) => {
	const { document: doc, updateDocument, language, setLanguage } = useAppStore();
	const [isExporting, setIsExporting] = useState(false);
	const [orderPanelOpen, setOrderPanelOpen] = useState(false);

	const today = new Date().toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	const handleDownload = async () => {
		setIsExporting(true);
		try {
			const filename = `${doc.type}-${
				doc.clientName.replace(/\s+/g, "-").toLowerCase() || "draft"
			}`;
			await exportToPDF(doc, filename, language);
		} catch (err) {
			console.error("PDF export failed:", err);
			alert(`PDF error: ${err instanceof Error ? err.message : String(err)}`);
		} finally {
			setIsExporting(false);
		}
	};

	const addCustomSection = (type: CustomSectionType, header: string) => {
		const next: CustomSection = {
			id: generateId(),
			type,
			header,
			content: "",
			termsRows: type === "terms" ? [] : undefined,
			deliverablesRows: type === "deliverables" ? [] : undefined,
		};
		updateDocument({ customSections: [...doc.customSections, next] });
	};

	const removeCustomSection = (id: string) => {
		updateDocument({
			customSections: doc.customSections.filter((s) => s.id !== id),
			sectionOrder: doc.sectionOrder?.filter((sid) => sid !== id),
		});
	};

	const updateCustomSection = (id: string, updates: Partial<CustomSection>) => {
		updateDocument({
			customSections: doc.customSections.map((s) =>
				s.id === id ? { ...s, ...updates } : s
			),
		});
	};

	// ── Build the available sections for this doc type ───────
	const built: SectionEntry[] = [];
	const push = (id: string, label: string, node: ReactNode) =>
		built.push({ id, label, node });

	if (doc.type === "proposal") {
		if (doc.aiIntro) push("executiveSummary", t("Executive Summary", language),
			<TextSectionPreview text={doc.aiIntro} label="Executive Summary" lang={language} />);
		push("engagementOverview", t("Engagement Overview", language), <EngagementOverviewPreview doc={doc} lang={language} />);
		if (doc.scopeOfWork) push("scopeOfWork", t("Scope of Work", language),
			<TextSectionPreview text={doc.scopeOfWork} label="Scope of Work" lang={language} />);
		push("deliverables", t("Deliverables", language), <DeliverablesPreview rows={doc.deliverables} lang={language} />);
		push("terms", t("Terms & Conditions", language), <TermsPreview doc={doc} label="Terms & Conditions" lang={language} />);
	}
	if (doc.type === "contract") {
		if (doc.agreementOverview) push("agreementOverview", t("Agreement Overview", language),
			<TextSectionPreview text={doc.agreementOverview} label="Agreement Overview" lang={language} />);
		if (doc.scopeOfWork) push("scopeOfServices", t("Scope of Services", language),
			<TextSectionPreview text={doc.scopeOfWork} label="Scope of Services" lang={language} />);
		push("deliverables", t("Deliverables", language), <DeliverablesPreview rows={doc.deliverables} lang={language} />);
	}
	if (doc.type === "invoice") {
		push("invoice", "Invoice", <InvoicePreview doc={doc} lang={language} />);
		push("paymentTerms", t("Payment Terms", language), <TermsPreview doc={doc} label="Payment Terms" lang={language} />);
	}
	if (doc.type === "letter" && doc.body) {
		push("message", t("Message", language), <TextSectionPreview text={doc.body} label="Message" lang={language} />);
	}
	if (doc.type === "social_media_report") {
		if (doc.aiIntro) push("executiveSummary", t("Executive Summary", language),
			<TextSectionPreview text={doc.aiIntro} label="Executive Summary" lang={language} />);
		push("performanceMetrics", t("Performance Metrics", language), <PerformanceMetricsPreview doc={doc} lang={language} />);
		push("topPosts", t("Top Posts", language), <TopPostsPreview doc={doc} lang={language} />);
	}
	if (doc.type === "weekly_sales_report") {
		if (doc.aiIntro) push("weeklySummary", t("Weekly Summary", language),
			<TextSectionPreview text={doc.aiIntro} label="Weekly Summary" lang={language} />);
		push("salesMetrics", t("Sales Metrics", language), <SalesMetricsPreview doc={doc} lang={language} />);
		push("dealBreakdown", t("Deal Breakdown", language), <DealBreakdownPreview doc={doc} lang={language} />);
	}
	if (doc.type === "influencer_campaign") {
		if (doc.campaignOverview) push("campaignOverview", t("Campaign Overview", language),
			<TextSectionPreview text={doc.campaignOverview} label="Campaign Overview" lang={language} />);
		push("kpiGrid", t("Campaign KPIs", language), <KPIGridPreview doc={doc} lang={language} />);
		push("influencerRoster", t("Influencer Roster", language), <InfluencerRosterPreview doc={doc} lang={language} />);
	}

	// Custom sections (use their id directly)
	doc.customSections?.forEach((section) => {
		built.push({
			id: section.id,
			label: section.header || "Custom Section",
			node: (
				<CustomSectionPreview
					section={section}
					doc={doc}
					onRemove={removeCustomSection}
					onUpdate={updateCustomSection}
				/>
			),
		});
	});

	// ── Apply ordering ────────────────────────────────────────
	const order = doc.sectionOrder ?? [];
	const byId = new Map(built.map((s) => [s.id, s]));
	const ordered: SectionEntry[] = [];
	order.forEach((id) => {
		const s = byId.get(id);
		if (s) {
			ordered.push(s);
			byId.delete(id);
		}
	});
	// Append any newly available sections that aren't in the saved order
	built.forEach((s) => {
		if (byId.has(s.id)) ordered.push(s);
	});

	const moveSection = (id: string, dir: "up" | "down") => {
		const ids = ordered.map((s) => s.id);
		const idx = ids.indexOf(id);
		if (idx === -1) return;
		const swap = dir === "up" ? idx - 1 : idx + 1;
		if (swap < 0 || swap >= ids.length) return;
		[ids[idx], ids[swap]] = [ids[swap], ids[idx]];
		updateDocument({ sectionOrder: ids });
	};

	return (
		<div className={`flex-1 relative overflow-y-auto ${className}`}>
			{/* Mobile toggle button */}
			<button
				onClick={() => setOrderPanelOpen((v) => !v)}
				className={`lg:hidden fixed top-4 z-60 bg-slate-900 text-white rounded-full shadow-lg w-12 h-12 flex items-center justify-center transition-all duration-300 ${language === "ar" ? "left-4" : "right-4"}`}
				title="Section order"
			>
				<svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
					<rect
						width="20" height="2" rx="1" fill="white"
						style={{
							transformOrigin: "10px 1px",
							transform: orderPanelOpen ? "rotate(45deg) translateY(6px)" : "none",
							transition: "transform 0.3s ease",
						}}
					/>
					<rect
						y="6" width="20" height="2" rx="1" fill="white"
						style={{
							opacity: orderPanelOpen ? 0 : 1,
							transition: "opacity 0.2s ease",
						}}
					/>
					<rect
						y="12" width="20" height="2" rx="1" fill="white"
						style={{
							transformOrigin: "10px 13px",
							transform: orderPanelOpen ? "rotate(-45deg) translateY(-6px)" : "none",
							transition: "transform 0.3s ease",
						}}
					/>
				</svg>
			</button>

			{/* ── MAIN COLUMN ───────────────────────────────── */}
			<div className="flex flex-col items-center gap-6">
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

				{/* Paper — transform:scale for mobile so the fixed-width PDF surface fits the screen.
				    CSS zoom is non-standard and ignored by Safari/iOS; transform works everywhere. */}
				<style>{`
					/* w-198.5 = 794px fixed PDF surface.
					   transform:scale shrinks visually but keeps layout dimensions.
					   We use margin-bottom to compensate for the "phantom" space. */
					.paper-scale-outer { width: 100%; display: flex; justify-content: center; overflow: visible; }
					.paper-scale-inner { transform-origin: top center; }
					@media (max-width: 639px) {
						.paper-scale-inner { transform: scale(0.42); margin-bottom: calc((0.42 - 1) * 100%); }
					}
					@media (min-width: 640px) and (max-width: 767px) {
						.paper-scale-inner { transform: scale(0.58); margin-bottom: calc((0.58 - 1) * 100%); }
					}
					@media (min-width: 768px) and (max-width: 1023px) {
						.paper-scale-inner { transform: scale(0.72); margin-bottom: calc((0.72 - 1) * 100%); }
					}
				`}</style>
				<div className="paper-scale-outer">
				<div className="paper-scale-inner">
				<div className="shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] mb-4 border border-slate-200 rounded-sm">
					<div
						id="document-page"
						className={`bg-white w-198.5 min-h-280.75 px-16 py-20 relative flex flex-col text-slate-800 pdf-safe-mode${language === "ar" ? " doc-arabic" : ""}`}
					>
						<DocHeader doc={doc} today={today} lang={language} />

						<div className="w-full h-1 bg-slate-900 mb-12" />

						{/* CLIENT / PROJECT ROW */}
						<div className="grid grid-cols-2 gap-8 mb-16">
							<div>
								<p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 font-black">
									{t("Prepared For", language)}
								</p>
								<p className="text-2xl font-bold text-slate-900">
									{doc.clientName || t("Client Name", language)}
								</p>
							</div>
							<div className="text-right">
								<p className="text-2xl font-bold text-slate-900">
									{doc.projectTitle || t("Project Description", language)}
								</p>
							</div>
						</div>

						<div className="flex-1 space-y-12">
							{ordered.map((s) => (
								<div key={s.id}>{s.node}</div>
							))}
						</div>

						{/* FOOTER */}
						<div className="w-full h-px bg-slate-200 mb-6 mt-20" />
						<div className="flex justify-between items-center text-slate-400">
							<p className="text-[10px] tracking-widest uppercase font-bold italic">
								GENBUZZ INTERNAL SYSTEMS
							</p>
							<p className="text-[10px] tracking-widest uppercase font-bold">
								{t("Confidential", language)} • {new Date().getFullYear()}
							</p>
						</div>
					</div>
				</div>
				</div>
				</div>

				{/* ── ADD SECTION BAR — outside pdf-safe-mode ───── */}
				<div className="hidden lg:block w-full max-w-198.5 px-2 mb-20">
					<AddSectionBar onAdd={addCustomSection} />
				</div>
			</div>

			{/* ── ORDER PANEL (overlay, right side) ─────────── */}
			{/* Mobile backdrop */}
			{orderPanelOpen && (
				<div
					onClick={() => setOrderPanelOpen(false)}
					className="lg:hidden fixed inset-0 bg-black/30 z-40"
				/>
			)}
			<aside
				className={`fixed top-1/2 -translate-y-1/2 z-50 max-h-[90vh] overflow-y-auto
					transition-all duration-300 ease-out
					${language === "ar" ? "left-3" : "right-3"}
					${orderPanelOpen
						? "opacity-100 scale-100 pointer-events-auto"
						: "opacity-0 scale-95 pointer-events-none lg:opacity-100 lg:scale-100 lg:pointer-events-auto"
					}`}
			>
				<div className="relative pl-7 pr-4 py-5 w-76 lg:w-64 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/70 shadow-[0_12px_40px_-12px_rgba(15,23,42,0.3)]">
					<p className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400 mb-3 pl-1">
						Section Order
					</p>

					{/* Language toggle — mobile only (desktop has it in the sidebar) */}
					<div className="lg:hidden flex items-center gap-2 bg-slate-100 p-1 rounded-lg border border-slate-200 mb-4 ml-1 w-fit">
						<button
							onClick={() => setLanguage("en")}
							className={`px-2.5 py-0.5 text-[10px] font-bold rounded-md transition-all ${language === "en" ? "bg-white shadow-sm text-primary" : "text-slate-500"}`}
						>
							EN
						</button>
						<button
							onClick={() => setLanguage("ar")}
							className={`px-2.5 py-0.5 text-[10px] font-bold rounded-md transition-all ${language === "ar" ? "bg-white shadow-sm text-primary" : "text-slate-500"}`}
						>
							AR
						</button>
						<button
							onClick={() => setLanguage("tr")}
							className={`px-2.5 py-0.5 text-[10px] font-bold rounded-md transition-all ${language === "tr" ? "bg-white shadow-sm text-primary" : "text-slate-500"}`}
						>
							TR
						</button>
					</div>
					{/* Vertical axis line */}
					<div className="absolute left-4 top-12 bottom-4 w-px bg-linear-to-b from-transparent via-slate-300 to-transparent" />

					<ul className="space-y-1.5 lg:space-y-1">
						{ordered.map((s, idx) => (
							<li key={s.id} className="relative flex items-center group gap-2">
								<span className="absolute -left-[0.85rem] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-300 group-hover:bg-slate-900 transition-colors ring-2 ring-white" />
								<span className="flex-1 truncate text-sm lg:text-[12px] font-medium text-slate-700 px-2 py-2 lg:py-1.5 rounded-md group-hover:bg-slate-100/70 transition-colors">
									{s.label}
								</span>
								<div className="flex flex-col items-center shrink-0 -space-y-1">
									<button
										onClick={() => moveSection(s.id, "up")}
										disabled={idx === 0}
										className="text-slate-400 hover:text-slate-900 disabled:opacity-20 disabled:hover:text-slate-400 w-7 h-7 lg:w-5 lg:h-5 flex items-center justify-center leading-none text-base lg:text-sm"
										title="Move up"
									>
										↑
									</button>
									<button
										onClick={() => moveSection(s.id, "down")}
										disabled={idx === ordered.length - 1}
										className="text-slate-400 hover:text-slate-900 disabled:opacity-20 disabled:hover:text-slate-400 w-7 h-7 lg:w-5 lg:h-5 flex items-center justify-center leading-none text-base lg:text-sm"
										title="Move down"
									>
										↓
									</button>
								</div>
							</li>
						))}
					</ul>
					{ordered.length === 0 && (
						<p className="text-[10px] text-slate-400 italic px-2">Empty</p>
					)}

					{/* Add section — mobile only (desktop has it under the paper) */}
					<div className="lg:hidden mt-4 pt-4 border-t border-slate-200/70">
						<p className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2 pl-1">
							Add Section
						</p>
						<AddSectionBar onAdd={addCustomSection} />
					</div>
				</div>
			</aside>
		</div>
	);
};

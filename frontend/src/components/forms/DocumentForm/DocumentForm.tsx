"use client";
import { useState } from "react";
import { useAppStore, DocType } from "@/src/store";
import { t } from "@/src/lib/translations";
import {
	SparklesIcon,
	FileTextIcon,
	LayoutGridIcon,
	ReceiptIcon,
	TypeIcon,
	BarChart3Icon,
	UsersIcon,
} from "lucide-react";

import { ProposalFields } from "./sections/ProposalFields";
import { ContractFields } from "./sections/ContractFields";
import { InvoiceFields } from "./sections/InvoiceFields";
import { LetterFields } from "./sections/LetterFields";
import { SocialMediaFields } from "./sections/SocialMediaFields";
import { SalesFields } from "./sections/SalesFields";
import { InfluencerFields } from "./sections/InfluencerFields";
import { FormField, inputClass } from "./ui/FormField";
import { TrashIcon } from "lucide-react";
import type { CustomSection, CustomSectionType, DeliverableRow } from "@/src/store";
import { generateId } from "@/src/store/initialState";
import { AddSectionBar } from "@/src/components/preview/LivePreview/AddSectionBar";

const rowId = () => Math.random().toString(36).substring(2, 11);

export const DocumentForm = () => {
	const { document, updateDocument, language, hiddenFields, hideField, showAllFields } = useAppStore();
	const [isGenerating, setIsGenerating] = useState(false);
	const [packageCount, setPackageCount] = useState<1 | 2 | 3>(1);

	const handleGenerate = async () => {
		setIsGenerating(true);
		try {
			const response = await fetch("/api/generate-intro", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ...document, language, packageCount }),
			});

			const ai = await response.json();
			if (ai.error) throw new Error(ai.error);

			const genId = () => Math.random().toString(36).substring(2, 11);

			// Build a partial update — only include keys the AI actually returned
			const update: Partial<typeof document> = {};

			// Scalar fields
			if (ai.aiIntro) update.aiIntro = ai.aiIntro;
			if (ai.scopeOfWork) update.scopeOfWork = ai.scopeOfWork;
			if (ai.agreementOverview)
				update.agreementOverview = ai.agreementOverview;
			if (ai.campaignOverview)
				update.campaignOverview = ai.campaignOverview;
			if (ai.body) update.body = ai.body;
			if (ai.pricingPackage) update.pricingPackage = ai.pricingPackage;
			if (ai.defaultCurrency) update.defaultCurrency = ai.defaultCurrency;
			if (ai.totalPrice) update.totalPrice = ai.totalPrice;
			if (ai.timeline) update.timeline = ai.timeline;
			if (ai.validUntil) update.validUntil = ai.validUntil;

			// KPIs object (influencer)
			if (ai.influencerKPIs) update.influencerKPIs = ai.influencerKPIs;

			// Array fields — attach a generated id to each item
			if (Array.isArray(ai.pricingTiers) && ai.pricingTiers.length > 0)
				update.pricingTiers = ai.pricingTiers.map((tier: any) => ({
					id: genId(),
					name: tier.name ?? "",
					price: tier.price ?? "",
					description: tier.description ?? "",
					isPopular: tier.isPopular ?? false,
				}));

			if (Array.isArray(ai.deliverables) && ai.deliverables.length > 0)
				update.deliverables = ai.deliverables.map((d: any) => ({
					id: genId(),
					...d,
				}));

			if (
				Array.isArray(ai.termsAndConditions) &&
				ai.termsAndConditions.length > 0
			)
				update.termsAndConditions = ai.termsAndConditions.map(
					(t: any) => ({
						id: genId(),
						text: typeof t === "string" ? t : (t.text ?? ""),
					}),
				);

			if (Array.isArray(ai.lineItems) && ai.lineItems.length > 0)
				update.lineItems = ai.lineItems.map((item: any) => ({
					id: genId(),
					description: item.description ?? "",
					qty: Number(item.qty) || 1,
					rate: Number(item.rate) || 0,
					amount:
						Number(item.amount) ||
						Number(item.qty) * Number(item.rate) ||
						0,
				}));

			if (
				Array.isArray(ai.performanceMetrics) &&
				ai.performanceMetrics.length > 0
			)
				update.performanceMetrics = ai.performanceMetrics.map(
					(m: any) => ({ id: genId(), ...m }),
				);

			if (Array.isArray(ai.topPosts) && ai.topPosts.length > 0)
				update.topPosts = ai.topPosts.map((p: any) => ({
					id: genId(),
					...p,
				}));

			if (Array.isArray(ai.salesMetrics) && ai.salesMetrics.length > 0)
				update.salesMetrics = ai.salesMetrics.map((m: any) => ({
					id: genId(),
					...m,
				}));

			if (Array.isArray(ai.dealBreakdown) && ai.dealBreakdown.length > 0)
				update.dealBreakdown = ai.dealBreakdown.map((d: any) => ({
					id: genId(),
					...d,
				}));

			if (Array.isArray(ai.influencers) && ai.influencers.length > 0)
				update.influencers = ai.influencers.map((inf: any) => ({
					id: genId(),
					...inf,
				}));

			updateDocument(update);
		} catch (error) {
			console.error("Generation failed:", error);
		} finally {
			setIsGenerating(false);
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
		updateDocument({ customSections: [...document.customSections, next] });
	};

	const removeCustomSection = (id: string) => {
		updateDocument({
			customSections: document.customSections.filter((s) => s.id !== id),
			sectionOrder: document.sectionOrder?.filter((sid) => sid !== id),
		});
	};

	const categories = [
		{ id: "proposal", label: "Proposal", icon: FileTextIcon },
		{ id: "contract", label: "Contract", icon: LayoutGridIcon },
		{ id: "invoice", label: "Invoice", icon: ReceiptIcon },
		{ id: "letter", label: "Letter", icon: TypeIcon },
		{ id: "social_media_report", label: "Social", icon: BarChart3Icon },
		{ id: "weekly_sales_report", label: "Sales", icon: BarChart3Icon },
		{ id: "influencer_campaign", label: "Influencer Type", icon: UsersIcon },
	];
	const tr = (key: string) => t(key, language);

	return (
		<div className="w-full max-w-4xl mx-auto space-y-12 pb-40">
			{/* 1. Category Selector */}
			<section>
				<label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4 px-1">
					{tr("Select Document Category")}
				</label>
				<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
					{categories.map((item) => (
						<button
							key={item.id}
							onClick={() =>
								updateDocument({ type: item.id as DocType })
							}
							className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
								document.type === item.id
									? "border-primary bg-primary/5 text-primary shadow-sm"
									: "border-slate-100 bg-white text-slate-400 hover:border-slate-200"
							}`}
						>
							<item.icon size={20} />
							<span className="text-[10px] font-bold uppercase tracking-wider text-center">
								{tr(item.label)}
							</span>
						</button>
					))}
				</div>
			</section>

			{/* Add Section Bar */}
			<div className="relative">
				<AddSectionBar onAdd={addCustomSection} direction="down" />
			</div>

			{/* Restore hidden fields banner */}
			{hiddenFields.length > 0 && (
				<div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
					<span className="text-[11px] font-black uppercase tracking-widest text-amber-600">
						{hiddenFields.length} field{hiddenFields.length > 1 ? "s" : ""} hidden
					</span>
					<button
						type="button"
						onClick={showAllFields}
						className="text-[11px] font-black uppercase tracking-widest text-amber-700 hover:text-amber-900 transition-colors"
					>
						Restore all
					</button>
				</div>
			)}

			{/* 2. Global Identity Block */}
			<section className="space-y-6 bg-slate-50/50 p-8 rounded-3xl border border-slate-200">
				{!hiddenFields.includes("additionalInstructions") && (
					<FormField label="Additional Instructions" onDelete={() => hideField("additionalInstructions")}>
						<textarea
							className={`${inputClass} h-20`}
							placeholder="e.g. Use formal Arabic, focus on ROI, avoid technical jargon…"
							value={document.additionalInstructions}
							onChange={(e) =>
								updateDocument({ additionalInstructions: e.target.value })
							}
						/>
					</FormField>
				)}
				{document.type === "proposal" && (
					<div className="flex items-center gap-3">
						<span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 shrink-0">
							{t("Packages", language)}
						</span>
						<div className="flex gap-1">
							{([1, 2, 3] as const).map((n) => (
								<button
									key={n}
									onClick={() => setPackageCount(n)}
									className={`w-8 h-8 rounded-lg text-xs font-black border transition-all ${
										packageCount === n
											? "bg-primary text-white border-primary"
											: "bg-white text-slate-400 border-slate-200 hover:border-primary/40"
									}`}
								>
									{n}
								</button>
							))}
						</div>
					</div>
				)}
				{!hiddenFields.includes("projectTitle") && (
					<FormField label="Project Title" onDelete={() => hideField("projectTitle")}>
						<input
							type="text"
							className={inputClass}
							placeholder="e.g. Q4 Growth Phase"
							value={document.projectTitle}
							onChange={(e) =>
								updateDocument({ projectTitle: e.target.value })
							}
						/>
					</FormField>
				)}
				{!hiddenFields.includes("clientName") && (
					<FormField label="Client Name" onDelete={() => hideField("clientName")}>
						<input
							type="text"
							className={inputClass}
							placeholder="e.g. Acme Corp"
							value={document.clientName}
							onChange={(e) =>
								updateDocument({ clientName: e.target.value })
							}
						/>
					</FormField>
				)}
			</section>

			{/* 3. Dynamic Section Switcher */}
			<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
				{document.type === "proposal" && <ProposalFields />}
				{document.type === "contract" && <ContractFields />}
				{document.type === "invoice" && <InvoiceFields />}
				{document.type === "letter" && <LetterFields />}
				{document.type === "social_media_report" && (
					<SocialMediaFields />
				)}
				{document.type === "weekly_sales_report" && <SalesFields />}
				{document.type === "influencer_campaign" && (
					<InfluencerFields />
				)}
			</div>
			{/* 4. Custom Sections (added via AddSectionBar in preview) */}
			{document.customSections && document.customSections.length > 0 && (
				<section className="space-y-6">
					<label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2 px-1">
						{tr("Custom Sections")}
					</label>
					{document.customSections.map((s) => (
						<div
							key={s.id}
							className="space-y-4 bg-slate-50/50 p-6 rounded-2xl border border-slate-200 relative"
						>
							<button
								type="button"
								onClick={() => removeCustomSection(s.id)}
								className="absolute top-4 right-4 text-slate-300 hover:text-red-400 transition-colors"
								title="Remove section"
							>
								<TrashIcon size={14} />
							</button>
							<FormField label="Section Header">
								<input
									type="text"
									className={inputClass}
									placeholder="Section header"
									value={s.header}
									onChange={(e) =>
										updateDocument({
											customSections:
												document.customSections.map(
													(c) =>
														c.id === s.id
															? {
																	...c,
																	header: e
																		.target
																		.value,
																}
															: c,
												),
										})
									}
								/>
							</FormField>
							{(() => {
								const patch = (
									updates: Partial<CustomSection>,
								) =>
									updateDocument({
										customSections:
											document.customSections.map((c) =>
												c.id === s.id
													? { ...c, ...updates }
													: c,
											),
									});

								if (s.type === "text") {
									return (
										<FormField label="Content">
											<textarea
												className={`${inputClass} min-h-32`}
												placeholder="Write your content here…"
												value={s.content}
												onChange={(e) =>
													patch({
														content: e.target.value,
													})
												}
											/>
										</FormField>
									);
								}

								if (s.type === "terms") {
									const rows = s.termsRows ?? [];
									return (
										<div className="space-y-3">
											<label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-1">
												{tr("Clauses")}
											</label>
											{rows.map((clause, idx) => (
												<div
													key={clause.id}
													className="flex gap-3 items-center group"
												>
													<div className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-xs font-black text-slate-400 border border-slate-200">
														{idx + 1}
													</div>
													<input
														type="text"
														className={inputClass}
														value={clause.text}
														onChange={(e) =>
															patch({
																termsRows:
																	rows.map(
																		(c) =>
																			c.id ===
																			clause.id
																				? {
																						...c,
																						text: e
																							.target
																							.value,
																					}
																				: c,
																	),
															})
														}
													/>
													<button
														onClick={() =>
															patch({
																termsRows:
																	rows.filter(
																		(c) =>
																			c.id !==
																			clause.id,
																	),
															})
														}
														className="btn btn-ghost btn-circle btn-sm text-slate-300 hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
													>
														<TrashIcon size={16} />
													</button>
												</div>
											))}
											<button
												onClick={() =>
													patch({
														termsRows: [
															...rows,
															{
																id: rowId(),
																text: "",
															},
														],
													})
												}
												className="btn btn-ghost btn-sm text-primary font-bold"
											>
												{tr("+ Add Clause")}
</button>
										</div>
									);
								}

								if (s.type === "deliverables") {
									const rows: DeliverableRow[] =
										s.deliverablesRows ?? [];
									return (
										<div className="space-y-3">
											<label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-1">
												{tr("Deliverables")}
											</label>
											<div className="grid grid-cols-12 gap-3 px-1 text-[10px] font-black uppercase text-slate-400">
												<div className="col-span-5">{tr("Deliverable")}</div>
												<div className="col-span-3">{tr("Timeline")}</div>
												<div className="col-span-3">{tr("Status")}</div>
											</div>
											{rows.map((row) => (
												<div
													key={row.id}
													className="grid grid-cols-12 gap-3 items-center group"
												>
													<input
														className={`${inputClass} col-span-5 py-2`}
														placeholder="e.g. Brand Strategy Deck"
														value={row.deliverable}
														onChange={(e) =>
															patch({
																deliverablesRows:
																	rows.map(
																		(r) =>
																			r.id ===
																			row.id
																				? {
																						...r,
																						deliverable:
																							e
																								.target
																								.value,
																					}
																				: r,
																	),
															})
														}
													/>
													<input
														className={`${inputClass} col-span-3 py-2`}
														placeholder="e.g. Week 2"
														value={row.timeline}
														onChange={(e) =>
															patch({
																deliverablesRows:
																	rows.map(
																		(r) =>
																			r.id ===
																			row.id
																				? {
																						...r,
																						timeline:
																							e
																								.target
																								.value,
																					}
																				: r,
																	),
															})
														}
													/>
													<input
														className={`${inputClass} col-span-3 py-2`}
														placeholder="Pending"
														value={row.status}
														onChange={(e) =>
															patch({
																deliverablesRows:
																	rows.map(
																		(r) =>
																			r.id ===
																			row.id
																				? {
																						...r,
																						status: e
																							.target
																							.value,
																					}
																				: r,
																	),
															})
														}
													/>
													<button
														onClick={() =>
															patch({
																deliverablesRows:
																	rows.filter(
																		(r) =>
																			r.id !==
																			row.id,
																	),
															})
														}
														className="col-span-1 text-slate-300 hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
													>
														<TrashIcon size={14} />
													</button>
												</div>
											))}
											<button
												onClick={() =>
													patch({
														deliverablesRows: [
															...rows,
															{
																id: rowId(),
																deliverable: "",
																timeline: "",
																status: "Pending",
															},
														],
													})
												}
												className="btn btn-ghost btn-sm text-primary font-bold"
											>
												{tr("+ Add Deliverable")}
</button>
										</div>
									);
								}

								return null;
							})()}
						</div>
					))}
				</section>
			)}

			<div className={`fixed bottom-0 w-full lg:w-150 xl:w-162.5 z-50 pointer-events-none ${language === "ar" ? "right-0" : "left-0"}`}>
				<div className="h-10 bg-linear-to-t from-white to-transparent" />
				<div className="bg-white/90 backdrop-blur-sm border-t border-slate-100 px-6 lg:px-10 py-5 shadow-[0_-6px_30px_-4px_rgba(0,0,0,0.08)] pointer-events-auto">
					<button
						onClick={handleGenerate}
						disabled={isGenerating}
						className="btn btn-primary w-full h-14 rounded-2xl shadow-lg shadow-primary/20 gap-3 text-base font-black uppercase tracking-widest transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:bg-slate-400"
					>
						<SparklesIcon
							size={20}
							className={
								isGenerating ? "animate-spin" : "animate-pulse"
							}
						/>
						{isGenerating
							? tr("Synthesizing...")
							: `${tr("Generate")} ${document.type.replace(/_/g, " ")}`}
					</button>
				</div>
			</div>
		</div>
	);
};

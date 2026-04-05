"use client";
import { useState } from "react";
import { useAppStore, DocType } from "@/src/store";
import {
	SparklesIcon,
	FileTextIcon,
	LayoutGridIcon,
	ReceiptIcon,
	TypeIcon,
	BarChart3Icon,
	UsersIcon,
} from "lucide-react";

// Import all your modular sections
import { ProposalFields } from "./sections/ProposalFields";
import { ContractFields } from "./sections/ContractFields";
import { InvoiceFields } from "./sections/InvoiceFields";
import { LetterFields } from "./sections/LetterFields";
import { SocialMediaFields } from "./sections/SocialMediaFields";
import { SalesFields } from "./sections/SalesFields";
import { InfluencerFields } from "./sections/InfluencerFields";
import { FormField, inputClass } from "./ui/FormField";

export const DocumentForm = () => {
	const { document, updateDocument } = useAppStore();
	const [isGenerating, setIsGenerating] = useState(false);

	// The AI Generation Trigger
	const handleGenerate = async () => {
		setIsGenerating(true);
		try {
			const response = await fetch("/api/generate-intro", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(document),
			});

			const aiData = await response.json();

			if (!response.ok || aiData.error) {
				console.error(
					"AI Generation failed on the backend:",
					aiData.error,
				);
				alert("AI generation failed. Check the console for details.");
				return;
			}

			const safeTerms = Array.isArray(aiData.termsAndConditions)
				? aiData.termsAndConditions
				: document.termsAndConditions;

			const safeDeliverables = Array.isArray(aiData.deliverables)
				? aiData.deliverables
				: document.deliverables;

			if (document.type === "proposal") {
				updateDocument({
					aiIntro: aiData.aiIntro ?? document.aiIntro,
					scopeOfWork: aiData.scopeOfWork ?? document.scopeOfWork,
					pricingPackage:
						aiData.pricingPackage ?? document.pricingPackage,
					defaultCurrency:
						aiData.defaultCurrency ?? document.defaultCurrency,
					totalPrice: aiData.totalPrice ?? document.totalPrice,
					timeline: aiData.timeline ?? document.timeline,
					validUntil: aiData.validUntil ?? document.validUntil,
					deliverables: safeDeliverables.map((d: any) => ({
						id: d.id || crypto.randomUUID(),
						deliverable: d.deliverable || "",
						timeline: d.timeline || "",
						status: d.status || "Pending",
					})),
					termsAndConditions: safeTerms.map((t: any) => ({
						id: t.id || crypto.randomUUID(),
						text: typeof t === "string" ? t : t.text || "",
					})),
				});
				return;
			}

			if (document.type === "contract") {
				updateDocument({
					aiIntro: aiData.aiIntro ?? document.aiIntro,
					agreementOverview:
						aiData.agreementOverview ?? document.agreementOverview,
					scopeOfWork: aiData.scopeOfWork ?? document.scopeOfWork,
					deliverables: safeDeliverables.map((d: any) => ({
						id: d.id || crypto.randomUUID(),
						deliverable: d.deliverable || "",
						timeline: d.timeline || "",
						status: d.status || "Pending",
					})),
					termsAndConditions: safeTerms.map((t: any) => ({
						id: t.id || crypto.randomUUID(),
						text: typeof t === "string" ? t : t.text || "",
					})),
				});
				return;
			}

			updateDocument({
				aiIntro: aiData.aiIntro ?? document.aiIntro,
			});
		} catch (error) {
			console.error("AI transfer failed:", error);
		} finally {
			setIsGenerating(false);
		}
	};

	const categories = [
		{ id: "proposal", label: "Proposal", icon: FileTextIcon },
		{ id: "contract", label: "Contract", icon: LayoutGridIcon },
		{ id: "invoice", label: "Invoice", icon: ReceiptIcon },
		{ id: "letter", label: "Letter", icon: TypeIcon },
		{ id: "social_media_report", label: "Social", icon: BarChart3Icon },
		{ id: "weekly_sales_report", label: "Sales", icon: BarChart3Icon },
		{ id: "influencer_campaign", label: "Influencer", icon: UsersIcon },
	];

	return (
		<div className="w-full max-w-4xl mx-auto space-y-12 pb-32">
			{/* 1. Category Selector */}
			<section>
				<label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4 px-1">
					Select Document Category
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
								{item.label}
							</span>
						</button>
					))}
				</div>
			</section>

			{/* 2. Global Identity Block */}
			<section className="space-y-6 bg-slate-50/50 p-8 rounded-3xl border border-slate-200">
				<FormField label="Project Title">
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
				<FormField label="Client Name">
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

			{/* 4. Floating Action Bar */}
			<div className="fixed bottom-10 left-81.25 right-106.25 flex justify-center z-50 pointer-events-none">
				<div className="w-full max-w-xl pointer-events-auto">
					<button
						onClick={handleGenerate}
						disabled={isGenerating}
						className="btn btn-primary w-full h-16 rounded-2xl shadow-2xl shadow-primary/30 gap-4 text-lg font-black uppercase tracking-widest transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:bg-slate-400"
					>
						<SparklesIcon
							size={22}
							className={
								isGenerating ? "animate-spin" : "animate-pulse"
							}
						/>
						{isGenerating
							? "Synthesizing..."
							: `Generate ${document.type.replace(/_/g, " ")}`}
					</button>
				</div>
			</div>
		</div>
	);
};

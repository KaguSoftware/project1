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

	const handleGenerate = async () => {
		setIsGenerating(true);
		try {
			const response = await fetch("/api/generate-intro", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(document),
			});

			const aiData = await response.json();

			updateDocument({
				aiIntro: aiData.aiIntro ?? document.aiIntro,
				scopeOfWork: aiData.scopeOfWork ?? document.scopeOfWork,
				// Guard both arrays — API may omit them on partial responses
				deliverables: (aiData.deliverables ?? []).map((d: any) => ({
					id: Math.random().toString(36).substr(2, 9),
					...d,
				})),
				termsAndConditions: (aiData.terms ?? []).map((t: string) => ({
					id: Math.random().toString(36).substr(2, 9),
					text: t,
				})),
			});
		} catch (error) {
			console.error("Generation failed:", error);
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
		<div className="w-full max-w-4xl mx-auto space-y-12 pb-40">
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
			<div className="fixed bottom-0 left-0 w-full lg:w-150 xl:w-162.5 z-50 pointer-events-none">
				<div className="h-10 bg-gradient-to-t from-white to-transparent" />
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
							? "Synthesizing..."
							: `Generate ${document.type.replace(/_/g, " ")}`}
					</button>
				</div>
			</div>
		</div>
	);
};

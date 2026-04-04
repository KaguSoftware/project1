"use client";
import { useAppStore } from "@/src/store";
import { FileTextIcon, TrashIcon } from "lucide-react";
import { FormField, inputClass } from "../ui/FormField";
import { SectionHeader } from "../ui/SectionHeader";

export const ProposalFields = () => {
	const {
		document,
		updateDocument,
		addArrayItem,
		updateArrayItem,
		removeArrayItem,
	} = useAppStore();

	return (
		<div className="space-y-8">
			<SectionHeader title="Proposal Details" icon={FileTextIcon} />

			<FormField label="Executive Introduction">
				<textarea
					className={`${inputClass} h-32`}
					placeholder="AI will help refine this..."
					value={document.aiIntro}
					onChange={(e) =>
						updateDocument({ aiIntro: e.target.value })
					}
				/>
			</FormField>

			<FormField label="Scope of Work">
				<textarea
					className={`${inputClass} h-32`}
					value={document.scopeOfWork}
					onChange={(e) =>
						updateDocument({ scopeOfWork: e.target.value })
					}
				/>
			</FormField>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				<FormField label="Pricing Package">
					<div className="grid grid-cols-3 gap-2 p-1.5 bg-white border border-slate-300 rounded-2xl">
						{["basic", "standard", "premium"].map((pkg) => (
							<button
								key={pkg}
								className={`py-2 text-[10px] font-black uppercase rounded-xl transition-all ${document.pricingPackage === pkg ? "bg-primary text-white" : "text-slate-400 hover:bg-slate-50"}`}
								onClick={() =>
									updateDocument({
										pricingPackage: pkg as any,
									})
								}
							>
								{pkg}
							</button>
						))}
					</div>
				</FormField>
				<FormField label="Timeline">
					<input
						type="text"
						className={inputClass}
						value={document.timeline}
						onChange={(e) =>
							updateDocument({ timeline: e.target.value })
						}
					/>
				</FormField>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<FormField label="Currency">
					<input
						type="text"
						className={inputClass}
						value={document.defaultCurrency}
						onChange={(e) =>
							updateDocument({ defaultCurrency: e.target.value })
						}
					/>
				</FormField>
				<FormField label="Total Price">
					<input
						type="text"
						className={inputClass}
						value={document.totalPrice}
						onChange={(e) =>
							updateDocument({ totalPrice: e.target.value })
						}
					/>
				</FormField>
				<FormField label="Valid Until">
					<input
						type="text"
						className={inputClass}
						value={document.validUntil}
						onChange={(e) =>
							updateDocument({ validUntil: e.target.value })
						}
					/>
				</FormField>
			</div>

			<div className="space-y-4">
				<label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-1">
					Terms & Conditions
				</label>
				{document.termsAndConditions.map((clause, idx) => (
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
								updateArrayItem(
									"termsAndConditions",
									clause.id,
									{ text: e.target.value },
								)
							}
						/>
						<button
							onClick={() =>
								removeArrayItem("termsAndConditions", clause.id)
							}
							className="btn btn-ghost btn-circle btn-sm text-slate-300 hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
						>
							<TrashIcon size={16} />
						</button>
					</div>
				))}
				<button
					onClick={() =>
						addArrayItem("termsAndConditions", { text: "" })
					}
					className="btn btn-ghost btn-sm text-primary font-bold"
				>
					+ Add Clause
				</button>
			</div>
		</div>
	);
};

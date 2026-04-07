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
					{/* Tier selector */}
					<div className="grid grid-cols-3 gap-2 p-1.5 bg-white border border-slate-300 rounded-2xl mb-3">
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
					{/* Per-tier details */}
					<div className="space-y-3">
						{(document.pricingTiers ?? []).map((tier) => (
							<div key={tier.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
								<p className={`text-[10px] font-black uppercase tracking-widest ${document.pricingPackage === tier.name ? "text-primary" : "text-slate-400"}`}>
									{tier.name} {document.pricingPackage === tier.name ? "(selected)" : ""}
								</p>
								<div className="grid grid-cols-2 gap-3">
									<input
										type="text"
										className={inputClass}
										placeholder="Price (e.g. 999)"
										value={tier.price}
										onChange={(e) =>
											updateDocument({
												pricingTiers: document.pricingTiers.map((t) =>
													t.id === tier.id ? { ...t, price: e.target.value } : t
												),
											})
										}
									/>
									<label className="flex items-center gap-2 cursor-pointer">
										<input
											type="checkbox"
											className="checkbox checkbox-primary checkbox-sm"
											checked={tier.isPopular}
											onChange={(e) =>
												updateDocument({
													pricingTiers: document.pricingTiers.map((t) =>
														t.id === tier.id ? { ...t, isPopular: e.target.checked } : t
													),
												})
											}
										/>
										<span className="text-[10px] font-black uppercase text-slate-500">Popular</span>
									</label>
								</div>
								<input
									type="text"
									className={inputClass}
									placeholder="Short description"
									value={tier.description}
									onChange={(e) =>
										updateDocument({
											pricingTiers: document.pricingTiers.map((t) =>
												t.id === tier.id ? { ...t, description: e.target.value } : t
											),
										})
									}
								/>
							</div>
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

			{/* ── Deliverables ─────────────────────────────────────────── */}
			<div className="space-y-4">
				<label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-1">
					Deliverables
				</label>
				<div className="grid grid-cols-12 gap-4 px-1 text-[10px] font-black uppercase text-slate-400">
					<div className="col-span-5">Deliverable</div>
					<div className="col-span-3">Timeline</div>
					<div className="col-span-3">Status</div>
				</div>
				{document.deliverables.map((row) => (
					<div
						key={row.id}
						className="grid grid-cols-12 gap-3 items-center group"
					>
						<input
							className={`${inputClass} col-span-5 py-2`}
							placeholder="e.g. Brand Strategy Deck"
							value={row.deliverable}
							onChange={(e) =>
								updateArrayItem("deliverables", row.id, {
									deliverable: e.target.value,
								})
							}
						/>
						<input
							className={`${inputClass} col-span-3 py-2`}
							placeholder="e.g. Week 2"
							value={row.timeline}
							onChange={(e) =>
								updateArrayItem("deliverables", row.id, {
									timeline: e.target.value,
								})
							}
						/>
						<input
							className={`${inputClass} col-span-3 py-2`}
							placeholder="Pending"
							value={row.status}
							onChange={(e) =>
								updateArrayItem("deliverables", row.id, {
									status: e.target.value,
								})
							}
						/>
						<button
							onClick={() =>
								removeArrayItem("deliverables", row.id)
							}
							className="col-span-1 text-slate-300 hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
						>
							<TrashIcon size={14} />
						</button>
					</div>
				))}
				<button
					onClick={() =>
						addArrayItem("deliverables", {
							deliverable: "",
							timeline: "",
							status: "Pending",
						})
					}
					className="btn btn-ghost btn-sm text-primary font-bold"
				>
					+ Add Deliverable
				</button>
			</div>

			{/* ── Terms & Conditions ───────────────────────────────────── */}
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

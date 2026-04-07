"use client";
import { useAppStore } from "@/src/store";
import { FileTextIcon, TrashIcon, PlusIcon } from "lucide-react";
import { t } from "@/src/lib/translations";
import { FormField, inputClass } from "../ui/FormField";
import { SectionHeader } from "../ui/SectionHeader";
import { generateId } from "@/src/store/initialState";

export const ProposalFields = () => {
	const {
		document,
		updateDocument,
		addArrayItem,
		updateArrayItem,
		removeArrayItem,
		language,
		hiddenFields,
		hideField,
	} = useAppStore();

	const tr = (key: string) => t(key, language);

	const addTier = () => {
		updateDocument({
			pricingTiers: [
				...document.pricingTiers,
				{ id: generateId(), name: "New Package", price: "", description: "", isPopular: false },
			],
		});
	};

	const removeTier = (id: string) => {
		updateDocument({
			pricingTiers: document.pricingTiers.filter((t) => t.id !== id),
		});
	};

	const updateTier = (id: string, patch: Partial<typeof document.pricingTiers[0]>) => {
		updateDocument({
			pricingTiers: document.pricingTiers.map((t) =>
				t.id === id ? { ...t, ...patch } : t
			),
		});
	};

	return (
		<div className="space-y-8">
			<SectionHeader title="Proposal Details" icon={FileTextIcon} />

			{!hiddenFields.includes("aiIntro") && (
				<FormField label="Executive Introduction" onDelete={() => hideField("aiIntro")}>
					<textarea
						className={`${inputClass} h-32`}
						placeholder={tr("AI will help refine this...")}
						value={document.aiIntro}
						onChange={(e) =>
							updateDocument({ aiIntro: e.target.value })
						}
					/>
				</FormField>
			)}

			{!hiddenFields.includes("scopeOfWork") && (
				<FormField label="Scope of Work" onDelete={() => hideField("scopeOfWork")}>
					<textarea
						className={`${inputClass} h-32`}
						value={document.scopeOfWork}
						onChange={(e) =>
							updateDocument({ scopeOfWork: e.target.value })
						}
					/>
				</FormField>
			)}

			{/* ── Pricing Packages ─────────────────────────────────────────── */}
			<div className="space-y-4">
				<div className="flex items-center justify-between px-1">
					<label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
						{tr("Pricing Packages")}
					</label>
					<button
						onClick={addTier}
						className="flex items-center gap-1 text-[10px] font-black uppercase text-primary hover:text-primary/70 transition-colors"
					>
						<PlusIcon size={12} /> {tr("Add Package")}
					</button>
				</div>

				{/* Highlighted package selector */}
				<div className="flex items-center gap-2 px-1">
					<span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
						{tr("Highlight")}:
					</span>
					<div className="flex gap-2 flex-wrap">
						{document.pricingTiers.map((tier) => (
							<button
								key={tier.id}
								onClick={() => updateDocument({ pricingPackage: tier.name })}
								className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase transition-all border ${
									document.pricingPackage === tier.name
										? "bg-primary text-white border-primary"
										: "bg-white text-slate-500 border-slate-200 hover:border-slate-400"
								}`}
							>
								{tier.name}
							</button>
						))}
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{(document.pricingTiers ?? []).map((tier) => (
						<div key={tier.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 group/tier relative">
							{/* Delete tier button */}
							{document.pricingTiers.length > 1 && (
								<button
									onClick={() => removeTier(tier.id)}
									className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-50 border border-red-200 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center opacity-0 group-hover/tier:opacity-100"
									title="Remove package"
								>
									<TrashIcon size={10} />
								</button>
							)}

							{/* Package name — editable */}
							<input
								type="text"
								className={`${inputClass} text-[11px] font-black uppercase py-2`}
								placeholder="Package name"
								value={tier.name}
								onChange={(e) => updateTier(tier.id, { name: e.target.value })}
							/>

							<input
								type="text"
								className={inputClass}
								placeholder={tr("Price (e.g. 999)")}
								value={tier.price}
								onChange={(e) => updateTier(tier.id, { price: e.target.value })}
							/>

							<input
								type="text"
								className={inputClass}
								placeholder={tr("Short description")}
								value={tier.description}
								onChange={(e) => updateTier(tier.id, { description: e.target.value })}
							/>

							<label className="flex items-center gap-2 cursor-pointer">
								<input
									type="checkbox"
									className="checkbox checkbox-primary checkbox-sm"
									checked={tier.isPopular}
									onChange={(e) => updateTier(tier.id, { isPopular: e.target.checked })}
								/>
								<span className="text-[10px] font-black uppercase text-slate-500">{tr("Popular")}</span>
							</label>
						</div>
					))}
				</div>
			</div>

			{(!hiddenFields.includes("timeline") || !hiddenFields.includes("validUntil")) && (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					{!hiddenFields.includes("timeline") && (
						<FormField label="Timeline" onDelete={() => hideField("timeline")}>
							<input
								type="text"
								className={inputClass}
								value={document.timeline}
								onChange={(e) =>
									updateDocument({ timeline: e.target.value })
								}
							/>
						</FormField>
					)}
					{!hiddenFields.includes("validUntil") && (
						<FormField label="Valid Until" onDelete={() => hideField("validUntil")}>
							<input
								type="text"
								className={inputClass}
								value={document.validUntil}
								onChange={(e) =>
									updateDocument({ validUntil: e.target.value })
								}
							/>
						</FormField>
					)}
				</div>
			)}

			{(!hiddenFields.includes("defaultCurrency") || !hiddenFields.includes("totalPrice")) && (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{!hiddenFields.includes("defaultCurrency") && (
						<FormField label="Currency" onDelete={() => hideField("defaultCurrency")}>
							<input
								type="text"
								className={inputClass}
								value={document.defaultCurrency}
								onChange={(e) =>
									updateDocument({ defaultCurrency: e.target.value })
								}
							/>
						</FormField>
					)}
					{!hiddenFields.includes("totalPrice") && (
						<FormField label="Total Price" onDelete={() => hideField("totalPrice")}>
							<input
								type="text"
								className={inputClass}
								value={document.totalPrice}
								onChange={(e) =>
									updateDocument({ totalPrice: e.target.value })
								}
							/>
						</FormField>
					)}
				</div>
			)}

			{/* ── Deliverables ─────────────────────────────────────────── */}
			<div className="space-y-4">
				<label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-1">
					{tr("Deliverables")}
				</label>
				<div className="grid grid-cols-12 gap-4 px-1 text-[10px] font-black uppercase text-slate-400">
					<div className="col-span-5">{tr("Deliverable")}</div>
					<div className="col-span-3">{tr("Timeline")}</div>
					<div className="col-span-3">{tr("Status")}</div>
				</div>
				{document.deliverables.map((row) => (
					<div
						key={row.id}
						className="grid grid-cols-12 gap-3 items-center group"
					>
						<input
							className={`${inputClass} col-span-5 py-2`}
							placeholder={tr("e.g. Brand Strategy Deck")}
							value={row.deliverable}
							onChange={(e) =>
								updateArrayItem("deliverables", row.id, {
									deliverable: e.target.value,
								})
							}
						/>
						<input
							className={`${inputClass} col-span-3 py-2`}
							placeholder={tr("e.g. Week 2")}
							value={row.timeline}
							onChange={(e) =>
								updateArrayItem("deliverables", row.id, {
									timeline: e.target.value,
								})
							}
						/>
						<input
							className={`${inputClass} col-span-3 py-2`}
							placeholder={tr("Pending")}
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
					{tr("+ Add Deliverable")}
				</button>
			</div>

			{/* ── Terms & Conditions ───────────────────────────────────── */}
			<div className="space-y-4">
				<label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-1">
					{tr("Terms & Conditions")}
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
					{tr("+ Add Clause")}
				</button>
			</div>
		</div>
	);
};

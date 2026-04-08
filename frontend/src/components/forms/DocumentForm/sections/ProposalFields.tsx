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
				<div className="space-y-2">
					<div className="flex items-center justify-between px-1">
						<label className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-500">
							{tr("Scope of Work")}
						</label>
						<button
							onClick={() => hideField("scopeOfWork")}
							className="text-slate-300 hover:text-red-400 transition-colors"
							title="Remove field"
						>
							<TrashIcon size={13} />
						</button>
					</div>
					<div className="border-l-4 border-violet-200 bg-violet-50/40 rounded-r-xl p-4">
						<textarea
							className={`${inputClass} h-32 bg-white`}
							placeholder={tr("Describe the full scope of work for this project…")}
							value={document.scopeOfWork}
							onChange={(e) => updateDocument({ scopeOfWork: e.target.value })}
						/>
					</div>
				</div>
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

				<div
					className="grid gap-4"
					style={{ gridTemplateColumns: `repeat(${Math.max(document.pricingTiers.length, 1)}, 1fr)` }}
				>
					{(document.pricingTiers ?? []).map((tier) => (
						<div key={tier.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 group/tier relative">
							{/* Delete tier button */}
							<button
							onClick={() => removeTier(tier.id)}
							className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-50 border border-red-200 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center opacity-0 group-hover/tier:opacity-100"
							title="Remove package"
						>
							<TrashIcon size={10} />
						</button>

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
			<div className="space-y-2">
				<label className="block text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 px-1">
					{tr("Deliverables")}
				</label>
				<div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200">
					{document.deliverables.map((row, idx) => (
						<div key={row.id} className="flex gap-4 items-start p-4 group/del bg-white hover:bg-slate-50/60 transition-colors">
							{/* Numbered bullet */}
							<div className="w-7 h-7 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center shrink-0 mt-0.5">
								<span className="text-[10px] font-black text-indigo-500">{idx + 1}</span>
							</div>
							{/* Fields */}
							<div className="flex-1 space-y-3">
								<input
									className={inputClass}
									placeholder={tr("e.g. Brand Strategy Deck")}
									value={row.deliverable}
									onChange={(e) =>
										updateArrayItem("deliverables", row.id, { deliverable: e.target.value })
									}
								/>
								<div className="grid grid-cols-2 gap-3">
									<div className="space-y-1">
										<label className="text-[9px] font-black uppercase tracking-[0.15em] text-amber-500">
											{tr("Timeline")}
										</label>
										<input
											className={inputClass}
											placeholder={tr("e.g. Week 2")}
											value={row.timeline}
											onChange={(e) =>
												updateArrayItem("deliverables", row.id, { timeline: e.target.value })
											}
										/>
									</div>
									<div className="space-y-1">
										<label className="text-[9px] font-black uppercase tracking-[0.15em] text-emerald-500">
											{tr("Status")}
										</label>
										<input
											className={inputClass}
											placeholder={tr("Pending")}
											value={row.status}
											onChange={(e) =>
												updateArrayItem("deliverables", row.id, { status: e.target.value })
											}
										/>
									</div>
								</div>
							</div>
							{/* Delete */}
							<button
								onClick={() => removeArrayItem("deliverables", row.id)}
								className="w-6 h-6 flex items-center justify-center rounded-full bg-red-50 border border-red-200 text-red-400 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover/del:opacity-100 shrink-0 mt-0.5"
								title="Remove deliverable"
							>
								<TrashIcon size={10} />
							</button>
						</div>
					))}
					{document.deliverables.length === 0 && (
						<div className="p-6 text-center text-slate-300 text-sm font-medium">
							{tr("No deliverables yet")}
						</div>
					)}
				</div>
				<button
					onClick={() =>
						addArrayItem("deliverables", { deliverable: "", timeline: "", status: "Pending" })
					}
					className="btn btn-ghost btn-sm text-indigo-500 font-bold"
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

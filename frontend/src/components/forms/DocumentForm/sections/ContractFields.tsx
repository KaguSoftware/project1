"use client";
import { useAppStore } from "@/src/store";
import { LayoutGridIcon, TrashIcon } from "lucide-react";
import { t } from "@/src/lib/translations";
import { FormField, inputClass } from "../ui/FormField";
import { SectionHeader } from "../ui/SectionHeader";
import { PenLineIcon } from "lucide-react";

export const ContractFields = () => {
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

	return (
		<div className="space-y-8">
			<SectionHeader title="Agreement Details" icon={LayoutGridIcon} />

			{!hiddenFields.includes("agreementOverview") && (
				<FormField label="Agreement Overview" onDelete={() => hideField("agreementOverview")}>
					<textarea
						className={`${inputClass} h-24`}
						value={document.agreementOverview}
						onChange={(e) =>
							updateDocument({ agreementOverview: e.target.value })
						}
					/>
				</FormField>
			)}

			{!hiddenFields.includes("scopeOfWork") && (
				<div className="space-y-2">
					<div className="flex items-center justify-between px-1">
						<label className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-500">
							{tr("Scope of Services")}
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
							placeholder={tr("Describe the full scope of services for this contract…")}
							value={document.scopeOfWork}
							onChange={(e) => updateDocument({ scopeOfWork: e.target.value })}
						/>
					</div>
				</div>
			)}

			<div className="space-y-2">
				<label className="block text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 px-1">
					{tr("Deliverables Table")}
				</label>
				<div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200">
					{document.deliverables.map((row, idx) => (
						<div key={row.id} className="flex gap-4 items-start p-4 group/del bg-white hover:bg-slate-50/60 transition-colors">
							<div className="w-7 h-7 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center shrink-0 mt-0.5">
								<span className="text-[10px] font-black text-indigo-500">{idx + 1}</span>
							</div>
							<div className="flex-1 space-y-3">
								<input
									className={inputClass}
									placeholder={tr("e.g. Brand Strategy Deck")}
									value={row.deliverable}
									onChange={(e) =>
										updateArrayItem("deliverables", row.id, { deliverable: e.target.value })
									}
								/>
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
							</div>
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
					onClick={() => addArrayItem("deliverables", { deliverable: "", timeline: "" })}
					className="btn btn-ghost btn-sm text-indigo-500 font-bold"
				>
					{tr("+ Add Row")}
				</button>
			</div>

			{/* ── Terms & Conditions ───────────────────────────────────── */}
			<div className="space-y-4">
				<label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-1">
					{tr("Terms & Conditions")}
				</label>
				{document.termsAndConditions.map((clause, idx) => (
					<div key={clause.id} className="flex gap-3 items-center group">
						<div className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-xs font-black text-slate-400 border border-slate-200">
							{idx + 1}
						</div>
						<input
							type="text"
							className={inputClass}
							value={clause.text}
							onChange={(e) =>
								updateArrayItem("termsAndConditions", clause.id, { text: e.target.value })
							}
						/>
						<button
							onClick={() => removeArrayItem("termsAndConditions", clause.id)}
							className="btn btn-ghost btn-circle btn-sm text-slate-300 hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
						>
							<TrashIcon size={16} />
						</button>
					</div>
				))}
				<button
					onClick={() => addArrayItem("termsAndConditions", { text: "" })}
					className="btn btn-ghost btn-sm text-primary font-bold"
				>
					{tr("+ Add Clause")}
				</button>
			</div>

			{/* ── Signature Block ───────────────────────────────────────── */}
			<div className="space-y-3">
				<div className="flex items-center gap-2 px-1">
					<PenLineIcon size={13} className="text-slate-400" />
					<label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
						{tr("Signature Block")}
					</label>
				</div>
				<div className="border border-dashed border-slate-200 rounded-xl p-5 bg-slate-50/40 space-y-4">
					<div className="grid grid-cols-3 gap-4">
						{[tr("Signature"), tr("Name & Title"), tr("Date")].map((label) => (
							<div key={label} className="space-y-2">
								<div className="h-10 border-b border-slate-300" />
								<p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">{label}</p>
							</div>
						))}
					</div>
					<p className="text-[10px] text-slate-400 italic">
						{tr("This signature block will appear at the bottom of the contract PDF.")}
					</p>
				</div>
			</div>
		</div>
	);
};

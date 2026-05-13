"use client";
import { useAppStore } from "@/src/store";
import { ReceiptIcon, TrashIcon } from "lucide-react";
import { t } from "@/src/lib/translations";
import { inputClass } from "../ui/FormField";
import { SectionHeader } from "../ui/SectionHeader";

export const InvoiceFields = () => {
	const {
		document,
		updateDocument,
		addArrayItem,
		updateArrayItem,
		removeArrayItem,
		language,
	} = useAppStore();

	const tr = (key: string) => t(key, language);

	const segments = document.invoiceSegments ?? [];
	const totalPaid = segments.reduce((s, seg) => s + (seg.paid || 0), 0);
	const totalPayment = segments.reduce((s, seg) => s + (seg.totalPayment || 0), 0);
	const totalRemaining = totalPayment - totalPaid;

	return (
		<div className="space-y-8">
			<SectionHeader title={tr("Billing Items")} icon={ReceiptIcon} />

			<div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
				{/* Column headers */}
				<div className="grid grid-cols-12 gap-3 px-2 text-[10px] font-black uppercase text-slate-400">
					<div className="col-span-4">{tr("Segment")}</div>
					<div className="col-span-2 text-center">{tr("Paid")}</div>
					<div className="col-span-2 text-center">{tr("Remaining")}</div>
					<div className="col-span-3 text-right">{tr("Total Payment")}</div>
					<div className="col-span-1" />
				</div>

				{segments.map((seg) => {
					const remaining = (seg.totalPayment || 0) - (seg.paid || 0);
					return (
						<div
							key={seg.id}
							className="grid grid-cols-12 gap-3 items-center group animate-in fade-in duration-200"
						>
							<input
								className={`${inputClass} col-span-4 py-2`}
								placeholder={tr("e.g. Marketing")}
								value={seg.name}
								onChange={(e) =>
									updateArrayItem("invoiceSegments", seg.id, { name: e.target.value })
								}
							/>
							<input
								className={`${inputClass} col-span-2 py-2 text-center`}
								type="number"
								min={0}
								value={seg.paid}
								onChange={(e) =>
									updateArrayItem("invoiceSegments", seg.id, { paid: Number(e.target.value) })
								}
							/>
							<div className="col-span-2 text-center font-semibold text-slate-600">
								{remaining.toLocaleString()}
							</div>
							<input
								className={`${inputClass} col-span-3 py-2 text-right`}
								type="number"
								min={0}
								value={seg.totalPayment}
								onChange={(e) =>
									updateArrayItem("invoiceSegments", seg.id, { totalPayment: Number(e.target.value) })
								}
							/>
							<button
								onClick={() => removeArrayItem("invoiceSegments", seg.id)}
								className="col-span-1 text-slate-300 hover:text-error opacity-0 group-hover:opacity-100 transition-opacity flex justify-center"
							>
								<TrashIcon size={14} />
							</button>
						</div>
					);
				})}

				{/* Totals row */}
				{segments.length > 0 && (
					<div className="grid grid-cols-12 gap-3 items-center border-t border-slate-200 pt-3 mt-2">
						<div className="col-span-4 text-[10px] font-black uppercase text-slate-500 px-2">
							{tr("Total")}
						</div>
						<div className="col-span-2 text-center font-black text-slate-700">
							{totalPaid.toLocaleString()}
						</div>
						<div className="col-span-2 text-center font-black text-slate-700">
							{totalRemaining.toLocaleString()}
						</div>
						<div className="col-span-3 text-right font-black text-slate-700 pr-2">
							{totalPayment.toLocaleString()}
						</div>
						<div className="col-span-1" />
					</div>
				)}

				<button
					onClick={() =>
						addArrayItem("invoiceSegments", {
							name: "",
							paid: 0,
							totalPayment: 0,
						})
					}
					className="btn btn-ghost btn-sm text-primary font-bold"
				>
					{tr("+ Add Segment")}
				</button>
			</div>

			{/* Currency field */}
			<div className="space-y-2">
				<label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-1">
					{tr("Currency")}
				</label>
				<input
					type="text"
					className={inputClass}
					value={document.defaultCurrency}
					onChange={(e) => updateDocument({ defaultCurrency: e.target.value })}
					placeholder="USD"
				/>
			</div>

			{/* Payment Terms */}
			<div className="space-y-4">
				<label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-1">
					{tr("Payment Terms")}
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
					{tr("+ Add Term")}
				</button>
			</div>
		</div>
	);
};

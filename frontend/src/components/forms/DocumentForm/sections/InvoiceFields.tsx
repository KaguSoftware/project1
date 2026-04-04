"use client";
import { useAppStore } from "@/src/store";
import { ReceiptIcon, TrashIcon } from "lucide-react";
import { FormField, inputClass } from "../ui/FormField";
import { SectionHeader } from "../ui/SectionHeader";

export const InvoiceFields = () => {
	const {
		document,
		updateDocument,
		addArrayItem,
		updateArrayItem,
		removeArrayItem,
	} = useAppStore();

	return (
		<div className="space-y-8">
			<SectionHeader title="Billing Items" icon={ReceiptIcon} />

			<div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
				<div className="grid grid-cols-12 gap-4 px-2 text-[10px] font-black uppercase text-slate-400">
					<div className="col-span-5">Description</div>
					<div className="col-span-2 text-center">QTY</div>
					<div className="col-span-2 text-center">Rate</div>
					<div className="col-span-2 text-right">Amount</div>
				</div>
				{document.lineItems.map((item) => (
					<div
						key={item.id}
						className="grid grid-cols-12 gap-4 items-center group animate-in fade-in duration-200"
					>
						<input
							className={`${inputClass} col-span-5 py-2`}
							value={item.description}
							onChange={(e) =>
								updateArrayItem("lineItems", item.id, {
									description: e.target.value,
								})
							}
						/>
						<input
							className={`${inputClass} col-span-2 py-2 text-center`}
							type="number"
							value={item.qty}
							onChange={(e) =>
								updateArrayItem("lineItems", item.id, {
									qty: Number(e.target.value),
								})
							}
						/>
						<input
							className={`${inputClass} col-span-2 py-2 text-center`}
							type="number"
							value={item.rate}
							onChange={(e) =>
								updateArrayItem("lineItems", item.id, {
									rate: Number(e.target.value),
								})
							}
						/>
						<div className="col-span-2 text-right font-bold text-slate-700">
							${(item.qty * item.rate).toLocaleString()}
						</div>
						<button
							onClick={() =>
								removeArrayItem("lineItems", item.id)
							}
							className="col-span-1 text-slate-300 hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
						>
							<TrashIcon size={14} />
						</button>
					</div>
				))}
				<button
					onClick={() =>
						addArrayItem("lineItems", {
							description: "",
							qty: 1,
							rate: 0,
						})
					}
					className="btn btn-ghost btn-sm text-primary font-bold"
				>
					+ Add Item
				</button>
			</div>

			<div className="space-y-4">
				<label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-1">
					Payment Terms
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
					+ Add Term
				</button>
			</div>
		</div>
	);
};

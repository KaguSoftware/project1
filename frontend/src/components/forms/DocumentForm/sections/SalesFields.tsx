"use client";
import { useAppStore } from "@/src/store";
import { BarChart3Icon, TrashIcon } from "lucide-react";
import { FormField, inputClass } from "../ui/FormField";
import { SectionHeader } from "../ui/SectionHeader";

export const SalesFields = () => {
	const {
		document,
		updateDocument,
		addArrayItem,
		updateArrayItem,
		removeArrayItem,
	} = useAppStore();

	return (
		<div className="space-y-12">
			<section className="space-y-6">
				<SectionHeader
					title="Weekly Sales Metrics"
					icon={BarChart3Icon}
				/>
				<div className="grid grid-cols-12 gap-4 px-1 text-[10px] font-black uppercase text-slate-400">
					<div className="col-span-5">Metric</div>
					<div className="col-span-4">Amount</div>
					<div className="col-span-2">Delta</div>
				</div>
				{document.salesMetrics.map((row) => (
					<div
						key={row.id}
						className="grid grid-cols-12 gap-3 items-center group"
					>
						<input
							className={`${inputClass} col-span-5 py-2`}
							value={row.title}
							onChange={(e) =>
								updateArrayItem("salesMetrics", row.id, {
									title: e.target.value,
								})
							}
						/>
						<input
							className={`${inputClass} col-span-4 py-2`}
							value={row.money}
							onChange={(e) =>
								updateArrayItem("salesMetrics", row.id, {
									money: e.target.value,
								})
							}
						/>
						<input
							className={`${inputClass} col-span-2 py-2 font-bold ${row.delta?.startsWith("-") ? "text-red-500" : "text-emerald-500"}`}
							value={row.delta}
							onChange={(e) =>
								updateArrayItem("salesMetrics", row.id, {
									delta: e.target.value,
								})
							}
						/>
						<button
							onClick={() =>
								removeArrayItem("salesMetrics", row.id)
							}
							className="col-span-1 text-slate-300 hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
						>
							<TrashIcon size={14} />
						</button>
					</div>
				))}
				<button
					onClick={() => addArrayItem("salesMetrics", { title: "", money: "", delta: "" })}
					className="btn btn-ghost btn-sm text-primary font-bold"
				>
					+ Add Metric
				</button>
			</section>

			<FormField label="Weekly Summary">
				<textarea
					className={`${inputClass} h-32`}
					value={document.aiIntro}
					onChange={(e) =>
						updateDocument({ aiIntro: e.target.value })
					}
				/>
			</FormField>

			<section className="space-y-6">
				<label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-1">
					Deal Breakdown
				</label>
				<div className="grid grid-cols-12 gap-4 px-1 text-[10px] font-black uppercase text-slate-400">
					<div className="col-span-5">Client</div>
					<div className="col-span-4">Deal Value</div>
					<div className="col-span-2">Stage</div>
				</div>
				{document.dealBreakdown.map((row) => (
					<div
						key={row.id}
						className="grid grid-cols-12 gap-3 items-center group"
					>
						<input
							className={`${inputClass} col-span-5 py-2`}
							value={row.client || ""}
							onChange={(e) =>
								updateArrayItem("dealBreakdown", row.id, {
									client: e.target.value,
								})
							}
						/>
						<input
							className={`${inputClass} col-span-4 py-2`}
							value={row.dealValue || ""}
							onChange={(e) =>
								updateArrayItem("dealBreakdown", row.id, {
									dealValue: e.target.value,
								})
							}
						/>
						<input
							className={`${inputClass} col-span-2 py-2`}
							value={row.stage || ""}
							onChange={(e) =>
								updateArrayItem("dealBreakdown", row.id, {
									stage: e.target.value,
								})
							}
						/>
						<button
							onClick={() =>
								removeArrayItem("dealBreakdown", row.id)
							}
							className="col-span-1 text-slate-300 hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
						>
							<TrashIcon size={14} />
						</button>
					</div>
				))}
				<button
					onClick={() =>
						addArrayItem("dealBreakdown", {
							client: "",
							dealValue: "",
							stage: "",
						})
					}
					className="btn btn-ghost btn-sm text-primary font-bold"
				>
					+ Add Deal
				</button>
			</section>
		</div>
	);
};

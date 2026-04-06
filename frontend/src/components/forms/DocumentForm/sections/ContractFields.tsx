"use client";
import { useAppStore } from "@/src/store";
import { LayoutGridIcon, TrashIcon } from "lucide-react";
import { FormField, inputClass } from "../ui/FormField";
import { SectionHeader } from "../ui/SectionHeader";

export const ContractFields = () => {
	const {
		document,
		updateDocument,
		addArrayItem,
		updateArrayItem,
		removeArrayItem,
	} = useAppStore();

	return (
		<div className="space-y-8">
			<SectionHeader title="Agreement Details" icon={LayoutGridIcon} />

			<FormField label="Agreement Overview">
				<textarea
					className={`${inputClass} h-24`}
					value={document.agreementOverview}
					onChange={(e) =>
						updateDocument({ agreementOverview: e.target.value })
					}
				/>
			</FormField>

			<FormField label="Scope of Services">
				<textarea
					className={`${inputClass} h-32`}
					value={document.scopeOfWork}
					onChange={(e) =>
						updateDocument({ scopeOfWork: e.target.value })
					}
				/>
			</FormField>

			<div className="space-y-4">
				<label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-1">
					Deliverables Table
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
							value={row.deliverable}
							onChange={(e) =>
								updateArrayItem("deliverables", row.id, {
									deliverable: e.target.value,
								})
							}
						/>
						<input
							className={`${inputClass} col-span-3 py-2`}
							value={row.timeline}
							onChange={(e) =>
								updateArrayItem("deliverables", row.id, {
									timeline: e.target.value,
								})
							}
						/>
						<input
							className={`${inputClass} col-span-3 py-2`}
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
					onClick={() => addArrayItem("deliverables", { deliverable: "", timeline: "", status: "Pending" })}
					className="btn btn-ghost btn-sm text-primary font-bold"
				>
					+ Add Row
				</button>
			</div>
		</div>
	);
};

"use client";
import { useAppStore } from "@/src/store";
import { UsersIcon, TrashIcon } from "lucide-react";
import { t } from "@/src/lib/translations";
import { FormField, inputClass } from "../ui/FormField";
import { SectionHeader } from "../ui/SectionHeader";

export const InfluencerFields = () => {
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
			<SectionHeader title="Influencer Roster" icon={UsersIcon} />

			{!hiddenFields.includes("campaignOverview") && (
				<FormField label="Campaign Overview" onDelete={() => hideField("campaignOverview")}>
					<textarea
						className={`${inputClass} h-24`}
						value={document.campaignOverview}
						onChange={(e) =>
							updateDocument({ campaignOverview: e.target.value })
						}
					/>
				</FormField>
			)}

			<div className="space-y-6">
				<label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-1">
					{tr("Influencer List")}
				</label>
				{document.influencers.map((inf) => (
					<div
						key={inf.id}
						className="bg-white p-6 rounded-2xl border border-slate-300 space-y-4 group relative shadow-sm"
					>
						<div className="grid grid-cols-2 gap-4">
							<FormField label="Full Name">
								<input
									className={`${inputClass} py-2`}
									value={inf.name}
									onChange={(e) =>
										updateArrayItem("influencers", inf.id, {
											name: e.target.value,
										})
									}
								/>
							</FormField>
							<FormField label="Platform">
								<input
									className={`${inputClass} py-2`}
									value={inf.platform}
									onChange={(e) =>
										updateArrayItem("influencers", inf.id, {
											platform: e.target.value,
										})
									}
								/>
							</FormField>
						</div>
						<div className="grid grid-cols-3 gap-4">
							<FormField label="Followers">
								<input
									className={`${inputClass} py-2`}
									placeholder={tr("e.g. 50K")}
									value={inf.followers}
									onChange={(e) =>
										updateArrayItem("influencers", inf.id, {
											followers: e.target.value,
										})
									}
								/>
							</FormField>
							<FormField label="Rate">
								<input
									className={`${inputClass} py-2`}
									placeholder={tr("e.g. $500")}
									value={inf.rate}
									onChange={(e) =>
										updateArrayItem("influencers", inf.id, {
											rate: e.target.value,
										})
									}
								/>
							</FormField>
							<FormField label="Status">
								<input
									className={`${inputClass} py-2`}
									placeholder={tr("e.g. Confirmed")}
									value={inf.status}
									onChange={(e) =>
										updateArrayItem("influencers", inf.id, {
											status: e.target.value,
										})
									}
								/>
							</FormField>
						</div>
						<button
							onClick={() =>
								removeArrayItem("influencers", inf.id)
							}
							className="absolute -right-3 -top-3 btn btn-circle btn-xs btn-error shadow-lg opacity-0 group-hover:opacity-100 transition-all"
						>
							✕
						</button>
					</div>
				))}
				<button
					onClick={() => addArrayItem("influencers", { name: "", platform: "", followers: "", rate: "", status: "" })}
					className="btn btn-ghost btn-sm text-primary font-bold"
				>
					{tr("+ Add Influencer")}
				</button>
			</div>

			<div className="space-y-6 pt-6 border-t border-slate-100">
				<label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-1">
					{tr("Campaign KPIs")}
				</label>
				<div className="grid grid-cols-5 gap-4">
					{[
						{ id: "views", label: "Views" },
						{ id: "engagement", label: "Engagement" },
						{ id: "clicks", label: "Clicks" },
						{ id: "conversions", label: "Conversions" },
						{ id: "roi", label: "ROI" },
					].filter((kpi) => !hiddenFields.includes(`kpi_${kpi.id}`)).map((kpi) => (
						<FormField key={kpi.id} label={kpi.label} onDelete={() => hideField(`kpi_${kpi.id}`)}>
							<input
								className={`${inputClass} py-2 px-3 text-sm`}
								placeholder="0"
								value={(document.influencerKPIs as any)[kpi.id]}
								onChange={(e) =>
									updateDocument({
										influencerKPIs: {
											...document.influencerKPIs,
											[kpi.id]: e.target.value,
										},
									})
								}
							/>
						</FormField>
					))}
				</div>
			</div>
		</div>
	);
};

"use client";
import { useAppStore } from "@/src/store";
import { BarChart3Icon, TrashIcon } from "lucide-react";
import { t } from "@/src/lib/translations";
import { FormField, inputClass } from "../ui/FormField";
import { SectionHeader } from "../ui/SectionHeader";

export const SocialMediaFields = () => {
	const {
		document,
		updateDocument,
		addArrayItem,
		updateArrayItem,
		removeArrayItem,
		language,
	} = useAppStore();

	const tr = (key: string) => t(key, language);

	return (
		<div className="space-y-12">
			<section className="space-y-6">
				<SectionHeader
					title="Performance Overview"
					icon={BarChart3Icon}
				/>
				<div className="space-y-4">
					<div className="grid grid-cols-12 gap-4 px-1 text-[10px] font-black uppercase text-slate-400">
						<div className="col-span-5">{tr("Metric")}</div>
						<div className="col-span-4">{tr("Value")}</div>
						<div className="col-span-2">{tr("Delta")}</div>
					</div>
					{document.performanceMetrics.map((row) => (
						<div
							key={row.id}
							className="grid grid-cols-12 gap-3 items-center group"
						>
							<input
								className={`${inputClass} col-span-5 py-2`}
								placeholder={tr("e.g. Engagement")}
								value={row.metric}
								onChange={(e) =>
									updateArrayItem(
										"performanceMetrics",
										row.id,
										{ metric: e.target.value },
									)
								}
							/>
							<input
								className={`${inputClass} col-span-4 py-2`}
								placeholder="12.5%"
								value={row.number}
								onChange={(e) =>
									updateArrayItem(
										"performanceMetrics",
										row.id,
										{ number: e.target.value },
									)
								}
							/>
							<input
								className={`${inputClass} col-span-2 py-2 font-bold ${row.delta?.startsWith("-") ? "text-red-500" : "text-emerald-500"}`}
								placeholder="+2%"
								value={row.delta}
								onChange={(e) =>
									updateArrayItem(
										"performanceMetrics",
										row.id,
										{ delta: e.target.value },
									)
								}
							/>
							<button
								onClick={() =>
									removeArrayItem(
										"performanceMetrics",
										row.id,
									)
								}
								className="col-span-1 text-slate-300 hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
							>
								<TrashIcon size={14} />
							</button>
						</div>
					))}
					<button
						onClick={() =>
							addArrayItem("performanceMetrics", {
								metric: "",
								number: "",
								delta: "",
							})
						}
						className="btn btn-ghost btn-sm text-primary font-bold"
					>
						{tr("+ Add Metric")}
					</button>
				</div>
			</section>

			<FormField label="Executive Summary">
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
					{tr("Top Performing Posts")}
				</label>
				<div className="grid grid-cols-12 gap-4 px-1 text-[10px] font-black uppercase text-slate-400">
					<div className="col-span-5">{tr("Post")}</div>
					<div className="col-span-2 text-center">{tr("Likes")}</div>
					<div className="col-span-2 text-center">{tr("Comm.")}</div>
					<div className="col-span-2 text-center">{tr("Shares")}</div>
				</div>
				{document.topPosts.map((row) => (
					<div
						key={row.id}
						className="grid grid-cols-12 gap-3 items-center group"
					>
						<input
							className={`${inputClass} col-span-5 py-2`}
							value={row.post || ""}
							onChange={(e) =>
								updateArrayItem("topPosts", row.id, {
									post: e.target.value,
								})
							}
						/>
						<input
							className={`${inputClass} col-span-2 py-2 text-center`}
							value={row.likes || ""}
							onChange={(e) =>
								updateArrayItem("topPosts", row.id, {
									likes: e.target.value,
								})
							}
						/>
						<input
							className={`${inputClass} col-span-2 py-2 text-center`}
							value={row.comments}
							onChange={(e) =>
								updateArrayItem("topPosts", row.id, {
									comments: e.target.value,
								})
							}
						/>
						<input
							className={`${inputClass} col-span-2 py-2 text-center`}
							value={row.shares}
							onChange={(e) =>
								updateArrayItem("topPosts", row.id, {
									shares: e.target.value,
								})
							}
						/>
						<button
							onClick={() => removeArrayItem("topPosts", row.id)}
							className="col-span-1 text-slate-300 hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
						>
							<TrashIcon size={14} />
						</button>
					</div>
				))}
				<button
					onClick={() => addArrayItem("topPosts", { post: "", likes: "", comments: "", shares: "" })}
					className="btn btn-ghost btn-sm text-primary font-bold"
				>
					{tr("+ Add Post")}
				</button>
			</section>
		</div>
	);
};

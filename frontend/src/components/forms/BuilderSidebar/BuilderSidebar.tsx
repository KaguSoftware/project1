"use client";
import { useAppStore } from "../../../lib/store";
import { SIDEBAR_CONTENT } from "./constants";
import type { BuilderSidebarProps } from "./types";

export const BuilderSidebar = ({ className = "" }: BuilderSidebarProps) => {
	const { language, setLanguage } = useAppStore();

	return (
		<div className={`w-full lg:w-100 xl:w-112.5 shrink-0 ${className}`}>
			{/* Notice the softer slate colors and subtle borders */}
			<div className="bg-base-100 rounded-3xl p-8 shadow-sm border border-slate-200/60">
				<div className="mb-8">
					<h1 className="text-2xl font-bold text-slate-800 tracking-tight">
						{SIDEBAR_CONTENT.title}
					</h1>
					<p className="text-sm text-slate-500 mt-1">
						{SIDEBAR_CONTENT.description}
					</p>
				</div>

				<div className="form-control mb-8 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
					<label className="label cursor-pointer justify-start gap-4">
						<input
							type="checkbox"
							className="toggle toggle-primary toggle-sm"
							checked={language === "ar"}
							onChange={(e) =>
								setLanguage(e.target.checked ? "ar" : "en")
							}
						/>
						<span className="label-text font-medium text-slate-700">
							{SIDEBAR_CONTENT.toggleLabel}
						</span>
					</label>
				</div>

				<div className="space-y-4">
					<p className="text-sm text-slate-400">
						{SIDEBAR_CONTENT.placeholderText}
					</p>
				</div>
			</div>
		</div>
	);
};

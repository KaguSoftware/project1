"use client";
import { useAppStore } from "@/src/store";
import { SIDEBAR_CONTENT } from "./constants";
import { DocumentForm } from "../DocumentForm/DocumentForm";
import type { BuilderSidebarProps } from "./types";

export const BuilderSidebar = ({ className = "" }: BuilderSidebarProps) => {
	const { language, setLanguage } = useAppStore();

	return (
		// Removed the lg:w-[400px] and xl:w-[450px] constraints here
		<div className={`w-full h-full p-6 lg:p-10 ${className}`}>
			<div className="mb-10 flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">
						{SIDEBAR_CONTENT.title}
					</h1>
					<p className="text-xs font-medium text-slate-400 uppercase tracking-widest mt-1">
						v1.0 • Phase 1
					</p>
				</div>

				{/* Language Toggle moved to a cleaner spot */}
				<div className="flex items-center gap-3 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
					<button
						onClick={() => setLanguage("en")}
						className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${language === "en" ? "bg-white shadow-sm text-primary" : "text-slate-500"}`}
					>
						EN
					</button>
					<button
						onClick={() => setLanguage("ar")}
						className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${language === "ar" ? "bg-white shadow-sm text-primary" : "text-slate-500"}`}
					>
						AR
					</button>
				</div>
			</div>

			{/* The main workspace form */}
			<DocumentForm />
		</div>
	);
};

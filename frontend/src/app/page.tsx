"use client";
import { useAppStore } from "@/src/store";
import { BuilderSidebar } from "../components/forms/BuilderSidebar/BuilderSidebar";
import { LivePreview } from "../components/preview/LivePreview/LivePreview";

export default function BuilderPage() {
	const { language } = useAppStore();

	return (
		<div
			dir={language === "ar" ? "rtl" : "ltr"}
			className="min-h-screen bg-slate-50/50 flex flex-col lg:flex-row transition-all duration-300"
		>
			{/* Form Side - Now wider and the primary focus */}
			<div className="w-full lg:w-[600px] xl:w-[650px] border-e border-slate-200 bg-white min-h-screen overflow-y-auto">
				<BuilderSidebar className="w-full" />
			</div>

			{/* Preview Side - Acts as the sticky reference on the right */}
			<div className="flex-1 bg-slate-100/50 p-6 lg:p-12 overflow-y-auto flex justify-center">
				<LivePreview className="max-w-[850px]" />
			</div>
		</div>
	);
}

"use client";
import { useAppStore } from "../lib/store";
import { BuilderSidebar } from "../components/forms/BuilderSidebar/BuilderSidebar";
import { LivePreview } from "../components/preview/LivePreview/LivePreview";

export default function BuilderPage() {
	const { language } = useAppStore();

	return (
		<div
			dir={language === "ar" ? "rtl" : "ltr"}
			className="min-h-screen bg-slate-50 p-6 lg:p-10 gap-8 flex flex-col lg:flex-row max-w-400 mx-auto transition-all duration-300"
		>
			<BuilderSidebar />
			<LivePreview />
		</div>
	);
}

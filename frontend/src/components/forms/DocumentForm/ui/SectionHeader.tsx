"use client";
import { LucideIcon } from "lucide-react";
import { useAppStore } from "@/src/store";
import { t } from "@/src/lib/translations";

export const SectionHeader = ({
	title,
	icon: Icon,
}: {
	title: string;
	icon: LucideIcon;
}) => {
	const { language } = useAppStore();
	return (
		<div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
			<div className="p-2 bg-slate-50 rounded-lg text-slate-400">
				<Icon size={18} />
			</div>
			<h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-800">
				{t(title, language)}
			</h2>
		</div>
	);
};

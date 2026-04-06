"use client";
import { useState, useRef, useEffect } from "react";
import type { CustomSectionType } from "@/src/store";

const OPTIONS: { type: CustomSectionType; label: string; description: string }[] = [
	{
		type: "text",
		label: "Custom Text Block",
		description: "Free-form text with a custom heading",
	},
	{
		type: "terms",
		label: "Terms & Conditions",
		description: "Pulls from the terms list in your form",
	},
	{
		type: "deliverables",
		label: "Deliverables Table",
		description: "Pulls from the deliverables list in your form",
	},
];

interface Props {
	onAdd: (type: CustomSectionType, header: string) => void;
}

export const AddSectionBar = ({ onAdd }: Props) => {
	const [open, setOpen] = useState(false);
	const [picked, setPicked] = useState<CustomSectionType | null>(null);
	const [header, setHeader] = useState("");
	const ref = useRef<HTMLDivElement>(null);

	// Close on outside click
	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false);
				setPicked(null);
				setHeader("");
			}
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);

	const confirm = () => {
		if (!picked) return;
		onAdd(picked, header.trim());
		setPicked(null);
		setHeader("");
		setOpen(false);
	};

	return (
		<div ref={ref} className="relative no-print">
			<button
				onClick={() => setOpen((v) => !v)}
				className="flex items-center gap-2 text-slate-400 hover:text-slate-700 transition-colors text-xs font-black uppercase tracking-widest border border-dashed border-slate-200 hover:border-slate-400 px-4 py-2 rounded-lg w-full justify-center"
			>
				<span className="text-base leading-none">+</span> Add Section
			</button>

			{open && !picked && (
				<div className="absolute bottom-full mb-2 left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-xl z-10 overflow-hidden">
					{OPTIONS.map((opt) => (
						<button
							key={opt.type}
							onClick={() => {
								setPicked(opt.type);
								if (opt.type !== "text") setHeader(opt.label);
							}}
							className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0"
						>
							<p className="text-sm font-black text-slate-800">{opt.label}</p>
							<p className="text-[11px] text-slate-400">{opt.description}</p>
						</button>
					))}
				</div>
			)}

			{open && picked && (
				<div className="absolute bottom-full mb-2 left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-xl z-10 p-4 space-y-3">
					<p className="text-xs font-black uppercase tracking-widest text-slate-500">
						Section Heading
					</p>
					<input
						autoFocus
						type="text"
						value={header}
						onChange={(e) => setHeader(e.target.value)}
						onKeyDown={(e) => e.key === "Enter" && confirm()}
						placeholder={
							picked === "text"
								? "e.g. About Us, Next Steps…"
								: OPTIONS.find((o) => o.type === picked)?.label ?? ""
						}
						className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-slate-400"
					/>
					<div className="flex gap-2 justify-end">
						<button
							onClick={() => {
								setPicked(null);
								setHeader("");
							}}
							className="text-xs text-slate-400 hover:text-slate-600 px-3 py-1"
						>
							Back
						</button>
						<button
							onClick={confirm}
							className="text-xs font-black bg-slate-900 text-white px-4 py-1.5 rounded-lg hover:bg-slate-700"
						>
							Add
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

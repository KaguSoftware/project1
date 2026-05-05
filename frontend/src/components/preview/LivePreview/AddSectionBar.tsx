"use client";
import { useState, useRef, useEffect } from "react";
import type { CustomSectionType } from "@/src/store";

const OPTION_GROUPS: {
	group: string;
	options: { type: CustomSectionType; label: string; description: string; defaultHeader?: string }[];
}[] = [
	{
		group: "Text Blocks",
		options: [
			{
				type: "text",
				label: "Custom Text Block",
				description: "Free-form text with a custom heading",
			},
			{
				type: "text",
				label: "Executive Summary",
				description: "High-level summary section",
				defaultHeader: "Executive Summary",
			},
			{
				type: "text",
				label: "Scope of Work",
				description: "Detailed project scope description",
				defaultHeader: "Scope of Work",
			},
			{
				type: "text",
				label: "About Us",
				description: "Company introduction or background",
				defaultHeader: "About Us",
			},
			{
				type: "text",
				label: "Next Steps",
				description: "Action items or next steps",
				defaultHeader: "Next Steps",
			},
			{
				type: "text",
				label: "Methodology",
				description: "Approach or process description",
				defaultHeader: "Methodology",
			},
			{
				type: "text",
				label: "Campaign Strategy",
				description: "Marketing or campaign strategy overview",
				defaultHeader: "Campaign Strategy",
			},
			{
				type: "text",
				label: "Additional Notes",
				description: "Miscellaneous notes or remarks",
				defaultHeader: "Additional Notes",
			},
{
				type: "text",
				label: "Disclaimer",
				description: "Legal disclaimer or notice",
				defaultHeader: "Disclaimer",
			},
		],
	},
	{
		group: "Lists",
		options: [
			{
				type: "terms",
				label: "Terms & Conditions",
				description: "Numbered list of terms",
				defaultHeader: "Terms & Conditions",
			},
			{
				type: "terms",
				label: "Payment Terms",
				description: "Payment terms and conditions",
				defaultHeader: "Payment Terms",
			},
			{
				type: "terms",
				label: "Key Points",
				description: "Bulleted list of key highlights",
				defaultHeader: "Key Points",
			},
			{
				type: "terms",
				label: "Requirements",
				description: "List of project requirements",
				defaultHeader: "Requirements",
			},
			{
				type: "terms",
				label: "Exclusions",
				description: "Items explicitly excluded from scope",
				defaultHeader: "Exclusions",
			},
			{
				type: "terms",
				label: "Objectives",
				description: "Project or campaign objectives",
				defaultHeader: "Objectives",
			},
		],
	},
	{
		group: "Signature",
		options: [
			{
				type: "signature",
				label: "Signature Block",
				description: "Signature, name & title, and date fields",
				defaultHeader: "Authorized Signature",
			},
			{
				type: "signature",
				label: "Client Signature",
				description: "Client sign-off section",
				defaultHeader: "Client Signature",
			},
			{
				type: "signature",
				label: "Mutual Agreement",
				description: "Two-party signature block",
				defaultHeader: "Mutual Agreement",
			},
		],
	},
	{
		group: "Tables",
		options: [
			{
				type: "deliverables",
				label: "Deliverables Table",
				description: "Deliverable / Timeline / Status",
				defaultHeader: "Deliverables",
			},
			{
				type: "deliverables",
				label: "Milestones",
				description: "Project milestones and timeline",
				defaultHeader: "Project Milestones",
			},
			{
				type: "deliverables",
				label: "Task Breakdown",
				description: "Detailed task list with status",
				defaultHeader: "Task Breakdown",
			},
			{
				type: "deliverables",
				label: "Revision Schedule",
				description: "Revision rounds and deadlines",
				defaultHeader: "Revision Schedule",
			},
		],
	},
];

// Flat list for easy lookup
const ALL_OPTIONS = OPTION_GROUPS.flatMap((g) => g.options);

interface Props {
	onAdd: (type: CustomSectionType, header: string) => void;
	direction?: "up" | "down";
}

export const AddSectionBar = ({ onAdd, direction = "up" }: Props) => {
	const [open, setOpen] = useState(false);
	const [picked, setPicked] = useState<{ type: CustomSectionType; label: string; defaultHeader?: string } | null>(null);
	const [header, setHeader] = useState("");
	const [search, setSearch] = useState("");
	const ref = useRef<HTMLDivElement>(null);

	// Close on outside click
	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false);
				setPicked(null);
				setHeader("");
				setSearch("");
			}
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);

	const confirm = () => {
		if (!picked) return;
		onAdd(picked.type, header.trim() || picked.defaultHeader || picked.label);
		setPicked(null);
		setHeader("");
		setSearch("");
		setOpen(false);
	};

	const filteredGroups = OPTION_GROUPS.map((g) => ({
		...g,
		options: g.options.filter(
			(o) =>
				!search ||
				o.label.toLowerCase().includes(search.toLowerCase()) ||
				o.description.toLowerCase().includes(search.toLowerCase()),
		),
	})).filter((g) => g.options.length > 0);

	return (
		<div ref={ref} className="relative no-print">
			<button
				onClick={() => setOpen((v) => !v)}
				className="flex items-center gap-2 text-slate-400 hover:text-slate-700 transition-colors text-xs font-black uppercase tracking-widest border border-dashed border-slate-200 hover:border-slate-400 px-4 py-2 rounded-lg w-full justify-center"
			>
				<span className="text-base leading-none">+</span> Add Section
			</button>

			{open && !picked && (
				<div className={`absolute ${direction === "down" ? "top-full mt-2" : "bottom-full mb-2"} left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-xl z-10 overflow-hidden`}>
					{/* Search */}
					<div className="px-3 py-2 border-b border-slate-100">
						<input
							autoFocus
							type="text"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search sections…"
							className="w-full text-sm outline-none placeholder:text-slate-400 text-slate-700"
						/>
					</div>

					{/* Options grouped */}
					<div className="max-h-80 overflow-y-auto">
						{filteredGroups.map((group) => (
							<div key={group.group}>
								<p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 px-4 py-2 bg-slate-50/80 border-b border-slate-100">
									{group.group}
								</p>
								{group.options.map((opt, i) => (
									<button
										key={`${opt.type}-${opt.label}-${i}`}
										onClick={() => {
											setPicked(opt);
											setHeader(opt.defaultHeader ?? "");
											setSearch("");
										}}
										className="w-full text-left px-4 py-2.5 hover:bg-slate-50 transition-colors border-b border-slate-100/70 last:border-b-0"
									>
										<p className="text-sm font-black text-slate-800">{opt.label}</p>
										<p className="text-[11px] text-slate-400">{opt.description}</p>
									</button>
								))}
							</div>
						))}
						{filteredGroups.length === 0 && (
							<p className="text-sm text-slate-400 px-4 py-3 text-center">No matches</p>
						)}
					</div>
				</div>
			)}

			{open && picked && (
				<div className={`absolute ${direction === "down" ? "top-full mt-2" : "bottom-full mb-2"} left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-xl z-10 p-4 space-y-3`}>
					<p className="text-xs font-black uppercase tracking-widest text-slate-500">
						{picked.label} — Section Heading
					</p>
					<input
						autoFocus
						type="text"
						value={header}
						onChange={(e) => setHeader(e.target.value)}
						onKeyDown={(e) => e.key === "Enter" && confirm()}
						placeholder={picked.defaultHeader ?? `e.g. ${picked.label}`}
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

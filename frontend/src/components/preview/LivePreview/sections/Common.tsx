import type { DocumentData, CustomSection } from "@/src/store";
import { t } from "@/src/lib/translations";

type Lang = "en" | "ar" | "tr";

/** Parses "Section:\n• item" formatted string into styled cards */
export const ScopeOfWorkPreview = ({
	text,
	lang = "en",
}: {
	text: string;
	lang?: Lang;
}) => {
	if (!text) return null;

	// Parse into sections: split on lines that end with ":"
	const sections: { title: string; items: string[] }[] = [];
	let current: { title: string; items: string[] } | null = null;

	for (const raw of text.split("\n")) {
		const line = raw.trim();
		if (!line) continue;
		if (line.endsWith(":")) {
			if (current) sections.push(current);
			current = { title: line.slice(0, -1), items: [] };
		} else if (current) {
			current.items.push(line.replace(/^[•\-–]\s*/, ""));
		}
	}
	if (current) sections.push(current);

	if (sections.length === 0) {
		// Fallback: plain text
		return (
			<section>
				<h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-4 font-black">
					{t("Scope of Work", lang)}
				</h3>
				<div className="whitespace-pre-wrap text-slate-700 leading-relaxed text-sm">{text}</div>
			</section>
		);
	}

	return (
		<section>
			<h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-4 font-black">
				{t("Scope of Work", lang)}
			</h3>
			<div className="grid grid-cols-3 gap-3">
				{sections.map((sec) => (
					<div key={sec.title} className="rounded-xl border border-slate-100 bg-slate-50 overflow-hidden">
						<div className="bg-slate-700 px-4 py-2">
							<p className="text-white text-[10px] font-black uppercase tracking-widest">{sec.title}</p>
						</div>
						<ul className="px-4 py-3 space-y-2">
							{sec.items.map((item, i) => (
								<li key={i} className="flex items-start gap-2 text-xs text-slate-600">
									<span className="w-2 h-2 rounded-full bg-green-500 shrink-0 mt-1" />
									<span>{item}</span>
								</li>
							))}
						</ul>
					</div>
				))}
			</div>
		</section>
	);
};

/** Generic plain-text section with a label above it */
export const TextSectionPreview = ({
	text,
	label,
	lang = "en",
}: {
	text: string;
	label: string;
	lang?: Lang;
}) => (
	<section>
		<h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-4 font-black">
			{t(label, lang)}
		</h3>
		<div className="whitespace-pre-wrap text-slate-700 leading-relaxed text-base">
			{text}
		</div>
	</section>
);

/** Terms list — invoice uses "Payment Terms", proposal uses "Terms & Conditions" */
export const TermsPreview = ({
	doc,
	label,
	lang = "en",
}: {
	doc: DocumentData;
	label?: string;
	lang?: Lang;
}) => {
	const filtered = doc.termsAndConditions.filter((c) => c.text);
	if (filtered.length === 0) return null;

	return (
		<section>
			<h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-4 font-black">
				{t(label ?? "Terms & Conditions", lang)}
			</h3>
			<ol className="space-y-3">
				{filtered.map((clause, idx) => (
					<li key={clause.id} className="flex gap-3 text-sm text-slate-600">
						<span className="w-5 h-5 shrink-0 flex items-center justify-center rounded-full bg-slate-100 text-[10px] font-black text-slate-500 mt-0.5">
							{idx + 1}
						</span>
						{t(clause.text, lang)}
					</li>
				))}
			</ol>
		</section>
	);
};

/** Deliverables table — shared between proposal and contract */
export const DeliverablesPreview = ({
	rows,
	lang = "en",
}: {
	rows: DocumentData["deliverables"];
	lang?: Lang;
}) => {
	const filtered = rows.filter((d) => d.deliverable);
	if (filtered.length === 0) return null;

	const isRtl = lang === "ar";

	return (
		<section>
			<h3 className="text-xs text-indigo-400 uppercase tracking-[0.2em] mb-3 font-black">
				{t("Deliverables", lang)}
			</h3>
			<div className="w-full rounded-xl overflow-hidden border border-slate-200">
				{/* Header */}
				<div className={`grid grid-cols-[2rem_1fr] bg-slate-50 border-b border-slate-200 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ${isRtl ? "direction-rtl" : ""}`}>
				<div className={`grid grid-cols-[2rem_1fr] bg-slate-50 border-b border-slate-200 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ${isRtl ? "direction-rtl" : ""}`}>
					<span>#</span>
					<span>{t("Deliverable", lang)}</span>
				</div>
				{/* Rows */}
				{filtered.map((item, idx) => (
					<div
						key={item.id}
						className={`grid grid-cols-[2rem_1fr] items-center px-4 py-3 text-sm ${idx < filtered.length - 1 ? "border-b border-slate-100" : ""} ${isRtl ? "direction-rtl" : ""}`}
						className={`grid grid-cols-[2rem_1fr] items-center px-4 py-3 text-sm ${idx < filtered.length - 1 ? "border-b border-slate-100" : ""} ${isRtl ? "direction-rtl" : ""}`}
					>
						<span className="text-[11px] font-black text-slate-300">{idx + 1}</span>
						<span className="font-semibold text-slate-800 leading-snug">{item.deliverable}</span>
					</div>
				))}
			</div>
		</section>
	);
};

/** Renders a single user-added custom section */
export const CustomSectionPreview = ({
	section,
	doc,
	onRemove,
	onUpdate,
	onMoveUp,
	onMoveDown,
}: {
	section: CustomSection;
	doc: DocumentData;
	onRemove: (id: string) => void;
	onUpdate: (id: string, updates: Partial<CustomSection>) => void;
	onMoveUp?: () => void;
	onMoveDown?: () => void;
}) => {
	const Controls = () => (
		<span className="absolute top-0 right-0 flex items-center gap-1.5 opacity-0 group-hover/cs:opacity-100 transition-opacity pointer-events-none group-hover/cs:pointer-events-auto">
			{onMoveUp && (
				<span
					role="button"
					onClick={onMoveUp}
					className="text-slate-300 hover:text-slate-600 transition-colors text-xs font-bold cursor-pointer select-none"
					title="Move up"
				>
					↑
				</span>
			)}
			{onMoveDown && (
				<span
					role="button"
					onClick={onMoveDown}
					className="text-slate-300 hover:text-slate-600 transition-colors text-xs font-bold cursor-pointer select-none"
					title="Move down"
				>
					↓
				</span>
			)}
			<span
				role="button"
				onClick={() => onRemove(section.id)}
				className="w-5 h-5 flex items-center justify-center rounded-full bg-red-50 border border-red-200 text-red-400 hover:bg-red-500 hover:text-white transition-all text-[10px] font-bold cursor-pointer"
				title="Remove section"
			>
				✕
			</span>
		</span>
	);

	if (section.type === "text") {
		return (
			<section className="relative group/cs">
				<h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-4 font-black">
					{section.header || "Custom Section"}
				</h3>
				<Controls />
				<div
					contentEditable
					suppressContentEditableWarning
					onBlur={(e) => onUpdate(section.id, { content: e.currentTarget.innerText })}
					data-placeholder="Click to write your content here…"
					className="whitespace-pre-wrap text-slate-700 leading-relaxed text-base outline-none focus:outline-none min-h-24 cursor-text empty:before:content-[attr(data-placeholder)] empty:before:text-slate-300"
				>
					{section.content}
				</div>
			</section>
		);
	}

	if (section.type === "terms") {
		const filtered = (section.termsRows ?? []).filter((c) => c.text);
		return (
			<section className="relative group/cs">
				<h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-4 font-black">
					{section.header || "Terms & Conditions"}
				</h3>
				<Controls />
				<ol className="space-y-3">
					{filtered.map((clause, idx) => (
						<li key={clause.id} className="flex gap-3 text-sm text-slate-600">
							<span className="w-5 h-5 shrink-0 flex items-center justify-center rounded-full bg-slate-100 text-[10px] font-black text-slate-500 mt-0.5">
								{idx + 1}
							</span>
							{clause.text}
						</li>
					))}
				</ol>
			</section>
		);
	}

	if (section.type === "deliverables") {
		const rows = (section.deliverablesRows ?? []).filter((d) => d.deliverable);
		return (
			<section className="relative group/cs">
				<h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-4 font-black">
					{section.header || "Deliverables"}
				</h3>
				<Controls />
				<table className="w-full text-left">
					<thead>
						<tr className="border-b border-slate-900">
							<th className="py-3 text-[10px] uppercase font-black">Deliverable</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-100">
						{rows.map((item) => (
							<tr key={item.id}>
								<td className="py-3 font-medium text-slate-700">{item.deliverable}</td>
							</tr>
						))}
					</tbody>
				</table>
			</section>
		);
	}

	return null;
};

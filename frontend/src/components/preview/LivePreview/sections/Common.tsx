import type { DocumentData, CustomSection } from "@/src/store";
import { t } from "@/src/lib/translations";

type Lang = "en" | "ar";

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
						{clause.text}
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

	return (
		<section>
			<h3 className="text-xs text-indigo-400 uppercase tracking-[0.2em] mb-4 font-black">
				{t("Deliverables", lang)}
			</h3>
			<div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
				{filtered.map((item, idx) => (
					<div key={item.id} className="flex gap-4 items-start px-4 py-3">
						<div className="w-6 h-6 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center shrink-0 mt-0.5">
							<span className="text-[9px] font-black text-indigo-500">{idx + 1}</span>
						</div>
						<div className="flex-1 min-w-0">
							<p className="font-semibold text-slate-800 text-sm leading-snug mb-1.5">
								{item.deliverable}
							</p>
							<div className="flex items-center gap-4 text-xs">
								{item.timeline && (
									<span>
										<span className="font-black uppercase tracking-wider text-amber-500 mr-1">
											{t("Timeline", lang)}
										</span>
										<span className="text-slate-500">{item.timeline}</span>
									</span>
								)}
								<span>
									<span className="font-black uppercase tracking-wider text-emerald-500 mr-1">
										{t("Status", lang)}
									</span>
									<span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-600 border border-emerald-100">
										{item.status || t("Pending", lang)}
									</span>
								</span>
							</div>
						</div>
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
							<th className="py-3 text-[10px] uppercase font-black">Timeline</th>
							<th className="py-3 text-[10px] uppercase font-black text-right">Status</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-100">
						{rows.map((item) => (
							<tr key={item.id}>
								<td className="py-3 font-medium text-slate-700">{item.deliverable}</td>
								<td className="py-3 text-slate-500 text-sm">{item.timeline}</td>
								<td className="py-3 text-right">
									<span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-slate-100 text-slate-500">
										{item.status || "Pending"}
									</span>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</section>
		);
	}

	return null;
};

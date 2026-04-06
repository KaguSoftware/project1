import type { DocumentData, CustomSection } from "@/src/store";

/** Generic plain-text section with a label above it */
export const TextSectionPreview = ({
	text,
	label,
}: {
	text: string;
	label: string;
}) => (
	<section>
		<h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-4 font-black">
			{label}
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
}: {
	doc: DocumentData;
	label?: string;
}) => {
	const filtered = doc.termsAndConditions.filter((c) => c.text);
	if (filtered.length === 0) return null;

	return (
		<section>
			<h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-4 font-black">
				{label ?? "Terms & Conditions"}
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
}: {
	rows: DocumentData["deliverables"];
}) => {
	const filtered = rows.filter((d) => d.deliverable);
	if (filtered.length === 0) return null;

	return (
		<section>
			<h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-4 font-black">
				Deliverables
			</h3>
			<table className="w-full text-left">
				<thead>
					<tr className="border-b border-slate-900">
						<th className="py-3 text-[10px] uppercase font-black">Deliverable</th>
						<th className="py-3 text-[10px] uppercase font-black">Timeline</th>
						<th className="py-3 text-[10px] uppercase font-black text-right">
							Status
						</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-slate-100">
					{filtered.map((item) => (
						<tr key={item.id}>
							<td className="py-3 font-medium text-slate-700">
								{item.deliverable}
							</td>
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
		<span className="ml-auto flex items-center gap-2">
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
				className="text-slate-300 hover:text-red-400 transition-colors text-xs font-bold cursor-pointer"
			>
				✕ remove
			</span>
		</span>
	);

	if (section.type === "text") {
		return (
			<section>
				<h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-4 font-black flex items-center">
					{section.header || "Custom Section"}
					<Controls />
				</h3>
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
			<section>
				<h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-4 font-black flex items-center">
					{section.header || "Terms & Conditions"}
					<Controls />
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
	}

	if (section.type === "deliverables") {
		const rows = (section.deliverablesRows ?? []).filter((d) => d.deliverable);
		return (
			<section>
				<h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-4 font-black flex items-center">
					{section.header || "Deliverables"}
					<Controls />
				</h3>
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

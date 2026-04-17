import type { DocumentData } from "@/src/store";
import type { LeadStatus } from "@/src/store/types";
import { t } from "@/src/lib/translations";

type Lang = "en" | "ar" | "tr";

const STATUS_LABEL_KEYS: Record<LeadStatus, string> = {
	new_lead:         "New Lead",
	meeting_arranged: "Meeting Arranged",
	proposal_sent:    "Proposal Sent",
	closed_won:       "Closed Won",
	closed_lost:      "Closed Lost",
	follow_up_needed: "Follow-up Needed",
};

const STATUS_COLORS: Record<LeadStatus, { bg: string; text: string; dot: string }> = {
	new_lead:         { bg: "bg-indigo-50",  text: "text-indigo-600",  dot: "bg-indigo-500"  },
	meeting_arranged: { bg: "bg-amber-50",   text: "text-amber-600",   dot: "bg-amber-500"   },
	proposal_sent:    { bg: "bg-blue-50",    text: "text-blue-600",    dot: "bg-blue-500"    },
	closed_won:       { bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500" },
	closed_lost:      { bg: "bg-red-50",     text: "text-red-600",     dot: "bg-red-500"     },
	follow_up_needed: { bg: "bg-violet-50",  text: "text-violet-600",  dot: "bg-violet-500"  },
};

function formatDate(iso: string) {
	if (!iso) return "";
	return new Date(iso).toLocaleDateString(undefined, {
		month: "short", day: "numeric", year: "numeric",
	});
}

// ── Individual orderable sections ────────────────────────────────────────────

export const WSHeaderPreview = ({ doc, lang = "en" }: { doc: DocumentData; lang?: Lang }) => {
	const ws = doc.weeklySales;
	if (!ws || (!ws.salesPersonName && !ws.department && !ws.weekStart && !ws.weekEnd)) return null;
	return (
		<section className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm border-b border-slate-100 pb-6">
			{ws.salesPersonName && (
				<div>
					<p className="text-[10px] uppercase tracking-widest text-slate-400 font-black mb-0.5">{t("Sales Person", lang)}</p>
					<p className="font-semibold text-slate-800">{ws.salesPersonName}</p>
				</div>
			)}
			{ws.department && (
				<div>
					<p className="text-[10px] uppercase tracking-widest text-slate-400 font-black mb-0.5">{t("Department", lang)}</p>
					<p className="font-semibold text-slate-800">{ws.department}</p>
				</div>
			)}
			{(ws.weekStart || ws.weekEnd) && (
				<div className="col-span-2">
					<p className="text-[10px] uppercase tracking-widest text-slate-400 font-black mb-0.5">{t("Period", lang)}</p>
					<p className="font-semibold text-slate-800">
						{formatDate(ws.weekStart)}{ws.weekStart && ws.weekEnd && " – "}{formatDate(ws.weekEnd)}
					</p>
				</div>
			)}
		</section>
	);
};

export const WSStatusGridPreview = ({ doc, lang = "en" }: { doc: DocumentData; lang?: Lang }) => {
	const ws = doc.weeklySales;
	if (!ws) return null;
	const counts = ws.leads
		.filter((l) => l.clientName && l.status)
		.reduce<Partial<Record<LeadStatus, number>>>((acc, l) => {
			const s = l.status as LeadStatus;
			acc[s] = (acc[s] ?? 0) + 1;
			return acc;
		}, {});
	const entries = Object.keys(STATUS_LABEL_KEYS) as LeadStatus[];
	return (
		<section className="grid grid-cols-3 gap-3" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
			{entries.map((s) => {
				const sc = STATUS_COLORS[s];
				return (
					<div key={s} className={`rounded-xl p-3 flex flex-col gap-1 ${sc.bg}`}>
						<div className="flex items-center gap-1.5">
							<span className={`w-2 h-2 rounded-full ${sc.dot}`} />
							<span className={`text-[9px] uppercase tracking-widest font-black ${sc.text}`}>{t(STATUS_LABEL_KEYS[s], lang)}</span>
						</div>
						<p className={`text-2xl font-black leading-none ${sc.text}`}>{counts[s] ?? 0}</p>
					</div>
				);
			})}
		</section>
	);
};

export const WSLeadsPreview = ({ doc, lang = "en" }: { doc: DocumentData; lang?: Lang }) => {
	const ws = doc.weeklySales;
	if (!ws) return null;
	const leads = ws.leads.filter((l) => l.clientName);
	if (leads.length === 0) return null;
	return (
		<section>
			<h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-4 font-black">{t("Leads", lang)}</h3>
			<div className="space-y-4">
				{leads.map((lead) => {
					const sc = lead.status ? STATUS_COLORS[lead.status as LeadStatus] : null;
					return (
						<div key={lead.id} className="border border-slate-100 rounded-xl p-4 space-y-3">
							<div className="flex items-start justify-between gap-2">
								<div>
									<p className="font-bold text-slate-800 text-sm">{lead.clientName}</p>
									{lead.contactPerson && <p className="text-xs text-slate-500">{lead.contactPerson}</p>}
								</div>
								{sc && lead.status && (
									<span className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${sc.bg} ${sc.text}`}>
										<span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
										{t(STATUS_LABEL_KEYS[lead.status as LeadStatus], lang)}
									</span>
								)}
							</div>
							<div className="flex flex-wrap gap-4 text-xs text-slate-500">
								{lead.email && <span>{lead.email}</span>}
								{lead.phone && <span>{lead.phone}</span>}
								{lead.leadSource && (
									<span className="capitalize">{t(lead.leadSource.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()), lang)}</span>
								)}
							</div>
							<div className="flex flex-wrap gap-4 text-xs">
								{lead.meetingDate && (
									<div>
										<span className="text-slate-400">{t("Meeting Date", lang)}: </span>
										<span className="font-medium text-slate-700">{formatDate(lead.meetingDate)}</span>
									</div>
								)}
								{lead.dealValue && (
									<div>
										<span className="text-slate-400">{t("Deal Value", lang)}: </span>
										<span className="font-bold text-slate-800">{lead.dealValue}</span>
									</div>
								)}
							</div>
							{lead.notes && <p className="text-xs text-slate-500 italic border-t border-slate-50 pt-2">{lead.notes}</p>}
						</div>
					);
				})}
			</div>
		</section>
	);
};

export const WSWeekSummaryPreview = ({ doc, lang = "en" }: { doc: DocumentData; lang?: Lang }) => {
	const ws = doc.weeklySales;
	if (!ws?.weekSummary) return null;
	return (
		<section>
			<h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-2 font-black">{t("Week Summary", lang)}</h3>
			<p className="text-sm text-slate-700 whitespace-pre-line">{ws.weekSummary}</p>
		</section>
	);
};

export const WSChallengesPreview = ({ doc, lang = "en" }: { doc: DocumentData; lang?: Lang }) => {
	const ws = doc.weeklySales;
	if (!ws?.challenges) return null;
	return (
		<section>
			<h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-2 font-black">{t("Challenges / Obstacles", lang)}</h3>
			<p className="text-sm text-slate-700 whitespace-pre-line">{ws.challenges}</p>
		</section>
	);
};

export const WSNextWeekGoalsPreview = ({ doc, lang = "en" }: { doc: DocumentData; lang?: Lang }) => {
	const ws = doc.weeklySales;
	if (!ws?.nextWeekGoals) return null;
	return (
		<section>
			<h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-2 font-black">{t("Next Week's Goals", lang)}</h3>
			<p className="text-sm text-slate-700 whitespace-pre-line">{ws.nextWeekGoals}</p>
		</section>
	);
};

export const WSAdditionalNotesPreview = ({ doc, lang = "en" }: { doc: DocumentData; lang?: Lang }) => {
	const ws = doc.weeklySales;
	if (!ws?.additionalNotes) return null;
	return (
		<section>
			<h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-2 font-black">{t("Additional Notes", lang)}</h3>
			<p className="text-sm text-slate-700 whitespace-pre-line">{ws.additionalNotes}</p>
		</section>
	);
};

// ── Legacy combined export (kept for compatibility) ───────────────────────────

export const WeeklySalesPreview = ({ doc, lang = "en" }: { doc: DocumentData; lang?: Lang }) => {
	return (
		<div className="space-y-8">
			<WSHeaderPreview doc={doc} lang={lang} />
			<WSStatusGridPreview doc={doc} lang={lang} />
			<WSLeadsPreview doc={doc} lang={lang} />
			<WSWeekSummaryPreview doc={doc} lang={lang} />
			<WSChallengesPreview doc={doc} lang={lang} />
			<WSNextWeekGoalsPreview doc={doc} lang={lang} />
			<WSAdditionalNotesPreview doc={doc} lang={lang} />
		</div>
	);
};

// Keep old exports so other doc types that use them don't break
export const SalesMetricsPreview = ({ doc, lang = "en" }: { doc: DocumentData; lang?: "en" | "ar" | "tr" }) => {
	const filtered = doc.salesMetrics.filter((m) => m.title);
	if (filtered.length === 0) return null;
	return (
		<section>
			<h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-4 font-black">Sales Metrics</h3>
			<div className="space-y-4">
				{filtered.map((m) => (
					<div key={m.id} className="flex justify-between border-b border-slate-50 pb-2">
						<span className="font-bold text-slate-600">{m.title}</span>
						<div className="text-right">
							<p className="font-black text-slate-900">{m.money}</p>
							{m.delta && (
								<p className={`text-[10px] font-bold ${m.delta.startsWith("-") ? "text-red-500" : "text-emerald-500"}`}>
									{m.delta}
								</p>
							)}
						</div>
					</div>
				))}
			</div>
		</section>
	);
};

export const DealBreakdownPreview = ({ doc, lang = "en" }: { doc: DocumentData; lang?: "en" | "ar" | "tr" }) => {
	const filtered = doc.dealBreakdown.filter((d) => d.client);
	if (filtered.length === 0) return null;
	return (
		<section>
			<h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-4 font-black">Deal Breakdown</h3>
			<table className="w-full text-left">
				<thead>
					<tr className="border-b border-slate-900">
						<th className="py-3 text-[10px] uppercase font-black">Client</th>
						<th className="py-3 text-[10px] uppercase font-black">Deal Value</th>
						<th className="py-3 text-[10px] uppercase font-black text-right">Stage</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-slate-100">
					{filtered.map((d) => (
						<tr key={d.id}>
							<td className="py-3 font-medium text-slate-700">{d.client}</td>
							<td className="py-3 text-slate-500">{d.dealValue}</td>
							<td className="py-3 text-right">
								<span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-slate-100 text-slate-500">
									{d.stage}
								</span>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</section>
	);
};

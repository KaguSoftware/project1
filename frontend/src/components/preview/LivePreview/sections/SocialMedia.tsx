import type { DocumentData } from "@/src/store";
import { t } from "@/src/lib/translations";

export const PerformanceMetricsPreview = ({ doc, lang = "en" }: { doc: DocumentData; lang?: "en" | "ar" | "tr" }) => {
	const filtered = doc.performanceMetrics.filter((m) => m.metric);
	if (filtered.length === 0) return null;

	return (
		<section>
			<h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-4 font-black">
				{t("Performance Metrics", lang)}
			</h3>
			<div className="flex flex-wrap gap-3">
				{filtered.map((m) => (
					<div
						key={m.id}
						className="flex flex-col gap-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 min-w-[100px]"
					>
						<span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{m.metric}</span>
						<p className="font-black text-slate-900 text-lg leading-none">{m.number}</p>
						{m.delta && (
							<p className={`text-[10px] font-bold ${m.delta.startsWith("-") ? "text-red-500" : "text-emerald-500"}`}>
								{m.delta}
							</p>
						)}
					</div>
				))}
			</div>
		</section>
	);
};

export const TopPostsPreview = ({ doc, lang = "en" }: { doc: DocumentData; lang?: "en" | "ar" | "tr" }) => {
	const filtered = doc.topPosts.filter((p) => p.post);
	if (filtered.length === 0) return null;

	return (
		<section>
			<h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-4 font-black">
				{t("Top Posts", lang)}
			</h3>
			<table className="w-full text-left">
				<thead>
					<tr className="border-b border-slate-900">
						<th className="py-3 text-[10px] uppercase font-black">{t("Post", lang)}</th>
						<th className="py-3 text-[10px] uppercase font-black text-center">
							{t("Likes", lang)}
						</th>
						<th className="py-3 text-[10px] uppercase font-black text-center">
							{t("Comments", lang)}
						</th>
						<th className="py-3 text-[10px] uppercase font-black text-center">
							{t("Shares", lang)}
						</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-slate-100">
					{filtered.map((p) => (
						<tr key={p.id}>
							<td className="py-3 font-medium text-slate-700">{p.post}</td>
							<td className="py-3 text-center text-slate-500">{p.likes}</td>
							<td className="py-3 text-center text-slate-500">{p.comments}</td>
							<td className="py-3 text-center text-slate-500">{p.shares}</td>
						</tr>
					))}
				</tbody>
			</table>
		</section>
	);
};

const impactBorder = (impact: string) =>
	impact === "positive" ? "border-emerald-400" :
	impact === "negative" ? "border-red-400" :
	"border-slate-300";

const impactBadge = (impact: string) =>
	impact === "positive"
		? "bg-emerald-50 text-emerald-600"
		: impact === "negative"
		? "bg-red-50 text-red-500"
		: "bg-slate-100 text-slate-400";

export const KeyInsightsPreview = ({ doc, lang = "en" }: { doc: DocumentData; lang?: "en" | "ar" | "tr" }) => {
	const filtered = doc.keyInsights?.filter((k) => k.insight) ?? [];
	if (filtered.length === 0) return null;

	return (
		<section>
			<h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-4 font-black">
				{t("Key Insights", lang)}
			</h3>
			<div className="flex flex-col gap-3">
				{filtered.map((k) => (
					<div key={k.id} className={`border-l-4 ${impactBorder(k.impact)} pl-4 py-2 flex items-start justify-between gap-3`}>
						<p className="text-sm text-slate-700 leading-snug flex-1">{k.insight}</p>
						<span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0 ${impactBadge(k.impact)}`}>
							{t(k.impact.charAt(0).toUpperCase() + k.impact.slice(1), lang)}
						</span>
					</div>
				))}
			</div>
		</section>
	);
};

export const TopPerformingContentPreview = ({ doc, lang = "en" }: { doc: DocumentData; lang?: "en" | "ar" | "tr" }) => {
	const filtered = doc.topPerformingContent?.filter((c) => c.title) ?? [];
	if (filtered.length === 0) return null;

	return (
		<section>
			<h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-4 font-black">
				{t("Top Performing Content", lang)}
			</h3>
			<table className="w-full text-left">
				<thead>
					<tr className="border-b border-slate-900">
						<th className="py-3 text-[10px] uppercase font-black">{t("Content", lang)}</th>
						<th className="py-3 text-[10px] uppercase font-black">{t("Metric", lang)}</th>
						<th className="py-3 text-[10px] uppercase font-black">{t("Value", lang)}</th>
						<th className="py-3 text-[10px] uppercase font-black">{t("Note", lang)}</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-slate-100">
					{filtered.map((c) => (
						<tr key={c.id}>
							<td className="py-3 font-medium text-slate-700">{c.title}</td>
							<td className="py-3 text-slate-500">{c.metric}</td>
							<td className="py-3 font-bold text-slate-900">{c.value}</td>
							<td className="py-3 text-slate-500 text-xs">{c.note}</td>
						</tr>
					))}
				</tbody>
			</table>
		</section>
	);
};

export const AudienceInsightsPreview = ({ doc, lang = "en" }: { doc: DocumentData; lang?: "en" | "ar" | "tr" }) => {
	const filtered = doc.audienceInsights?.filter((a) => a.label) ?? [];
	if (filtered.length === 0) return null;

	return (
		<section>
			<h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-4 font-black">
				{t("Audience Insights", lang)}
			</h3>
			<div className="flex flex-wrap gap-3">
				{filtered.map((a) => (
					<div
						key={a.id}
						className="flex flex-col gap-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 min-w-30"
					>
						<span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{a.label}</span>
						<p className="font-black text-slate-900 text-lg leading-none">{a.value}</p>
						{a.detail && <p className="text-[10px] text-slate-500 leading-snug">{a.detail}</p>}
					</div>
				))}
			</div>
		</section>
	);
};

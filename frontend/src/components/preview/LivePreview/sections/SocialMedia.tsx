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
			<div className="space-y-4">
				{filtered.map((m) => (
					<div
						key={m.id}
						className="flex justify-between border-b border-slate-50 pb-2"
					>
						<span className="font-bold text-slate-600">{m.metric}</span>
						<div className="text-right">
							<p className="font-black text-slate-900">{m.number}</p>
							{m.delta && (
								<p
									className={`text-[10px] font-bold ${
										m.delta.startsWith("-")
											? "text-red-500"
											: "text-emerald-500"
									}`}
								>
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

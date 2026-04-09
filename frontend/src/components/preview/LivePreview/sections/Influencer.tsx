import type { DocumentData } from "@/src/store";
import { t } from "@/src/lib/translations";

export const KPIGridPreview = ({ doc, lang = "en" }: { doc: DocumentData; lang?: "en" | "ar" | "tr" }) => {
	const kpis = doc.influencerKPIs;
	if (!Object.values(kpis).some(Boolean)) return null;

	const entries = [
		{ label: "Views", val: kpis.views },
		{ label: "Engagement", val: kpis.engagement },
		{ label: "Clicks", val: kpis.clicks },
		{ label: "Conversions", val: kpis.conversions },
		{ label: "ROI", val: kpis.roi },
	];

	return (
		<section>
			<h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-6 font-black">
				{t("Campaign KPIs", lang)}
			</h3>
			<div className="grid grid-cols-5 gap-4">
				{entries.map((k) => (
					<div
						key={k.label}
						className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100"
					>
						<p className="text-[9px] font-black uppercase text-slate-400 mb-1">
							{t(k.label, lang)}
						</p>
						<p className="text-xl font-black text-slate-900">{k.val || "—"}</p>
					</div>
				))}
			</div>
		</section>
	);
};

export const InfluencerRosterPreview = ({ doc, lang = "en" }: { doc: DocumentData; lang?: "en" | "ar" | "tr" }) => {
	const filtered = doc.influencers.filter((i) => i.name);
	if (filtered.length === 0) return null;

	return (
		<section>
			<h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-4 font-black">
				{t("Influencer Roster", lang)}
			</h3>
			<table className="w-full text-left">
				<thead>
					<tr className="border-b border-slate-900">
						<th className="py-3 text-[10px] uppercase font-black">{t("Name", lang)}</th>
						<th className="py-3 text-[10px] uppercase font-black">{t("Platform", lang)}</th>
						<th className="py-3 text-[10px] uppercase font-black text-center">
							{t("Followers", lang)}
						</th>
						<th className="py-3 text-[10px] uppercase font-black text-right">
							{t("Fee", lang)}
						</th>
						<th className="py-3 text-[10px] uppercase font-black text-right">
							{t("Status", lang)}
						</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-slate-100">
					{filtered.map((inf) => (
						<tr key={inf.id}>
							<td className="py-3 font-medium text-slate-700">{inf.name}</td>
							<td className="py-3 text-slate-500">{inf.platform}</td>
							<td className="py-3 text-center text-slate-500">{inf.followers}</td>
							<td className="py-3 text-right font-bold text-slate-700">
								{inf.rate}
							</td>
							<td className="py-3 text-right">
								<span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-slate-100 text-slate-500">
									{inf.status || "—"}
								</span>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</section>
	);
};

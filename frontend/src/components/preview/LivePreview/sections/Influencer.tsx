import type { DocumentData } from "@/src/store";

export const KPIGridPreview = ({ doc }: { doc: DocumentData }) => {
	if (!Object.values(doc.influencerKPIs).some(Boolean)) return null;

	return (
		<section>
			<h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-6 font-black">
				Campaign KPIs
			</h3>
			<div className="grid grid-cols-5 gap-4">
				{[
					{ label: "Views", val: doc.influencerKPIs.views },
					{ label: "Engagement", val: doc.influencerKPIs.engagement },
					{ label: "Clicks", val: doc.influencerKPIs.clicks },
					{ label: "Conversions", val: doc.influencerKPIs.conversions },
					{ label: "ROI", val: doc.influencerKPIs.roi },
				].map((k) => (
					<div
						key={k.label}
						className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100"
					>
						<p className="text-[9px] font-black uppercase text-slate-400 mb-1">
							{k.label}
						</p>
						<p className="text-xl font-black text-slate-900">
							{k.val || "—"}
						</p>
					</div>
				))}
			</div>
		</section>
	);
};

export const InfluencerRosterPreview = ({ doc }: { doc: DocumentData }) => {
	if (!doc.influencers.some((i) => i.name)) return null;

	return (
		<section>
			<h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-4 font-black">
				Influencer Roster
			</h3>
			<table className="w-full text-left">
				<thead>
					<tr className="border-b border-slate-900">
						<th className="py-3 text-[10px] uppercase font-black">Name</th>
						<th className="py-3 text-[10px] uppercase font-black">Platform</th>
						<th className="py-3 text-[10px] uppercase font-black text-center">
							Followers
						</th>
						<th className="py-3 text-[10px] uppercase font-black text-right">
							Rate
						</th>
						<th className="py-3 text-[10px] uppercase font-black text-right">
							Status
						</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-slate-100">
					{doc.influencers.map((inf) => (
						<tr key={inf.id}>
							<td className="py-3 font-medium text-slate-700">{inf.name}</td>
							<td className="py-3 text-slate-500">{inf.platform}</td>
							<td className="py-3 text-center text-slate-500">
								{inf.followers}
							</td>
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

import type { DocumentData } from "@/src/store";

export const SalesMetricsPreview = ({ doc }: { doc: DocumentData }) => {
	if (!doc.salesMetrics.some((m) => m.title)) return null;

	return (
		<section>
			<h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-4 font-black">
				Weekly Sales Metrics
			</h3>
			<div className="space-y-4">
				{doc.salesMetrics.map((m) => (
					<div
						key={m.id}
						className="flex justify-between border-b border-slate-50 pb-2"
					>
						<span className="font-bold text-slate-600">{m.title}</span>
						<div className="text-right">
							<p className="font-black text-slate-900">{m.money}</p>
							{m.delta && (
								<p
									className={`text-[10px] font-bold ${m.delta.startsWith("-") ? "text-red-500" : "text-emerald-500"}`}
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

export const DealBreakdownPreview = ({ doc }: { doc: DocumentData }) => {
	if (!doc.dealBreakdown.some((d) => d.client)) return null;

	return (
		<section>
			<h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-4 font-black">
				Deal Breakdown
			</h3>
			<table className="w-full text-left">
				<thead>
					<tr className="border-b border-slate-900">
						<th className="py-3 text-[10px] uppercase font-black">Client</th>
						<th className="py-3 text-[10px] uppercase font-black">
							Deal Value
						</th>
						<th className="py-3 text-[10px] uppercase font-black text-right">
							Stage
						</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-slate-100">
					{doc.dealBreakdown.map((d) => (
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

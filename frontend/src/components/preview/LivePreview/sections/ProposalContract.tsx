import type { DocumentData } from "@/src/store";

export const EngagementOverviewPreview = ({
	doc,
}: {
	doc: DocumentData;
}) => {
	if (!doc.pricingPackage && !doc.timeline && !doc.totalPrice && !doc.validUntil)
		return null;

	return (
		<section>
			<h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-4 font-black">
				Engagement Overview
			</h3>
			<div className="grid grid-cols-4 gap-4">
				{doc.pricingPackage && (
					<div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
						<p className="text-[9px] font-black uppercase text-slate-400 mb-1">
							Package
						</p>
						<p className="font-black text-slate-900 capitalize">
							{doc.pricingPackage}
						</p>
					</div>
				)}
				{doc.timeline && (
					<div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
						<p className="text-[9px] font-black uppercase text-slate-400 mb-1">
							Timeline
						</p>
						<p className="font-black text-slate-900">{doc.timeline}</p>
					</div>
				)}
				{doc.totalPrice && (
					<div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
						<p className="text-[9px] font-black uppercase text-slate-400 mb-1">
							Total
						</p>
						<p className="font-black text-slate-900">
							{doc.defaultCurrency} {doc.totalPrice}
						</p>
					</div>
				)}
				{doc.validUntil && (
					<div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
						<p className="text-[9px] font-black uppercase text-slate-400 mb-1">
							Valid Until
						</p>
						<p className="font-black text-slate-900">{doc.validUntil}</p>
					</div>
				)}
			</div>
		</section>
	);
};

export const DeliverablesPreview = ({ doc }: { doc: DocumentData }) => {
	const hasDeliverables =
		(doc.type === "proposal" || doc.type === "contract") &&
		doc.deliverables.some((d) => d.deliverable);

	if (!hasDeliverables) return null;

	return (
		<section>
			<h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-4 font-black">
				Deliverables
			</h3>
			<table className="w-full text-left">
				<thead>
					<tr className="border-b border-slate-900">
						<th className="py-3 text-[10px] uppercase font-black">
							Deliverable
						</th>
						<th className="py-3 text-[10px] uppercase font-black">
							Timeline
						</th>
						<th className="py-3 text-[10px] uppercase font-black text-right">
							Status
						</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-slate-100">
					{doc.deliverables.map((item) => (
						<tr key={item.id}>
							<td className="py-3 font-medium text-slate-700">
								{item.deliverable}
							</td>
							<td className="py-3 text-slate-500 text-sm">
								{item.timeline}
							</td>
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

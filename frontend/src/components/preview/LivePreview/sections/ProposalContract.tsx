import type { DocumentData } from "@/src/store";

// ── PROPOSAL ────────────────────────────────────────────────────────────────

export const EngagementOverviewPreview = ({ doc }: { doc: DocumentData }) => {
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

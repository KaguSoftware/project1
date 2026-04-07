import type { DocumentData } from "@/src/store";
import { t } from "@/src/lib/translations";

// ── PROPOSAL ────────────────────────────────────────────────────────────────

export const EngagementOverviewPreview = ({ doc, lang = "en" }: { doc: DocumentData; lang?: "en" | "ar" }) => {
	const tiers = doc.pricingTiers ?? [];
	const hasAnyTierData = tiers.some((t) => t.price || t.description);
	const hasOverviewData = doc.timeline || doc.totalPrice || doc.validUntil;

	if (!hasAnyTierData && !hasOverviewData) return null;

	return (
		<section>
			<h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-4 font-black">
				{t("Engagement Overview", lang)}
</h3>

			{/* Pricing Tiers — 3-column card row */}
			{(hasAnyTierData || doc.pricingPackage) && (
				<div className="grid grid-cols-3 gap-3 mb-4">
					{(tiers.length > 0
						? tiers
						: [
								{ id: "t1", name: "Basic", price: "", description: "", isPopular: false },
								{ id: "t2", name: "Standard", price: "", description: "", isPopular: true },
								{ id: "t3", name: "Premium", price: "", description: "", isPopular: false },
						  ]
					).map((tier) => {
						const selected = tier.name.toLowerCase() === (doc.pricingPackage || "").toLowerCase();
						return (
							<div
								key={tier.id}
								className={`rounded-xl p-4 border-2 flex flex-col gap-3 ${
									selected
										? "border-primary bg-primary/5"
										: "border-slate-100 bg-slate-50"
								}`}
							>
								{/* Name */}
								<div className={`rounded-lg px-3 py-2 text-center text-sm font-black capitalize ${selected ? "bg-white text-primary" : "bg-white text-slate-700"}`}>
									{tier.name}
								</div>
								{/* Price */}
								{tier.price && (
									<div className="rounded-lg px-3 py-2 text-center text-sm font-black text-slate-900 bg-white">
										{doc.defaultCurrency} {tier.price}
									</div>
								)}
								{/* Description */}
								{tier.description && (
									<div className="rounded-lg px-3 py-2 text-center text-xs text-slate-600 bg-white leading-snug">
										{tier.description}
									</div>
								)}
								{/* Popular badge */}
								<div className="flex items-center gap-2 mt-auto px-1">
									<div className={`w-4 h-4 rounded flex items-center justify-center border-2 shrink-0 ${tier.isPopular ? "bg-primary border-primary" : "border-slate-300 bg-white"}`}>
										{tier.isPopular && (
											<svg width="9" height="7" viewBox="0 0 9 7" fill="none">
												<path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
											</svg>
										)}
									</div>
									<span className="text-[10px] font-black text-slate-500">{t("Popular", lang)}</span>
								</div>
							</div>
						);
					})}
				</div>
			)}

			{/* Timeline / Total / Valid Until row */}
			{hasOverviewData && (
				<div className="grid grid-cols-3 gap-4">
					{doc.timeline && (
						<div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
							<p className="text-[9px] font-black uppercase text-slate-400 mb-1">{t("Timeline", lang)}</p>
							<p className="font-black text-slate-900">{doc.timeline}</p>
						</div>
					)}
					{doc.totalPrice && (
						<div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
							<p className="text-[9px] font-black uppercase text-slate-400 mb-1">{t("Total", lang)}</p>
							<p className="font-black text-slate-900">{doc.defaultCurrency} {doc.totalPrice}</p>
						</div>
					)}
					{doc.validUntil && (
						<div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
							<p className="text-[9px] font-black uppercase text-slate-400 mb-1">{t("Valid Until", lang)}</p>
							<p className="font-black text-slate-900">{doc.validUntil}</p>
						</div>
					)}
				</div>
			)}
		</section>
	);
};

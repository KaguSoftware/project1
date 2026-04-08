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
				<div className="grid gap-3 mb-4" style={{ gridTemplateColumns: `repeat(${tiers.length || 3}, 1fr)` }}>
					{(tiers.length > 0
						? tiers
						: [
								{ id: "t1", name: t("Basic", lang), price: "", description: "", isPopular: false },
								{ id: "t2", name: t("Standard", lang), price: "", description: "", isPopular: true },
								{ id: "t3", name: t("Premium", lang), price: "", description: "", isPopular: false },
						  ]
					).map((tier) => {
						const descLines = tier.description
							? tier.description.split(/[,،\n]+/).map((s) => s.trim()).filter(Boolean)
							: [];
						return (
							<div
								key={tier.id}
								className={`rounded-xl p-4 border-2 flex flex-col gap-3 relative overflow-hidden ${
									tier.isPopular
										? "border-primary bg-primary/5"
										: "border-slate-100 bg-slate-50"
								}`}
							>
								{/* Popular corner badge */}
								{tier.isPopular && (
									<div className="absolute top-0 right-0 bg-primary text-white text-[8px] font-black uppercase tracking-wider px-2.5 py-1 rounded-bl-lg">
										{t("Popular", lang)}
									</div>
								)}
								{/* Name */}
								<div className={`rounded-lg px-3 py-2 text-center text-sm font-black capitalize ${tier.isPopular ? "bg-white text-primary" : "bg-white text-slate-700"}`}>
									{t(tier.name, lang)}
								</div>
								{/* Price */}
								{tier.price && (
									<div className="rounded-lg px-3 py-2 text-center text-sm font-black text-slate-900 bg-white">
										{doc.defaultCurrency} {tier.price}
									</div>
								)}
								{/* Description as tick bullet points */}
								{descLines.length > 0 ? (
									<div className="rounded-lg px-3 py-2 bg-white flex flex-col gap-1.5">
										{descLines.map((line, idx) => (
											<div key={idx} className="flex items-start gap-1.5 text-xs text-slate-600">
												<span className="text-emerald-500 font-black shrink-0">✓</span>
												<span>{t(line, lang)}</span>
											</div>
										))}
									</div>
								) : tier.description ? (
									<div className="rounded-lg px-3 py-2 text-center text-xs text-slate-600 bg-white leading-snug">
										{t(tier.description, lang)}
									</div>
								) : null}
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

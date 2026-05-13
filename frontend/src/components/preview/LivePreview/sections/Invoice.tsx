import type { DocumentData } from "@/src/store";
import { t } from "@/src/lib/translations";

export const InvoicePreview = ({ doc, lang = "en" }: { doc: DocumentData; lang?: "en" | "ar" | "tr" }) => {
	const segments = (doc.invoiceSegments ?? []).filter((s) => s.name);
	if (segments.length === 0) return null;

	const cur = doc.defaultCurrency || "";
	const fmt = (n: number) => (cur ? `${cur} ${n.toLocaleString()}` : n.toLocaleString());

	const totalPaid = segments.reduce((s, seg) => s + (seg.paid || 0), 0);
	const totalPayment = segments.reduce((s, seg) => s + (seg.totalPayment || 0), 0);
	const totalRemaining = totalPayment - totalPaid;

	return (
		<section>
			<h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-4 font-black">
				{t("Billing Details", lang)}
			</h3>
			<table className="w-full text-left">
				<thead>
					<tr className="border-b border-slate-900">
						<th className="py-3 text-[10px] uppercase font-black">{t("Segment", lang)}</th>
						<th className="py-3 text-[10px] uppercase font-black text-center">{t("Paid", lang)}</th>
						<th className="py-3 text-[10px] uppercase font-black text-center">{t("Remaining", lang)}</th>
						<th className="py-3 text-[10px] uppercase font-black text-right">{t("Total Payment", lang)}</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-slate-100">
					{segments.map((seg) => {
						const remaining = (seg.totalPayment || 0) - (seg.paid || 0);
						return (
							<tr key={seg.id}>
								<td className="py-3 font-medium">{seg.name}</td>
								<td className="py-3 text-center font-semibold text-emerald-500">{fmt(seg.paid || 0)}</td>
								<td className={`py-3 text-center font-semibold ${remaining >= 0 ? "text-red-500" : "text-emerald-500"}`}>{fmt(remaining)}</td>
								<td className="py-3 text-right font-bold">{fmt(seg.totalPayment || 0)}</td>
							</tr>
						);
					})}
				</tbody>
				<tfoot>
					<tr className="border-t-2 border-slate-900">
						<td className="pt-4 font-black uppercase text-xs tracking-widest">
							{t("Total", lang)}
						</td>
						<td className="pt-4 font-black text-center text-emerald-500">{fmt(totalPaid)}</td>
						<td className={`pt-4 font-black text-center ${totalRemaining >= 0 ? "text-red-500" : "text-emerald-500"}`}>{fmt(totalRemaining)}</td>
						<td className="pt-4 font-black text-right text-lg">{fmt(totalPayment)}</td>
					</tr>
				</tfoot>
			</table>
		</section>
	);
};

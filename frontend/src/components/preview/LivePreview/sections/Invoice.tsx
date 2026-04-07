import type { DocumentData } from "@/src/store";
import { t } from "@/src/lib/translations";

export const InvoicePreview = ({ doc, lang = "en" }: { doc: DocumentData; lang?: "en" | "ar" }) => {
	const items = doc.lineItems.filter((i) => i.description);
	if (items.length === 0) return null;

	const total = items.reduce((sum, i) => sum + i.qty * i.rate, 0);

	return (
		<section>
			<h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-4 font-black">
				{t("Billing Details", lang)}
			</h3>
			<table className="w-full text-left">
				<thead>
					<tr className="border-b border-slate-900">
						<th className="py-4 text-[10px] uppercase font-black">{t("Description", lang)}</th>
						<th className="py-4 text-[10px] uppercase font-black text-center">
							{t("Qty", lang)}
						</th>
						<th className="py-4 text-[10px] uppercase font-black text-right">
							{t("Rate", lang)}
						</th>
						<th className="py-4 text-[10px] uppercase font-black text-right">
							{t("Total", lang)}
						</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-slate-100">
					{items.map((item) => (
						<tr key={item.id}>
							<td className="py-4 font-medium">{item.description}</td>
							<td className="py-4 text-center">{item.qty}</td>
							<td className="py-4 text-right">
								{doc.defaultCurrency} {item.rate}
							</td>
							<td className="py-4 text-right font-bold">
								{doc.defaultCurrency} {item.qty * item.rate}
							</td>
						</tr>
					))}
				</tbody>
				<tfoot>
					<tr className="border-t-2 border-slate-900">
						<td
							colSpan={3}
							className="pt-4 font-black text-right uppercase text-xs tracking-widest"
						>
							{t("Total", lang)}
						</td>
						<td className="pt-4 text-right font-black text-lg">
							{doc.defaultCurrency} {total.toLocaleString()}
						</td>
					</tr>
				</tfoot>
			</table>
		</section>
	);
};

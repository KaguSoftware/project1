import type { DocumentData } from "@/src/store";

export const InvoicePreview = ({ doc }: { doc: DocumentData }) => (
	<section>
		<h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-4 font-black">
			Billing Details
		</h3>
		<table className="w-full text-left">
			<thead>
				<tr className="border-b border-slate-900">
					<th className="py-4 text-[10px] uppercase font-black">
						Description
					</th>
					<th className="py-4 text-[10px] uppercase font-black text-center">
						Qty
					</th>
					<th className="py-4 text-[10px] uppercase font-black text-right">
						Rate
					</th>
					<th className="py-4 text-[10px] uppercase font-black text-right">
						Total
					</th>
				</tr>
			</thead>
			<tbody className="divide-y divide-slate-100">
				{doc.lineItems.map((item) => (
					<tr key={item.id}>
						<td className="py-4 font-medium">{item.description}</td>
						<td className="py-4 text-center">{item.qty}</td>
						<td className="py-4 text-right">${item.rate}</td>
						<td className="py-4 text-right font-bold">
							${item.qty * item.rate}
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
						Total
					</td>
					<td className="pt-4 text-right font-black text-lg">
						$
						{doc.lineItems
							.reduce((sum, i) => sum + i.qty * i.rate, 0)
							.toLocaleString()}
					</td>
				</tr>
			</tfoot>
		</table>
	</section>
);

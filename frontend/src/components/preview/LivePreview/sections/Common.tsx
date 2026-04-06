import type { DocumentData } from "@/src/store";

export const TermsPreview = ({ doc }: { doc: DocumentData }) => {
	const show =
		(doc.type === "proposal" || doc.type === "invoice") &&
		doc.termsAndConditions.some((c) => c.text);

	if (!show) return null;

	return (
		<section>
			<h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-4 font-black">
				{doc.type === "invoice" ? "Payment Terms" : "Terms & Conditions"}
			</h3>
			<ol className="space-y-3">
				{doc.termsAndConditions
					.filter((c) => c.text)
					.map((clause, idx) => (
						<li
							key={clause.id}
							className="flex gap-3 text-sm text-slate-600"
						>
							<span className="w-5 h-5 flex-shrink-0 flex items-center justify-center rounded-full bg-slate-100 text-[10px] font-black text-slate-500 mt-0.5">
								{idx + 1}
							</span>
							{clause.text}
						</li>
					))}
			</ol>
		</section>
	);
};

export const TextSectionPreview = ({
	text,
	label,
}: {
	text: string;
	label: string;
}) => (
	<section>
		<h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-4 font-black">
			{label}
		</h3>
		<div className="whitespace-pre-wrap text-slate-700 leading-relaxed text-base">
			{text}
		</div>
	</section>
);

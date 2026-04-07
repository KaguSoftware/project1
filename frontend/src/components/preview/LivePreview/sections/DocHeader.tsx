import type { DocumentData } from "@/src/store";
import { t } from "@/src/lib/translations";

export const DocHeader = ({
	doc,
	today,
	lang = "en",
}: {
	doc: DocumentData;
	today: string;
	lang?: "en" | "ar";
}) => (
	<div className="flex justify-between items-start mb-8">
		<div>
			<h1 className="text-4xl font-black text-slate-900 mb-2 uppercase tracking-widest">
				{t(doc.type.replace(/_/g, " "), lang)}
			</h1>
			<p className="text-slate-500 font-medium tracking-widest uppercase text-[10px] italic">
				{t("Reference", lang)}: {doc.projectTitle || t("Untitled Project", lang)} • {today}
			</p>
		</div>
		<div className="text-right">
			<div className="bg-slate-900 text-white px-4 py-2 rounded-lg font-black text-xl tracking-tighter mb-1">
				GENBUZZ
			</div>
			<p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">
				{t("Official Document", lang)}
			</p>
		</div>
	</div>
);

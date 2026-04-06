import type { DocumentData } from "@/src/store";

export const DocHeader = ({
	doc,
	today,
}: {
	doc: DocumentData;
	today: string;
}) => (
	<div className="flex justify-between items-start mb-8">
		<div>
			<h1 className="text-4xl font-black text-slate-900 mb-2 uppercase tracking-widest">
				{doc.type.replace(/_/g, " ")}
			</h1>
			<p className="text-slate-500 font-medium tracking-widest uppercase text-[10px] italic">
				Reference: {doc.projectTitle || "Untitled Project"} • {today}
			</p>
		</div>
		<div className="text-right">
			<div className="bg-slate-900 text-white px-4 py-2 rounded-lg font-black text-xl tracking-tighter mb-1">
				GENBUZZ
			</div>
			<p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">
				Official Document
			</p>
		</div>
	</div>
);

import type { DocumentData } from "@/src/store";
import { t } from "@/src/lib/translations";

export const DocHeader = ({
    doc,
    today,
    lang = "en",
}: {
    doc: DocumentData;
    today: string;
    lang?: "en" | "ar" | "tr";
}) => (
    <div className="flex justify-between items-start mb-8">
        <div>
            <h1 className="text-4xl font-black text-slate-900 mb-2 uppercase tracking-widest">
                {t(doc.type.replace(/_/g, " "), lang)}
            </h1>
            <p className="text-slate-500 font-medium tracking-widest uppercase text-[10px] italic">
                {t("Reference", lang)}:{" "}
                {doc.projectTitle || t("Untitled Project", lang)} • {today}
            </p>
        </div>
        <div className="text-right">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src="/logo-main-genbuzz.png"
                alt="GenBuzz"
                className="h-7 mb-1 inline-block"
            />
            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                {t("Official Document", lang)}
            </p>
        </div>
    </div>
);

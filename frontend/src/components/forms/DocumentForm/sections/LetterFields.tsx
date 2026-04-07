"use client";
import { useAppStore } from "@/src/store";
import { TypeIcon } from "lucide-react";
import { t } from "@/src/lib/translations";
import { FormField, inputClass } from "../ui/FormField";
import { SectionHeader } from "../ui/SectionHeader";

export const LetterFields = () => {
	const { document, updateDocument, language } = useAppStore();
	const tr = (key: string) => t(key, language);

	return (
		<div className="space-y-8">
			<SectionHeader title="Letter Content" icon={TypeIcon} />
			<FormField label="Message Body">
				<textarea
					className={`${inputClass} h-112.5 resize-none leading-relaxed`}
					placeholder={tr("Type your content here...")}
					value={document.body}
					onChange={(e) => updateDocument({ body: e.target.value })}
				/>
			</FormField>
		</div>
	);
};

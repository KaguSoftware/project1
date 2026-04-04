"use client";
import { PREVIEW_CONTENT } from "./constants";
import type { LivePreviewProps } from "./types";

export const LivePreview = ({ className = "" }: LivePreviewProps) => {
	return (
		<div
			className={`flex-1 bg-white rounded-3xl p-10 xl:p-16 shadow-sm border border-slate-200/60 min-h-[800px] ${className}`}
		>
			<div className="max-w-4xl mx-auto">
				<div className="border-b border-slate-100 pb-6 mb-8">
					<h2 className="text-3xl font-semibold tracking-tight text-slate-800">
						{PREVIEW_CONTENT.header}
					</h2>
					<p className="text-slate-500 mt-2">
						{PREVIEW_CONTENT.subheader}
					</p>
				</div>

				<div className="prose prose-slate max-w-none">
					<p className="text-slate-600 leading-relaxed">
						{PREVIEW_CONTENT.bodyText}
					</p>
				</div>
			</div>
		</div>
	);
};

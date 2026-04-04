"use client";
import { useAppStore } from "@/src/lib/store";
import { PREVIEW_CONTENT } from "./constants";
import type { LivePreviewProps } from "./types";

export const LivePreview = ({ className = "" }: LivePreviewProps) => {
	const { proposal } = useAppStore();

	return (
		<div
			className={`flex-1 bg-white rounded-3xl p-10 xl:p-16 shadow-sm border border-slate-200/60 min-h-200 ${className}`}
		>
			<div className="max-w-4xl mx-auto">
				<div className="border-b border-slate-100 pb-8 mb-8">
					<h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">
						{proposal.title || "Untitled Proposal"}
					</h1>
					<p className="text-xl text-slate-500">
						Prepared for:{" "}
						<span className="font-semibold text-slate-700">
							{proposal.clientName || "Client Name"}
						</span>
					</p>
				</div>

				{/* The body content */}
				<div className="prose prose-slate max-w-none">
					{proposal.aiIntro && (
						<div className="bg-slate-50 p-6 rounded-2xl mb-8 border border-slate-100">
							<h3 className="mt-0 text-lg font-semibold">
								Introduction
							</h3>
							<p className="mb-0 text-slate-600">
								{proposal.aiIntro}
							</p>
						</div>
					)}

					<h3 className="text-xl font-semibold text-slate-800">
						Deliverables
					</h3>
					<div className="whitespace-pre-wrap text-slate-600 leading-relaxed min-h-25">
						{proposal.deliverables ||
							"Your deliverables will appear here..."}
					</div>
				</div>
			</div>
		</div>
	);
};

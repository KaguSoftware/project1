"use client";
import { useState } from "react";
import { useAppStore } from "@/src/store";
import { exportToPDF } from "@/src/lib/pdf";
import type { LivePreviewProps } from "./types";

export const LivePreview = ({ className = "" }: LivePreviewProps) => {
	const { document: doc } = useAppStore();
	const [isExporting, setIsExporting] = useState(false);

	const handleDownload = async () => {
		setIsExporting(true);
		const filename = `${doc.type}-${doc.clientName.replace(/\s+/g, "-").toLowerCase() || "draft"}`;
		await exportToPDF("document-page", filename);
		setIsExporting(false);
	};

	const today = new Date().toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	return (
		<div
			className={`flex-1 flex flex-col items-center gap-6 overflow-y-auto ${className}`}
		>
			{/* Action Bar */}
			<div className="w-full max-w-200 flex justify-end">
				<button
					onClick={handleDownload}
					disabled={isExporting}
					className="btn bg-slate-900 text-white hover:bg-slate-800 border-none shadow-md px-6 rounded-xl font-bold uppercase tracking-widest text-[10px]"
				>
					{isExporting ? "Exporting..." : "Download Clean PDF"}
				</button>
			</div>

			{/* The Paper Context */}
			<div className="shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] mb-20 border border-slate-200 rounded-sm">
				<div
					id="document-page"
					className="bg-white w-198.5 min-h-280.75 px-16 py-20 relative flex flex-col text-slate-800 pdf-safe-mode"
				>
					{/* --- HEADER --- */}
					<div className="flex justify-between items-start mb-8">
						<div>
							<h1 className="text-4xl font-black text-slate-900 mb-2 uppercase tracking-widest">
								{doc.type.replace(/_/g, " ")}
							</h1>
							<p className="text-slate-500 font-bold tracking-widest uppercase text-[10px]">
								Reference:{" "}
								{doc.projectTitle || "Untitled Project"} •{" "}
								{today}
							</p>
						</div>
						<div className="text-right">
							<div className="bg-slate-900 text-white px-4 py-2 rounded-lg font-black text-xl tracking-tighter mb-1">
								GENBUZZ
							</div>
							<p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">
								Official Business Document
							</p>
						</div>
					</div>

					<div className="w-full h-1 bg-slate-900 mb-12"></div>

					{/* --- CLIENT INFO --- */}
					<div className="grid grid-cols-2 gap-8 mb-16">
						<div>
							<p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 font-black">
								Prepared For
							</p>
							<p className="text-2xl font-bold text-slate-900 leading-tight">
								{doc.clientName || "Client Name"}
							</p>
						</div>
						<div className="text-right">
							<p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 font-black">
								Project Context
							</p>
							<p className="text-lg font-bold text-slate-700">
								{doc.projectTitle || "Project Description"}
							</p>
						</div>
					</div>

					{/* --- CONTENT --- */}
					<div className="flex-1 space-y-12">
						{/* Executive Summary */}
						{doc.aiIntro && (
							<section>
								<h3 className="text-[10px] text-slate-400 uppercase tracking-[0.2em] mb-4 font-black border-b border-slate-100 pb-2">
									01. Executive Summary
								</h3>
								<p className="text-slate-900 leading-relaxed text-base font-medium">
									{doc.aiIntro}
								</p>
							</section>
						)}

						{/* Proposal Details & Pricing */}
						{doc.type === "proposal" && (
							<>
								<section>
									<h3 className="text-[10px] text-slate-400 uppercase tracking-[0.2em] mb-4 font-black border-b border-slate-100 pb-2">
										02. Scope of Work
									</h3>
									<div className="text-slate-900 leading-relaxed whitespace-pre-wrap font-medium">
										{doc.scopeOfWork}
									</div>
								</section>

								<section className="bg-slate-50 p-8 border-l-4 border-slate-900">
									<h3 className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mb-2 font-black">
										Financial Investment
									</h3>
									<p className="text-4xl font-black text-slate-900">
										{doc.pricingPackage || "TBD"}
									</p>
								</section>
							</>
						)}

						{/* Universal Terms & Clauses */}
						{doc.termsAndConditions?.length > 0 && (
							<section>
								<h3 className="text-[10px] text-slate-400 uppercase tracking-[0.2em] mb-6 font-black border-b border-slate-100 pb-2">
									Terms & Legal Clauses
								</h3>
								<div className="space-y-4">
									{doc.termsAndConditions.map(
										(term: any, i: number) => (
											<div
												key={i}
												className="flex gap-6 text-sm text-slate-800"
											>
												<span className="font-black text-slate-300">
													{(i + 1)
														.toString()
														.padStart(2, "0")}
												</span>
												<p className="font-medium leading-relaxed">
													{term.text}
												</p>
											</div>
										),
									)}
								</div>
							</section>
						)}
					</div>

					{/* --- FOOTER --- */}
					<div className="w-full h-px bg-slate-100 mb-6 mt-20"></div>
					<div className="flex justify-between items-center text-slate-400">
						<p className="text-[9px] tracking-[0.3em] uppercase font-black">
							GENBUZZ INTERNAL SYSTEMS
						</p>
						<p className="text-[9px] tracking-[0.3em] uppercase font-black">
							Confidential • 2026
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

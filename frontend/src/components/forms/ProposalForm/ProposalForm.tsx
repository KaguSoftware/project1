"use client";
import { useState } from "react";
import { useAppStore } from "@/src/lib/store";
export const ProposalForm = () => {
	const { proposal, updateProposal } = useAppStore();
	const [isGenerating, setIsGenerating] = useState(false);

	const handleGenerate = async () => {
		setIsGenerating(true);
		try {
			const res = await fetch("/api/generate-intro", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(proposal),
			});

			const data = await res.json();

			if (data.intro) {
				updateProposal({ aiIntro: data.intro });
			}
		} catch (error) {
			console.error("Failed to generate", error);
		} finally {
			setIsGenerating(false);
		}
	};

	return (
		<div className="space-y-5">
			<div className="form-control">
				<label className="label">
					<span className="label-text font-medium text-slate-700">
						Proposal Title
					</span>
				</label>
				<input
					type="text"
					className="input input-bordered w-full bg-white border-slate-200 focus:border-primary"
					value={proposal.title}
					onChange={(e) => updateProposal({ title: e.target.value })}
				/>
			</div>

			<div className="form-control">
				<label className="label">
					<span className="label-text font-medium text-slate-700">
						Client Name
					</span>
				</label>
				<input
					type="text"
					className="input input-bordered w-full bg-white border-slate-200 focus:border-primary"
					value={proposal.clientName}
					onChange={(e) =>
						updateProposal({ clientName: e.target.value })
					}
				/>
			</div>

			<div className="form-control">
				<label className="label">
					<span className="label-text font-medium text-slate-700">
						Deliverables
					</span>
				</label>
				<textarea
					className="textarea textarea-bordered h-24 bg-white border-slate-200 focus:border-primary"
					value={proposal.deliverables}
					onChange={(e) =>
						updateProposal({ deliverables: e.target.value })
					}
				></textarea>
			</div>

			<button
				onClick={handleGenerate}
				disabled={isGenerating || !proposal.clientName}
				className="btn btn-primary w-full mt-4"
			>
				{isGenerating ? "✨ Generating..." : "✨ Generate AI Intro"}
			</button>
		</div>
	);
};

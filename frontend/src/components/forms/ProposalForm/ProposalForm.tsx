"use client";
import { useAppStore } from "../../../lib/store";

export const ProposalForm = () => {
	const { proposal, updateProposal } = useAppStore();

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
					placeholder="e.g. Q3 Marketing Campaign"
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
					placeholder="e.g. Acme Corp"
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
					placeholder="List your deliverables here..."
					value={proposal.deliverables}
					onChange={(e) =>
						updateProposal({ deliverables: e.target.value })
					}
				></textarea>
			</div>

			<button className="btn btn-primary w-full mt-4">
				✨ Generate AI Intro
			</button>
		</div>
	);
};

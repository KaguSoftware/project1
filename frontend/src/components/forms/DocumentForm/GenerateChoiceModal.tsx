"use client";
import { DocType } from "@/src/store/types";

interface Props {
  docType: DocType;
  onStartFresh: () => void;
  onKeepEntries: () => void;
  onClose: () => void;
}

const DOC_TYPE_LABELS: Record<DocType, string> = {
  proposal: "Proposal",
  contract: "Contract",
  invoice: "Invoice",
  letter: "Letter",
  social_media_report: "Social Media Report",
  weekly_sales_report: "Weekly Sales Report",
  influencer_campaign: "Influencer Campaign",
};

export const GenerateChoiceModal = ({ docType, onStartFresh, onKeepEntries, onClose }: Props) => {
  const label = DOC_TYPE_LABELS[docType] ?? docType;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-800">
              Generate {label}
            </h2>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              You already have data entered. How would you like to proceed?
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-slate-500 transition-colors shrink-0 text-lg leading-none"
          >
            ×
          </button>
        </div>

        <div className="space-y-2">
          <button
            onClick={onStartFresh}
            className="w-full flex flex-col gap-0.5 text-left px-4 py-3.5 rounded-xl border-2 border-red-100 bg-red-50 hover:border-red-300 transition-all"
          >
            <span className="text-xs font-black uppercase tracking-wider text-red-600">
              Start Fresh
            </span>
            <span className="text-[11px] text-red-400">
              Remove all entries and generate a full new {label}
            </span>
          </button>

          <button
            onClick={onKeepEntries}
            className="w-full flex flex-col gap-0.5 text-left px-4 py-3.5 rounded-xl border-2 border-primary/20 bg-primary/5 hover:border-primary/40 transition-all"
          >
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Keep My Entries
            </span>
            <span className="text-[11px] text-primary/60">
              Choose which fields to generate while keeping existing data
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

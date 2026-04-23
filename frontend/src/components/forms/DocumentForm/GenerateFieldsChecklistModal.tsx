"use client";
import { useState } from "react";
import type { DocType } from "@/src/store/types";
import type { GeneratableField } from "@/src/lib/generatableFields";

interface Props {
  docType: DocType;
  fields: GeneratableField[];
  /** keys of fields that are currently empty — pre-checked */
  emptyKeys: Set<string>;
  onGenerate: (selectedKeys: string[]) => void;
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

export const GenerateFieldsChecklistModal = ({
  docType,
  fields,
  emptyKeys,
  onGenerate,
  onClose,
}: Props) => {
  const [checked, setChecked] = useState<Set<string>>(
    () => new Set(fields.filter((f) => emptyKeys.has(f.key)).map((f) => f.key)),
  );

  const toggle = (key: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleAll = () => {
    if (checked.size === fields.length) setChecked(new Set());
    else setChecked(new Set(fields.map((f) => f.key)));
  };

  const handleGenerate = () => {
    if (checked.size === 0) return;
    onGenerate([...checked]);
  };

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
              Choose Fields to Generate
            </h2>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              Select which fields to generate for your {label}. Filled fields are unchecked — checking them will overwrite their current content.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-slate-500 transition-colors shrink-0 text-lg leading-none"
          >
            ×
          </button>
        </div>

        <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
          {fields.map((field) => {
            const isEmpty = emptyKeys.has(field.key);
            const isChecked = checked.has(field.key);
            return (
              <label
                key={field.key}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-all ${
                  isChecked
                    ? "border-primary/30 bg-primary/5"
                    : "border-slate-100 bg-slate-50 hover:border-slate-200"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggle(field.key)}
                  className="w-3.5 h-3.5 accent-primary shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-bold text-slate-700 block">
                    {field.label}
                  </span>
                  {!isEmpty && (
                    <span className="text-[10px] text-amber-500 font-medium">
                      Currently filled — will overwrite
                    </span>
                  )}
                </div>
              </label>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
          <button
            onClick={toggleAll}
            className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
          >
            {checked.size === fields.length ? "Deselect All" : "Select All"}
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-[11px] font-black uppercase tracking-wider text-slate-400 hover:text-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={checked.size === 0}
              className="px-4 py-2 text-[11px] font-black uppercase tracking-wider bg-primary text-white rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-all"
            >
              Generate {checked.size > 0 ? `(${checked.size})` : ""}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

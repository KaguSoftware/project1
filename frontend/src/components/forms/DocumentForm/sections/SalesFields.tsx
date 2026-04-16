"use client";
import { useAppStore } from "@/src/store";
import { TrashIcon, PlusIcon, ChevronDownIcon } from "lucide-react";
import { inputClass } from "../ui/FormField";
import { SectionHeader } from "../ui/SectionHeader";
import { BarChart3Icon } from "lucide-react";
import { generateId } from "@/src/store/initialState";
import type { LeadRow, LeadSource, LeadStatus } from "@/src/store/types";

// ── Status config ─────────────────────────────────────────────────────────────

const STATUS_OPTIONS: { value: LeadStatus; label: string; color: string }[] = [
	{ value: "new_lead",          label: "New Lead",          color: "#6366f1" },
	{ value: "meeting_arranged",  label: "Meeting Arranged",  color: "#f59e0b" },
	{ value: "proposal_sent",     label: "Proposal Sent",     color: "#3b82f6" },
	{ value: "closed_won",        label: "Closed Won",        color: "#22c55e" },
	{ value: "closed_lost",       label: "Closed Lost",       color: "#ef4444" },
	{ value: "follow_up_needed",  label: "Follow-up Needed",  color: "#8b5cf6" },
];

const SOURCE_OPTIONS: { value: LeadSource; label: string }[] = [
	{ value: "referral",   label: "Referral"   },
	{ value: "instagram",  label: "Instagram"  },
	{ value: "facebook",   label: "Facebook"   },
	{ value: "linkedin",   label: "LinkedIn"   },
	{ value: "website",    label: "Website"    },
	{ value: "cold_call",  label: "Cold Call"  },
	{ value: "email",      label: "Email"      },
	{ value: "other",      label: "Other"      },
];

function statusColor(value: string) {
	return STATUS_OPTIONS.find((s) => s.value === value)?.color ?? "#94a3b8";
}

// ── Shared mini label ─────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
	return (
		<p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
			{children}
		</p>
	);
}

// ── Main component ────────────────────────────────────────────────────────────

export const SalesFields = () => {
	const { document, updateDocument } = useAppStore();
	const ws = document.weeklySales;

	function updateWS(patch: Partial<typeof ws>) {
		updateDocument({ weeklySales: { ...ws, ...patch } });
	}

	function updateLead(id: string, patch: Partial<LeadRow>) {
		updateWS({
			leads: ws.leads.map((l) => (l.id === id ? { ...l, ...patch } : l)),
		});
	}

	function addLead() {
		const blank: LeadRow = {
			id: generateId(),
			clientName: "",
			contactPerson: "",
			email: "",
			phone: "",
			leadSource: "",
			status: "",
			meetingDate: "",
			dealValue: "",
			notes: "",
		};
		updateWS({ leads: [...ws.leads, blank] });
	}

	function removeLead(id: string) {
		updateWS({ leads: ws.leads.filter((l) => l.id !== id) });
	}

	return (
		<div className="space-y-10">
			{/* ── Header info ──────────────────────────────────────────── */}
			<section>
				<SectionHeader title="Weekly Sales Report" icon={BarChart3Icon} />
				<div className="grid grid-cols-2 gap-4 mt-4">
					<div>
						<Label>Sales Person Name</Label>
						<input
							className={inputClass}
							value={ws.salesPersonName}
							onChange={(e) => updateWS({ salesPersonName: e.target.value })}
							placeholder="John Smith"
						/>
					</div>
					<div>
						<Label>Department / Team</Label>
						<input
							className={inputClass}
							value={ws.department}
							onChange={(e) => updateWS({ department: e.target.value })}
							placeholder="Sales Team A"
						/>
					</div>
					<div>
						<Label>Week Start</Label>
						<input
							type="date"
							className={inputClass}
							value={ws.weekStart}
							onChange={(e) => updateWS({ weekStart: e.target.value })}
						/>
					</div>
					<div>
						<Label>Week End</Label>
						<input
							type="date"
							className={inputClass}
							value={ws.weekEnd}
							onChange={(e) => updateWS({ weekEnd: e.target.value })}
						/>
					</div>
				</div>
			</section>

			{/* ── Leads ────────────────────────────────────────────────── */}
			<section className="space-y-4">
				<div className="flex items-center justify-between">
					<p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
						Leads
					</p>
					<button
						onClick={addLead}
						className="flex items-center gap-1 text-xs font-semibold text-primary hover:opacity-80 transition-opacity"
					>
						<PlusIcon size={13} />
						Add Lead
					</button>
				</div>

				{ws.leads.map((lead, idx) => (
					<LeadCard
						key={lead.id}
						lead={lead}
						index={idx}
						onChange={(patch) => updateLead(lead.id, patch)}
						onRemove={() => removeLead(lead.id)}
						canRemove={ws.leads.length > 1}
					/>
				))}
			</section>

			{/* ── Week summary ─────────────────────────────────────────── */}
			<section>
				<Label>Week Summary</Label>
				<textarea
					className={`${inputClass} h-24`}
					value={ws.weekSummary}
					onChange={(e) => updateWS({ weekSummary: e.target.value })}
					placeholder="Overall performance this week…"
				/>
			</section>

			{/* ── Challenges ───────────────────────────────────────────── */}
			<section>
				<Label>Challenges / Obstacles</Label>
				<textarea
					className={`${inputClass} h-20`}
					value={ws.challenges}
					onChange={(e) => updateWS({ challenges: e.target.value })}
					placeholder="Blockers or difficulties encountered…"
				/>
			</section>

			{/* ── Next week goals ───────────────────────────────────────── */}
			<section>
				<Label>Next Week's Goals</Label>
				<textarea
					className={`${inputClass} h-20`}
					value={ws.nextWeekGoals}
					onChange={(e) => updateWS({ nextWeekGoals: e.target.value })}
					placeholder="Targets and priorities for next week…"
				/>
			</section>

			{/* ── Additional notes ─────────────────────────────────────── */}
			<section>
				<Label>Additional Notes</Label>
				<textarea
					className={`${inputClass} h-20`}
					value={ws.additionalNotes}
					onChange={(e) => updateWS({ additionalNotes: e.target.value })}
					placeholder="Anything else worth noting…"
				/>
			</section>
		</div>
	);
};

// ── LeadCard ──────────────────────────────────────────────────────────────────

interface LeadCardProps {
	lead: LeadRow;
	index: number;
	onChange: (patch: Partial<LeadRow>) => void;
	onRemove: () => void;
	canRemove: boolean;
}

function LeadCard({ lead, index, onChange, onRemove, canRemove }: LeadCardProps) {
	return (
		<div className="border border-slate-200 rounded-xl p-4 space-y-4 bg-slate-50/50">
			{/* Card header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
						Lead {index + 1}
					</span>
					{lead.status && (
						<span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
							style={{
								backgroundColor: `${statusColor(lead.status)}18`,
								color: statusColor(lead.status),
							}}
						>
							<span
								className="w-1.5 h-1.5 rounded-full inline-block"
								style={{ backgroundColor: statusColor(lead.status) }}
							/>
							{STATUS_OPTIONS.find((s) => s.value === lead.status)?.label}
						</span>
					)}
				</div>
				{canRemove && (
					<button
						onClick={onRemove}
						className="text-slate-300 hover:text-red-400 transition-colors"
						aria-label="Remove lead"
					>
						<TrashIcon size={13} />
					</button>
				)}
			</div>

			{/* Row 1: client + contact */}
			<div className="grid grid-cols-2 gap-3">
				<div>
					<Label>Client Name</Label>
					<input
						className={inputClass}
						value={lead.clientName}
						onChange={(e) => onChange({ clientName: e.target.value })}
						placeholder="Acme Corp"
					/>
				</div>
				<div>
					<Label>Contact Person</Label>
					<input
						className={inputClass}
						value={lead.contactPerson}
						onChange={(e) => onChange({ contactPerson: e.target.value })}
						placeholder="Jane Doe"
					/>
				</div>
			</div>

			{/* Row 2: email + phone */}
			<div className="grid grid-cols-2 gap-3">
				<div>
					<Label>Email</Label>
					<input
						type="email"
						className={inputClass}
						value={lead.email}
						onChange={(e) => onChange({ email: e.target.value })}
						placeholder="jane@acme.com"
					/>
				</div>
				<div>
					<Label>Phone</Label>
					<input
						type="tel"
						className={inputClass}
						value={lead.phone}
						onChange={(e) => onChange({ phone: e.target.value })}
						placeholder="+1 555 0100"
					/>
				</div>
			</div>

			{/* Row 3: source + status */}
			<div className="grid grid-cols-2 gap-3">
				<div>
					<Label>Lead Source</Label>
					<div className="relative">
						<select
							className={`${inputClass} appearance-none pr-7`}
							value={lead.leadSource}
							onChange={(e) => onChange({ leadSource: e.target.value as LeadSource })}
						>
							<option value="">Select source…</option>
							{SOURCE_OPTIONS.map((o) => (
								<option key={o.value} value={o.value}>{o.label}</option>
							))}
						</select>
						<ChevronDownIcon size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
					</div>
				</div>
				<div>
					<Label>Status</Label>
					<div className="relative">
						<select
							className={`${inputClass} appearance-none pr-7`}
							value={lead.status}
							onChange={(e) => onChange({ status: e.target.value as LeadStatus })}
							style={{ color: lead.status ? statusColor(lead.status) : undefined }}
						>
							<option value="">Select status…</option>
							{STATUS_OPTIONS.map((o) => (
								<option key={o.value} value={o.value} style={{ color: o.color }}>
									{o.label}
								</option>
							))}
						</select>
						<ChevronDownIcon size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
					</div>
				</div>
			</div>

			{/* Row 4: meeting date + deal value */}
			<div className="grid grid-cols-2 gap-3">
				<div>
					<Label>Meeting Date</Label>
					<input
						type="date"
						className={inputClass}
						value={lead.meetingDate}
						onChange={(e) => onChange({ meetingDate: e.target.value })}
					/>
				</div>
				<div>
					<Label>Deal Value</Label>
					<input
						className={inputClass}
						value={lead.dealValue}
						onChange={(e) => onChange({ dealValue: e.target.value })}
						placeholder="$0"
					/>
				</div>
			</div>

			{/* Notes */}
			<div>
				<Label>Notes</Label>
				<textarea
					className={`${inputClass} h-16`}
					value={lead.notes}
					onChange={(e) => onChange({ notes: e.target.value })}
					placeholder="Additional context…"
				/>
			</div>
		</div>
	);
}

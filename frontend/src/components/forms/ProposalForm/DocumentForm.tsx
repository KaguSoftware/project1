"use client";
import { useState } from "react";
import { useAppStore, DocType } from "@/src/store";
import {
	PlusIcon,
	TrashIcon,
	SparklesIcon,
	LayoutGridIcon,
	FileTextIcon,
	ReceiptIcon,
	BarChart3Icon,
	UsersIcon,
	TypeIcon,
	CalendarIcon,
	DollarSignIcon,
} from "lucide-react";

export const DocumentForm = () => {
	const {
		document,
		updateDocument,
		addArrayItem,
		updateArrayItem,
		removeArrayItem,
	} = useAppStore();
	const [isGenerating, setIsGenerating] = useState(false);

	// Helpers for consistent styling
	const inputClass =
		"w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none placeholder:text-slate-400 shadow-sm";
	const labelClass =
		"block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 px-1";

	const SectionTitle = ({
		title,
		icon: Icon,
	}: {
		title: string;
		icon: any;
	}) => (
		<div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
			<div className="p-2 bg-slate-50 rounded-lg text-slate-400">
				<Icon size={18} />
			</div>
			<h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-800">
				{title}
			</h2>
		</div>
	);

	return (
		<div className="w-full max-w-4xl mx-auto space-y-12 pb-32">
			{/* --- CATEGORY SELECTOR --- */}
			<section>
				<label className={labelClass}>Select Document Category</label>
				<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
					{[
						{
							id: "proposal",
							label: "Proposal",
							icon: FileTextIcon,
						},
						{
							id: "contract",
							label: "Contract",
							icon: LayoutGridIcon,
						},
						{ id: "invoice", label: "Invoice", icon: ReceiptIcon },
						{ id: "letter", label: "Letter", icon: TypeIcon },
						{
							id: "social_media_report",
							label: "Social",
							icon: BarChart3Icon,
						},
						{
							id: "weekly_sales_report",
							label: "Sales",
							icon: BarChart3Icon,
						},
						{
							id: "influencer_campaign",
							label: "Influencer",
							icon: UsersIcon,
						},
					].map((item) => (
						<button
							key={item.id}
							onClick={() =>
								updateDocument({ type: item.id as DocType })
							}
							className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
								document.type === item.id
									? "border-primary bg-primary/5 text-primary shadow-sm"
									: "border-slate-100 bg-white text-slate-400 hover:border-slate-200"
							}`}
						>
							<item.icon size={20} />
							<span className="text-[10px] font-bold uppercase tracking-wider text-center">
								{item.label}
							</span>
						</button>
					))}
				</div>
			</section>

			{/* --- IDENTITY FIELDS --- */}
			<section className="space-y-6 bg-slate-50/50 p-8 rounded-3xl border border-slate-200">
				<div className="form-control">
					<label className={labelClass}>Project Title</label>
					<input
						type="text"
						className={inputClass}
						placeholder="e.g. Q4 Branding Phase"
						value={document.projectTitle}
						onChange={(e) =>
							updateDocument({ projectTitle: e.target.value })
						}
					/>
				</div>
				<div className="form-control">
					<label className={labelClass}>Client Name</label>
					<input
						type="text"
						className={inputClass}
						placeholder="e.g. Acme Corp"
						value={document.clientName}
						onChange={(e) =>
							updateDocument({ clientName: e.target.value })
						}
					/>
				</div>
			</section>

			{/* --- DYNAMIC CONTENT AREA --- */}
			<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
				{/* PROPOSAL */}
				{document.type === "proposal" && (
					<div className="space-y-8">
						<SectionTitle
							title="Proposal Details"
							icon={FileTextIcon}
						/>
						<div className="form-control">
							<label className={labelClass}>Introduction</label>
							<textarea
								className={`${inputClass} h-32`}
								placeholder="AI will help refine this..."
								value={document.aiIntro}
								onChange={(e) =>
									updateDocument({ aiIntro: e.target.value })
								}
							/>
						</div>
						<div className="form-control">
							<label className={labelClass}>Scope of Work</label>
							<textarea
								className={`${inputClass} h-32`}
								value={document.scopeOfWork}
								onChange={(e) =>
									updateDocument({
										scopeOfWork: e.target.value,
									})
								}
							/>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							<div className="form-control">
								<label className={labelClass}>
									Pricing Package
								</label>
								<div className="grid grid-cols-3 gap-2 p-1.5 bg-white border border-slate-300 rounded-2xl">
									{["basic", "standard", "premium"].map(
										(pkg) => (
											<button
												key={pkg}
												className={`py-2 text-[10px] font-black uppercase rounded-xl transition-all ${document.pricingPackage === pkg ? "bg-primary text-white" : "text-slate-400 hover:bg-slate-50"}`}
												onClick={() =>
													updateDocument({
														pricingPackage:
															pkg as any,
													})
												}
											>
												{pkg}
											</button>
										),
									)}
								</div>
							</div>
							<div className="form-control">
								<label className={labelClass}>Timeline</label>
								<input
									type="text"
									className={inputClass}
									value={document.timeline}
									onChange={(e) =>
										updateDocument({
											timeline: e.target.value,
										})
									}
								/>
							</div>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<div className="form-control">
								<label className={labelClass}>Currency</label>
								<input
									type="text"
									className={inputClass}
									value={document.defaultCurrency}
									onChange={(e) =>
										updateDocument({
											defaultCurrency: e.target.value,
										})
									}
								/>
							</div>
							<div className="form-control">
								<label className={labelClass}>
									Total Price
								</label>
								<input
									type="text"
									className={inputClass}
									value={document.totalPrice}
									onChange={(e) =>
										updateDocument({
											totalPrice: e.target.value,
										})
									}
								/>
							</div>
							<div className="form-control">
								<label className={labelClass}>
									Valid Until
								</label>
								<input
									type="text"
									className={inputClass}
									value={document.validUntil}
									onChange={(e) =>
										updateDocument({
											validUntil: e.target.value,
										})
									}
								/>
							</div>
						</div>
						<div className="space-y-4 pt-4">
							<label className={labelClass}>
								Terms & Conditions
							</label>
							{document.termsAndConditions.map((clause, idx) => (
								<div
									key={clause.id}
									className="flex gap-3 items-center group"
								>
									<div className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-xs font-black text-slate-400 border border-slate-200">
										{idx + 1}
									</div>
									<input
										type="text"
										className={inputClass}
										value={clause.text}
										onChange={(e) =>
											updateArrayItem(
												"termsAndConditions",
												clause.id,
												{ text: e.target.value },
											)
										}
									/>
									<button
										onClick={() =>
											removeArrayItem(
												"termsAndConditions",
												clause.id,
											)
										}
										className="btn btn-ghost btn-circle btn-sm text-slate-300 hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
									>
										<TrashIcon size={16} />
									</button>
								</div>
							))}
							<button
								onClick={() =>
									addArrayItem("termsAndConditions", {
										text: "",
									})
								}
								className="btn btn-ghost btn-sm text-primary font-bold"
							>
								+ Add Clause
							</button>
						</div>
						<div className="form-control">
							<label className={labelClass}>
								Additional Notes
							</label>
							<textarea
								className={`${inputClass} h-24`}
								value={document.additionalNotes}
								onChange={(e) =>
									updateDocument({
										additionalNotes: e.target.value,
									})
								}
							/>
						</div>
					</div>
				)}
				{/* CONTRACT */}
				{document.type === "contract" && (
					<div className="space-y-8">
						<SectionTitle
							title="Agreement Details"
							icon={LayoutGridIcon}
						/>
						<div className="form-control">
							<label className={labelClass}>
								Agreement Overview
							</label>
							<textarea
								className={`${inputClass} h-24`}
								value={document.agreementOverview}
								onChange={(e) =>
									updateDocument({
										agreementOverview: e.target.value,
									})
								}
							/>
						</div>
						<div className="form-control">
							<label className={labelClass}>
								Scope of Services
							</label>
							<textarea
								className={`${inputClass} h-32`}
								value={document.scopeOfWork}
								onChange={(e) =>
									updateDocument({
										scopeOfWork: e.target.value,
									})
								}
							/>
						</div>

						<div className="space-y-4">
							<label className={labelClass}>
								Deliverables Table
							</label>
							<div className="grid grid-cols-12 gap-4 px-1 text-[10px] font-black uppercase text-slate-400">
								<div className="col-span-5">Deliverable</div>
								<div className="col-span-3">Timeline</div>
								<div className="col-span-3">Status</div>
							</div>
							{document.deliverables.map((row) => (
								<div
									key={row.id}
									className="grid grid-cols-12 gap-3 items-center group animate-in slide-in-from-left-2 duration-200"
								>
									<input
										className={`${inputClass} col-span-5 py-2`}
										placeholder="Task name"
										value={row.deliverable}
										onChange={(e) =>
											updateArrayItem(
												"deliverables",
												row.id,
												{ deliverable: e.target.value },
											)
										}
									/>
									<input
										className={`${inputClass} col-span-3 py-2`}
										placeholder="e.g. Week 2"
										value={row.timeline}
										onChange={(e) =>
											updateArrayItem(
												"deliverables",
												row.id,
												{ timeline: e.target.value },
											)
										}
									/>
									<input
										className={`${inputClass} col-span-3 py-2`}
										placeholder="Pending"
										value={row.status}
										onChange={(e) =>
											updateArrayItem(
												"deliverables",
												row.id,
												{ status: e.target.value },
											)
										}
									/>
									<button
										onClick={() =>
											removeArrayItem(
												"deliverables",
												row.id,
											)
										}
										className="col-span-1 text-slate-300 hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
									>
										<TrashIcon size={14} />
									</button>
								</div>
							))}
							<button
								onClick={() => addArrayItem("deliverables")}
								className="btn btn-ghost btn-sm text-primary font-bold"
							>
								+ Add Row
							</button>
						</div>

						<div className="space-y-4 pt-4">
							<label className={labelClass}>
								Terms & Conditions
							</label>
							{document.termsAndConditions.map((clause, idx) => (
								<div
									key={clause.id}
									className="flex gap-3 items-center group"
								>
									<div className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-xs font-black text-slate-400 border border-slate-200">
										{idx + 1}
									</div>
									<input
										type="text"
										className={inputClass}
										value={clause.text}
										onChange={(e) =>
											updateArrayItem(
												"termsAndConditions",
												clause.id,
												{ text: e.target.value },
											)
										}
									/>
									<button
										onClick={() =>
											removeArrayItem(
												"termsAndConditions",
												clause.id,
											)
										}
										className="btn btn-ghost btn-circle btn-sm text-slate-300 hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
									>
										<TrashIcon size={16} />
									</button>
								</div>
							))}
							<button
								onClick={() =>
									addArrayItem("termsAndConditions", {
										text: "",
									})
								}
								className="btn btn-ghost btn-sm text-primary font-bold"
							>
								+ Add Clause
							</button>
						</div>
					</div>
				)}

				{/* INVOICE */}
				{document.type === "invoice" && (
					<div className="space-y-8">
						<SectionTitle
							title="Billing Items"
							icon={ReceiptIcon}
						/>
						<div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
							<div className="grid grid-cols-12 gap-4 px-2 text-[10px] font-black uppercase text-slate-400">
								<div className="col-span-5">Description</div>
								<div className="col-span-2 text-center">
									QTY
								</div>
								<div className="col-span-2 text-center">
									Rate
								</div>
								<div className="col-span-2 text-right">
									Amount
								</div>
							</div>
							{document.lineItems.map((item) => (
								<div
									key={item.id}
									className="grid grid-cols-12 gap-4 items-center group"
								>
									<input
										className={`${inputClass} col-span-5 py-2`}
										value={item.description}
										onChange={(e) =>
											updateArrayItem(
												"lineItems",
												item.id,
												{ description: e.target.value },
											)
										}
									/>
									<input
										className={`${inputClass} col-span-2 py-2 text-center`}
										type="number"
										value={item.qty}
										onChange={(e) =>
											updateArrayItem(
												"lineItems",
												item.id,
												{ qty: Number(e.target.value) },
											)
										}
									/>
									<input
										className={`${inputClass} col-span-2 py-2 text-center`}
										type="number"
										value={item.rate}
										onChange={(e) =>
											updateArrayItem(
												"lineItems",
												item.id,
												{
													rate: Number(
														e.target.value,
													),
												},
											)
										}
									/>
									<div className="col-span-2 text-right font-bold text-slate-700">
										$
										{(
											item.qty * item.rate
										).toLocaleString()}
									</div>
									<button
										onClick={() =>
											removeArrayItem(
												"lineItems",
												item.id,
											)
										}
										className="col-span-1 text-slate-300 hover:text-error opacity-0 group-hover:opacity-100"
									>
										<TrashIcon size={14} />
									</button>
								</div>
							))}
							<button
								onClick={() =>
									addArrayItem("lineItems", {
										description: "",
										qty: 1,
										rate: 0,
									})
								}
								className="btn btn-ghost btn-sm text-primary font-bold"
							>
								+ Add Item
							</button>
						</div>
						<div className="space-y-4 pt-4">
							<label className={labelClass}>Payment Terms</label>
							{document.termsAndConditions.map((clause, idx) => (
								<div
									key={clause.id}
									className="flex gap-3 items-center group"
								>
									<div className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-xs font-black text-slate-400 border border-slate-200">
										{idx + 1}
									</div>
									<input
										type="text"
										className={inputClass}
										value={clause.text}
										onChange={(e) =>
											updateArrayItem(
												"termsAndConditions",
												clause.id,
												{ text: e.target.value },
											)
										}
									/>
									<button
										onClick={() =>
											removeArrayItem(
												"termsAndConditions",
												clause.id,
											)
										}
										className="btn btn-ghost btn-circle btn-sm text-slate-300 hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
									>
										<TrashIcon size={16} />
									</button>
								</div>
							))}
							<button
								onClick={() =>
									addArrayItem("termsAndConditions", {
										text: "",
									})
								}
								className="btn btn-ghost btn-sm text-primary font-bold"
							>
								+ Add Term
							</button>
						</div>
					</div>
				)}

				{/* LETTER / MEMO */}
				{document.type === "letter" && (
					<div className="space-y-8">
						<SectionTitle title="Letter Content" icon={TypeIcon} />
						<div className="form-control">
							<label className={labelClass}>Message Body</label>
							<textarea
								className={`${inputClass} h-[400px] resize-none`}
								placeholder="Write your letter here..."
								value={document.body}
								onChange={(e) =>
									updateDocument({ body: e.target.value })
								}
							/>
						</div>
					</div>
				)}
				{/* SOCIAL MEDIA REPORT */}
				{document.type === "social_media_report" && (
					<div className="space-y-8">
						<SectionTitle
							title="Performance Overview"
							icon={BarChart3Icon}
						/>
						<div className="space-y-4">
							<div className="grid grid-cols-12 gap-4 px-1 text-[10px] font-black uppercase text-slate-400">
								<div className="col-span-5">Metric</div>
								<div className="col-span-4">Value</div>
								<div className="col-span-2">Delta</div>
							</div>
							{document.performanceMetrics.map((row) => (
								<div
									key={row.id}
									className="grid grid-cols-12 gap-3 items-center group"
								>
									<input
										className={`${inputClass} col-span-5 py-2`}
										placeholder="e.g. Reach"
										value={row.metric}
										onChange={(e) =>
											updateArrayItem(
												"performanceMetrics",
												row.id,
												{ metric: e.target.value },
											)
										}
									/>
									<input
										className={`${inputClass} col-span-4 py-2`}
										placeholder="1.2M"
										value={row.number}
										onChange={(e) =>
											updateArrayItem(
												"performanceMetrics",
												row.id,
												{ number: e.target.value },
											)
										}
									/>
									<input
										className={`${inputClass} col-span-2 py-2 ${row.delta.startsWith("-") ? "text-error" : "text-success"}`}
										placeholder="+4.5%"
										value={row.delta}
										onChange={(e) =>
											updateArrayItem(
												"performanceMetrics",
												row.id,
												{ delta: e.target.value },
											)
										}
									/>
									<button
										onClick={() =>
											removeArrayItem(
												"performanceMetrics",
												row.id,
											)
										}
										className="col-span-1 text-slate-300 hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
									>
										<TrashIcon size={14} />
									</button>
								</div>
							))}
							<button
								onClick={() =>
									addArrayItem("performanceMetrics")
								}
								className="btn btn-ghost btn-sm text-primary font-bold"
							>
								+ Add Metric
							</button>
						</div>

						<div className="form-control">
							<label className={labelClass}>
								Executive Summary
							</label>
							<textarea
								className={`${inputClass} h-32`}
								value={document.aiIntro}
								onChange={(e) =>
									updateDocument({ aiIntro: e.target.value })
								}
							/>
						</div>

						<div className="space-y-4">
							<label className={labelClass}>
								Top Performing Posts
							</label>
							<div className="grid grid-cols-12 gap-4 px-1 text-[10px] font-black uppercase text-slate-400">
								<div className="col-span-5">Post Content</div>
								<div className="col-span-2 text-center">
									Likes
								</div>
								<div className="col-span-2 text-center">
									Comm.
								</div>
								<div className="col-span-2 text-center">
									Shares
								</div>
							</div>
							{document.topPosts.map((row) => (
								<div
									key={row.id}
									className="grid grid-cols-12 gap-3 items-center group"
								>
									<input
										className={`${inputClass} col-span-5 py-2`}
										value={row.post}
										onChange={(e) =>
											updateArrayItem(
												"topPosts",
												row.id,
												{ post: e.target.value },
											)
										}
									/>
									<input
										className={`${inputClass} col-span-2 py-2 text-center`}
										value={row.likes}
										onChange={(e) =>
											updateArrayItem(
												"topPosts",
												row.id,
												{ likes: e.target.value },
											)
										}
									/>
									<input
										className={`${inputClass} col-span-2 py-2 text-center`}
										value={row.comments}
										onChange={(e) =>
											updateArrayItem(
												"topPosts",
												row.id,
												{ comments: e.target.value },
											)
										}
									/>
									<input
										className={`${inputClass} col-span-2 py-2 text-center`}
										value={row.shares}
										onChange={(e) =>
											updateArrayItem(
												"topPosts",
												row.id,
												{ shares: e.target.value },
											)
										}
									/>
									<button
										onClick={() =>
											removeArrayItem("topPosts", row.id)
										}
										className="col-span-1 text-slate-300 hover:text-error opacity-0 group-hover:opacity-100"
									>
										<TrashIcon size={14} />
									</button>
								</div>
							))}
							<button
								onClick={() => addArrayItem("topPosts")}
								className="btn btn-ghost btn-sm text-primary font-bold"
							>
								+ Add Post
							</button>
						</div>
					</div>
				)}

				{/* WEEKLY SALES REPORT */}
				{document.type === "weekly_sales_report" && (
					<div className="space-y-8">
						<SectionTitle
							title="Weekly Sales Analytics"
							icon={BarChart3Icon}
						/>
						<div className="space-y-4">
							<div className="grid grid-cols-12 gap-4 px-1 text-[10px] font-black uppercase text-slate-400">
								<div className="col-span-5">Metric</div>
								<div className="col-span-4">Amount</div>
								<div className="col-span-2">Delta</div>
							</div>
							{document.salesMetrics.map((row) => (
								<div
									key={row.id}
									className="grid grid-cols-12 gap-3 items-center group"
								>
									<input
										className={`${inputClass} col-span-5 py-2`}
										value={row.title}
										onChange={(e) =>
											updateArrayItem(
												"salesMetrics",
												row.id,
												{ title: e.target.value },
											)
										}
									/>
									<input
										className={`${inputClass} col-span-4 py-2`}
										value={row.money}
										onChange={(e) =>
											updateArrayItem(
												"salesMetrics",
												row.id,
												{ money: e.target.value },
											)
										}
									/>
									<input
										className={`${inputClass} col-span-2 py-2`}
										value={row.delta}
										onChange={(e) =>
											updateArrayItem(
												"salesMetrics",
												row.id,
												{ delta: e.target.value },
											)
										}
									/>
									<button
										onClick={() =>
											removeArrayItem(
												"salesMetrics",
												row.id,
											)
										}
										className="col-span-1 text-slate-300 hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
									>
										<TrashIcon size={14} />
									</button>
								</div>
							))}
							<button
								onClick={() => addArrayItem("salesMetrics")}
								className="btn btn-ghost btn-sm text-primary font-bold"
							>
								+ Add Metric
							</button>
						</div>

						<div className="form-control">
							<label className={labelClass}>Weekly Summary</label>
							<textarea
								className={`${inputClass} h-32`}
								value={document.aiIntro}
								onChange={(e) =>
									updateDocument({ aiIntro: e.target.value })
								}
							/>
						</div>

						<div className="space-y-4">
							<label className={labelClass}>Deal Breakdown</label>
							<div className="grid grid-cols-12 gap-4 px-1 text-[10px] font-black uppercase text-slate-400">
								<div className="col-span-5">Client</div>
								<div className="col-span-4">Value</div>
								<div className="col-span-2">Stage</div>
							</div>
							{document.dealBreakdown.map((row) => (
								<div
									key={row.id}
									className="grid grid-cols-12 gap-3 items-center group"
								>
									<input
										className={`${inputClass} col-span-5 py-2`}
										value={row.client}
										onChange={(e) =>
											updateArrayItem(
												"dealBreakdown",
												row.id,
												{ client: e.target.value },
											)
										}
									/>
									<input
										className={`${inputClass} col-span-4 py-2`}
										value={row.dealValue}
										onChange={(e) =>
											updateArrayItem(
												"dealBreakdown",
												row.id,
												{ dealValue: e.target.value },
											)
										}
									/>
									<input
										className={`${inputClass} col-span-2 py-2`}
										value={row.stage}
										onChange={(e) =>
											updateArrayItem(
												"dealBreakdown",
												row.id,
												{ stage: e.target.value },
											)
										}
									/>
									<button
										onClick={() =>
											removeArrayItem(
												"dealBreakdown",
												row.id,
											)
										}
										className="col-span-1 text-slate-300 hover:text-error opacity-0 group-hover:opacity-100"
									>
										<TrashIcon size={14} />
									</button>
								</div>
							))}
							<button
								onClick={() => addArrayItem("dealBreakdown")}
								className="btn btn-ghost btn-sm text-primary font-bold"
							>
								+ Add Deal
							</button>
						</div>
					</div>
				)}

				{/* INFLUENCER CAMPAIGN */}
				{document.type === "influencer_campaign" && (
					<div className="space-y-8">
						<SectionTitle
							title="Influencer Roster"
							icon={UsersIcon}
						/>
						<div className="form-control">
							<label className={labelClass}>
								Campaign Overview
							</label>
							<textarea
								className={`${inputClass} h-24`}
								value={document.campaignOverview}
								onChange={(e) =>
									updateDocument({
										campaignOverview: e.target.value,
									})
								}
							/>
						</div>

						<div className="space-y-6">
							<label className={labelClass}>
								Influencer List
							</label>
							{document.influencers.map((inf) => (
								<div
									key={inf.id}
									className="bg-white p-6 rounded-2xl border border-slate-300 space-y-4 group relative shadow-sm"
								>
									<div className="grid grid-cols-2 gap-4">
										<div className="form-control">
											<label className="text-[9px] font-bold text-slate-400 uppercase mb-1 px-1">
												Full Name
											</label>
											<input
												className={`${inputClass} py-2`}
												value={inf.name}
												onChange={(e) =>
													updateArrayItem(
														"influencers",
														inf.id,
														{
															name: e.target
																.value,
														},
													)
												}
											/>
										</div>
										<div className="form-control">
											<label className="text-[9px] font-bold text-slate-400 uppercase mb-1 px-1">
												Platform
											</label>
											<input
												className={`${inputClass} py-2`}
												value={inf.platform}
												onChange={(e) =>
													updateArrayItem(
														"influencers",
														inf.id,
														{
															platform:
																e.target.value,
														},
													)
												}
											/>
										</div>
									</div>
									<div className="grid grid-cols-3 gap-4">
										<div className="form-control">
											<label className="text-[9px] font-bold text-slate-400 uppercase mb-1 px-1">
												Followers
											</label>
											<input
												className={`${inputClass} py-2 text-xs`}
												value={inf.followers}
												onChange={(e) =>
													updateArrayItem(
														"influencers",
														inf.id,
														{
															followers:
																e.target.value,
														},
													)
												}
											/>
										</div>
										<div className="form-control">
											<label className="text-[9px] font-bold text-slate-400 uppercase mb-1 px-1">
												Rate
											</label>
											<input
												className={`${inputClass} py-2 text-xs`}
												value={inf.rate}
												onChange={(e) =>
													updateArrayItem(
														"influencers",
														inf.id,
														{
															rate: e.target
																.value,
														},
													)
												}
											/>
										</div>
										<div className="form-control">
											<label className="text-[9px] font-bold text-slate-400 uppercase mb-1 px-1">
												Status
											</label>
											<input
												className={`${inputClass} py-2 text-xs`}
												value={inf.status}
												onChange={(e) =>
													updateArrayItem(
														"influencers",
														inf.id,
														{
															status: e.target
																.value,
														},
													)
												}
											/>
										</div>
									</div>
									<button
										onClick={() =>
											removeArrayItem(
												"influencers",
												inf.id,
											)
										}
										className="absolute -right-3 -top-3 btn btn-circle btn-xs btn-error shadow-lg opacity-0 group-hover:opacity-100 transition-all"
									>
										✕
									</button>
								</div>
							))}
							<button
								onClick={() => addArrayItem("influencers")}
								className="btn btn-ghost btn-sm text-primary font-bold"
							>
								+ Add Influencer
							</button>
						</div>

						{/* INFLUENCER CAMPAIGN - KPI Section */}
						<div className="space-y-6 pt-6 border-t border-slate-100">
							<label className={labelClass}>Campaign KPIs</label>
							<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
								{[
									{ id: "views", label: "Views" },
									{ id: "engagement", label: "Engagement" },
									{ id: "clicks", label: "Clicks" },
									{ id: "conversions", label: "Conversions" },
									{ id: "roi", label: "ROI" },
								].map((kpi) => (
									<div key={kpi.id} className="form-control">
										<label className="text-[9px] font-bold text-slate-400 uppercase mb-1 px-1">
											{kpi.label}
										</label>
										<input
											className={`${inputClass} py-2 px-3 text-sm`}
											placeholder="0"
											value={
												(
													document.influencerKPIs as any
												)[kpi.id]
											}
											onChange={(e) =>
												updateDocument({
													influencerKPIs: {
														...document.influencerKPIs,
														[kpi.id]:
															e.target.value,
													},
												})
											}
										/>
									</div>
								))}
							</div>
						</div>
					</div>
				)}
			</div>

			{/* --- ACTION BAR --- */}
			<div className="fixed bottom-10 left-81.25 right-106.25 flex justify-center z-50 pointer-events-none">
				<div className="w-full max-w-xl pointer-events-auto">
					<button
						onClick={() => setIsGenerating(true)}
						className="btn btn-primary w-full h-16 rounded-2xl shadow-2xl shadow-primary/30 gap-4 text-lg font-black uppercase tracking-widest transition-transform hover:scale-[1.02] active:scale-[0.98]"
					>
						<SparklesIcon size={22} className="animate-pulse" />
						{isGenerating
							? "Synthesizing..."
							: `Generate ${document.type.replace(/_/g, " ")}`}
					</button>
				</div>
			</div>
		</div>
	);
};

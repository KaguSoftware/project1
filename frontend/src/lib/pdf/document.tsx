import { Document, Page, View, Text, pdf } from "@react-pdf/renderer";
import { styles, colors } from "./styles";
import type { DocumentData } from "@/src/store";

/* ────────────────────────────────────────────
   Helpers
   ──────────────────────────────────────────── */

const formatDate = () =>
	new Date().toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

const deltaStyle = (delta: string) =>
	delta.startsWith("-") ? styles.deltaNegative : styles.deltaPositive;

/* ────────────────────────────────────────────
   Header  (first page only — not fixed)
   ──────────────────────────────────────────── */

const Header = ({ data }: { data: DocumentData }) => (
	<View>
		<View style={styles.headerRow}>
			<View>
				<Text style={styles.docType}>
					{data.type.replace(/_/g, " ")}
				</Text>
				<Text style={styles.refLine}>
					Reference: {data.projectTitle || "Untitled Project"} {" \u2022 "}{" "}
					{formatDate()}
				</Text>
			</View>
			<View style={{ alignItems: "flex-end" }}>
				<View style={styles.brandBox}>
					<Text style={styles.brandText}>GENBUZZ</Text>
				</View>
				<Text style={styles.brandSub}>Official Document</Text>
			</View>
		</View>
		<View style={styles.dividerThick} />
	</View>
);

/* ────────────────────────────────────────────
   Client / Project Row
   ──────────────────────────────────────────── */

const ClientInfo = ({ data }: { data: DocumentData }) => (
	<View style={styles.clientRow}>
		<View>
			<Text style={styles.labelSmall}>Prepared For</Text>
			<Text style={styles.clientName}>
				{data.clientName || "Client Name"}
			</Text>
		</View>
		<View>
			<Text style={styles.projectTitle}>
				{data.projectTitle || "Project Description"}
			</Text>
		</View>
	</View>
);

/* ────────────────────────────────────────────
   Executive Summary
   ──────────────────────────────────────────── */

const ExecutiveSummary = ({ text }: { text: string }) => (
	<View style={styles.section}>
		<Text style={styles.sectionTitle}>Executive Summary</Text>
		<Text style={styles.summaryText}>{text}</Text>
	</View>
);

/* ────────────────────────────────────────────
   Engagement Overview  (stat boxes row)
   ──────────────────────────────────────────── */

const EngagementOverview = ({ data }: { data: DocumentData }) => {
	const items = [
		data.pricingPackage && { label: "Package", value: data.pricingPackage },
		data.timeline && { label: "Timeline", value: data.timeline },
		data.totalPrice && {
			label: "Total",
			value: `${data.defaultCurrency} ${data.totalPrice}`,
		},
		data.validUntil && { label: "Valid Until", value: data.validUntil },
	].filter(Boolean) as { label: string; value: string }[];

	if (items.length === 0) return null;

	return (
		<View style={styles.section} wrap={false}>
			<Text style={styles.sectionTitle}>Engagement Overview</Text>
			<View style={styles.statRow}>
				{items.map((stat, i) => (
					<View
						key={stat.label}
						style={
							i === items.length - 1
								? styles.statBoxLast
								: styles.statBox
						}
					>
						<Text style={styles.statLabel}>{stat.label}</Text>
						<Text style={styles.statValue}>{stat.value}</Text>
					</View>
				))}
			</View>
		</View>
	);
};

/* ────────────────────────────────────────────
   Scope / Body  (generic text section)
   ──────────────────────────────────────────── */

const TextSection = ({
	text,
	label,
}: {
	text: string;
	label: string;
}) => (
	<View style={styles.section}>
		<Text style={styles.sectionTitle}>{label}</Text>
		<Text style={styles.bodyText}>{text}</Text>
	</View>
);

/* ────────────────────────────────────────────
   Deliverables Table
   ──────────────────────────────────────────── */

const DeliverablesTable = ({
	rows,
}: {
	rows: DocumentData["deliverables"];
}) => {
	const filtered = rows.filter((d) => d.deliverable);
	if (filtered.length === 0) return null;

	return (
		<View style={styles.section}>
			<Text style={styles.sectionTitle}>Deliverables</Text>
			<View>
				<View style={styles.tableHeaderRow}>
					<Text style={[styles.tableHeaderCell, { flex: 3 }]}>
						Deliverable
					</Text>
					<Text style={[styles.tableHeaderCell, { flex: 2 }]}>
						Timeline
					</Text>
					<Text
						style={[
							styles.tableHeaderCell,
							{ flex: 1, textAlign: "right" },
						]}
					>
						Status
					</Text>
				</View>
				{filtered.map((item) => (
					<View key={item.id} style={styles.tableRow} wrap={false}>
						<Text style={[styles.tableCellBold, { flex: 3 }]}>
							{item.deliverable}
						</Text>
						<Text style={[styles.tableCell, { flex: 2 }]}>
							{item.timeline}
						</Text>
						<View style={{ flex: 1, alignItems: "flex-end" }}>
							<View style={styles.badge}>
								<Text style={styles.badgeText}>
									{item.status || "Pending"}
								</Text>
							</View>
						</View>
					</View>
				))}
			</View>
		</View>
	);
};

/* ────────────────────────────────────────────
   Terms & Conditions
   ──────────────────────────────────────────── */

const TermsList = ({
	terms,
	label,
}: {
	terms: DocumentData["termsAndConditions"];
	label?: string;
}) => {
	const filtered = terms.filter((t) => t.text);
	if (filtered.length === 0) return null;

	return (
		<View style={styles.section}>
			<Text style={styles.sectionTitle}>
				{label || "Terms & Conditions"}
			</Text>
			{filtered.map((clause, idx) => (
				<View key={clause.id} style={styles.termRow} wrap={false}>
					<View style={styles.termBadge}>
						<Text style={styles.termNumber}>{idx + 1}</Text>
					</View>
					<Text style={styles.termText}>{clause.text}</Text>
				</View>
			))}
		</View>
	);
};

/* ────────────────────────────────────────────
   Invoice Table
   ──────────────────────────────────────────── */

const InvoiceTable = ({ data }: { data: DocumentData }) => {
	const items = data.lineItems.filter((i) => i.description);
	if (items.length === 0) return null;

	const total = items.reduce((sum, i) => sum + i.qty * i.rate, 0);
	const cur = data.defaultCurrency || "USD";

	return (
		<View style={styles.section}>
			<Text style={styles.sectionTitle}>Billing Details</Text>
			<View>
				<View style={styles.tableHeaderRow}>
					<Text style={[styles.tableHeaderCell, { flex: 4 }]}>
						Description
					</Text>
					<Text
						style={[
							styles.tableHeaderCell,
							{ flex: 1, textAlign: "center" },
						]}
					>
						Qty
					</Text>
					<Text
						style={[
							styles.tableHeaderCell,
							{ flex: 1.5, textAlign: "right" },
						]}
					>
						Rate
					</Text>
					<Text
						style={[
							styles.tableHeaderCell,
							{ flex: 1.5, textAlign: "right" },
						]}
					>
						Total
					</Text>
				</View>

				{items.map((item) => (
					<View key={item.id} style={styles.tableRow} wrap={false}>
						<Text style={[styles.tableCellBold, { flex: 4 }]}>
							{item.description}
						</Text>
						<Text
							style={[
								styles.tableCell,
								{ flex: 1, textAlign: "center" },
							]}
						>
							{String(item.qty)}
						</Text>
						<Text
							style={[
								styles.tableCell,
								{ flex: 1.5, textAlign: "right" },
							]}
						>
							{cur} {item.rate.toLocaleString()}
						</Text>
						<Text
							style={[
								styles.tableCellBold,
								{ flex: 1.5, textAlign: "right" },
							]}
						>
							{cur} {(item.qty * item.rate).toLocaleString()}
						</Text>
					</View>
				))}

				<View style={styles.tableTotalRow}>
					<Text
						style={[
							styles.totalLabel,
							{
								flex: 6.5,
								textAlign: "right",
								paddingRight: 12,
							},
						]}
					>
						Total
					</Text>
					<Text
						style={[
							styles.totalValue,
							{ flex: 1.5, textAlign: "right" },
						]}
					>
						{cur} {total.toLocaleString()}
					</Text>
				</View>
			</View>
		</View>
	);
};

/* ────────────────────────────────────────────
   Performance Metrics  (social media)
   ──────────────────────────────────────────── */

const PerformanceMetrics = ({
	metrics,
}: {
	metrics: DocumentData["performanceMetrics"];
}) => {
	const filtered = metrics.filter((m) => m.metric);
	if (filtered.length === 0) return null;

	return (
		<View style={styles.section}>
			<Text style={styles.sectionTitle}>Metric Performance</Text>
			{filtered.map((m) => (
				<View key={m.id} style={styles.metricRow} wrap={false}>
					<Text style={styles.metricLabel}>{m.metric}</Text>
					<View style={{ alignItems: "flex-end" }}>
						<Text style={styles.metricValue}>{m.number}</Text>
						<Text style={deltaStyle(m.delta)}>{m.delta}</Text>
					</View>
				</View>
			))}
		</View>
	);
};

/* ────────────────────────────────────────────
   Top Posts Table  (social media)
   ──────────────────────────────────────────── */

const TopPostsTable = ({ posts }: { posts: DocumentData["topPosts"] }) => {
	const filtered = posts.filter((p) => p.post);
	if (filtered.length === 0) return null;

	return (
		<View style={styles.section}>
			<Text style={styles.sectionTitle}>Top Performing Posts</Text>
			<View>
				<View style={styles.tableHeaderRow}>
					<Text style={[styles.tableHeaderCell, { flex: 4 }]}>
						Post
					</Text>
					<Text
						style={[
							styles.tableHeaderCell,
							{ flex: 1, textAlign: "right" },
						]}
					>
						Likes
					</Text>
					<Text
						style={[
							styles.tableHeaderCell,
							{ flex: 1, textAlign: "right" },
						]}
					>
						Comments
					</Text>
					<Text
						style={[
							styles.tableHeaderCell,
							{ flex: 1, textAlign: "right" },
						]}
					>
						Shares
					</Text>
				</View>
				{filtered.map((post) => (
					<View key={post.id} style={styles.tableRow} wrap={false}>
						<Text style={[styles.tableCellBold, { flex: 4 }]}>
							{post.post}
						</Text>
						<Text
							style={[
								styles.tableCell,
								{ flex: 1, textAlign: "right" },
							]}
						>
							{post.likes}
						</Text>
						<Text
							style={[
								styles.tableCell,
								{ flex: 1, textAlign: "right" },
							]}
						>
							{post.comments}
						</Text>
						<Text
							style={[
								styles.tableCell,
								{ flex: 1, textAlign: "right" },
							]}
						>
							{post.shares}
						</Text>
					</View>
				))}
			</View>
		</View>
	);
};

/* ────────────────────────────────────────────
   Sales Metrics  (weekly sales report)
   ──────────────────────────────────────────── */

const SalesMetrics = ({
	metrics,
}: {
	metrics: DocumentData["salesMetrics"];
}) => {
	const filtered = metrics.filter((m) => m.title);
	if (filtered.length === 0) return null;

	return (
		<View style={styles.section} wrap={false}>
			<Text style={styles.sectionTitle}>Weekly Sales Metrics</Text>
			<View style={styles.statRow}>
				{filtered.map((m, i) => (
					<View
						key={m.id}
						style={
							i === filtered.length - 1
								? styles.statBoxLast
								: styles.statBox
						}
					>
						<Text style={styles.statLabel}>{m.title}</Text>
						<Text style={styles.statValue}>{m.money}</Text>
						<Text style={deltaStyle(m.delta)}>{m.delta}</Text>
					</View>
				))}
			</View>
		</View>
	);
};

/* ────────────────────────────────────────────
   Deal Breakdown Table  (weekly sales report)
   ──────────────────────────────────────────── */

const DealBreakdownTable = ({
	deals,
}: {
	deals: DocumentData["dealBreakdown"];
}) => {
	const filtered = deals.filter((d) => d.client);
	if (filtered.length === 0) return null;

	return (
		<View style={styles.section}>
			<Text style={styles.sectionTitle}>Deal Breakdown</Text>
			<View>
				<View style={styles.tableHeaderRow}>
					<Text style={[styles.tableHeaderCell, { flex: 3 }]}>
						Client
					</Text>
					<Text
						style={[
							styles.tableHeaderCell,
							{ flex: 2, textAlign: "right" },
						]}
					>
						Deal Value
					</Text>
					<Text
						style={[
							styles.tableHeaderCell,
							{ flex: 2, textAlign: "right" },
						]}
					>
						Stage
					</Text>
				</View>
				{filtered.map((deal) => (
					<View key={deal.id} style={styles.tableRow} wrap={false}>
						<Text style={[styles.tableCellBold, { flex: 3 }]}>
							{deal.client}
						</Text>
						<Text
							style={[
								styles.tableCell,
								{ flex: 2, textAlign: "right" },
							]}
						>
							{deal.dealValue}
						</Text>
						<View style={{ flex: 2, alignItems: "flex-end" }}>
							<View style={styles.badge}>
								<Text style={styles.badgeText}>
									{deal.stage}
								</Text>
							</View>
						</View>
					</View>
				))}
			</View>
		</View>
	);
};

/* ────────────────────────────────────────────
   KPI Grid  (influencer campaign)
   ──────────────────────────────────────────── */

const KPIGrid = ({ kpis }: { kpis: DocumentData["influencerKPIs"] }) => {
	const entries = [
		{ label: "Views", value: kpis.views },
		{ label: "Engagement", value: kpis.engagement },
		{ label: "Clicks", value: kpis.clicks },
		{ label: "Conversions", value: kpis.conversions },
		{ label: "ROI", value: kpis.roi },
	];

	return (
		<View style={styles.section} wrap={false}>
			<Text style={styles.sectionTitle}>Campaign Impact Score</Text>
			<View style={styles.statRow}>
				{entries.map((k, i) => (
					<View
						key={k.label}
						style={
							i === entries.length - 1
								? styles.statBoxLast
								: styles.statBox
						}
					>
						<Text style={styles.statLabel}>{k.label}</Text>
						<Text style={styles.statValue}>{k.value || "0"}</Text>
					</View>
				))}
			</View>
		</View>
	);
};

/* ────────────────────────────────────────────
   Influencer Roster Table
   ──────────────────────────────────────────── */

const InfluencerRoster = ({
	influencers,
}: {
	influencers: DocumentData["influencers"];
}) => {
	const filtered = influencers.filter((i) => i.name);
	if (filtered.length === 0) return null;

	return (
		<View style={styles.section}>
			<Text style={styles.sectionTitle}>Influencer Roster</Text>
			<View>
				<View style={styles.tableHeaderRow}>
					<Text style={[styles.tableHeaderCell, { flex: 2.5 }]}>
						Name
					</Text>
					<Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>
						Platform
					</Text>
					<Text
						style={[
							styles.tableHeaderCell,
							{ flex: 1, textAlign: "right" },
						]}
					>
						Followers
					</Text>
					<Text
						style={[
							styles.tableHeaderCell,
							{ flex: 1, textAlign: "right" },
						]}
					>
						Rate
					</Text>
					<Text
						style={[
							styles.tableHeaderCell,
							{ flex: 1, textAlign: "right" },
						]}
					>
						Status
					</Text>
				</View>
				{filtered.map((inf) => (
					<View key={inf.id} style={styles.tableRow} wrap={false}>
						<Text style={[styles.tableCellBold, { flex: 2.5 }]}>
							{inf.name}
						</Text>
						<Text style={[styles.tableCell, { flex: 1.5 }]}>
							{inf.platform}
						</Text>
						<Text
							style={[
								styles.tableCell,
								{ flex: 1, textAlign: "right" },
							]}
						>
							{inf.followers}
						</Text>
						<Text
							style={[
								styles.tableCell,
								{ flex: 1, textAlign: "right" },
							]}
						>
							{inf.rate}
						</Text>
						<View style={{ flex: 1, alignItems: "flex-end" }}>
							<View style={styles.badge}>
								<Text style={styles.badgeText}>
									{inf.status}
								</Text>
							</View>
						</View>
					</View>
				))}
			</View>
		</View>
	);
};

/* ────────────────────────────────────────────
   Page Footer  (fixed on every page)
   ──────────────────────────────────────────── */

const PageFooter = () => (
	<View style={styles.footer} fixed>
		<Text style={styles.footerTextItalic}>GENBUZZ INTERNAL SYSTEMS</Text>
		<Text
			style={styles.pageNumber}
			render={({ pageNumber, totalPages }) =>
				`${pageNumber} / ${totalPages}`
			}
		/>
		<Text style={styles.footerText}>
			Confidential {"\u2022"} {new Date().getFullYear()}
		</Text>
	</View>
);

/* ────────────────────────────────────────────
   Main PDF Document
   ──────────────────────────────────────────── */

export const PDFDocument = ({ data }: { data: DocumentData }) => (
	<Document
		title={`${data.type.replace(/_/g, " ")} - ${data.clientName || "Draft"}`}
		author="GENBUZZ"
		subject={data.projectTitle}
	>
		<Page size="A4" style={styles.page} wrap>
			<Header data={data} />
			<ClientInfo data={data} />

			{/* Executive Summary — any type that has it */}
			{data.aiIntro ? <ExecutiveSummary text={data.aiIntro} /> : null}

			{/* ── PROPOSAL / CONTRACT ────────────── */}
			{(data.type === "proposal" || data.type === "contract") && (
				<>
					<EngagementOverview data={data} />
					{data.type === "contract" && data.agreementOverview ? (
						<TextSection
							text={data.agreementOverview}
							label="Agreement Overview"
						/>
					) : null}
					{data.scopeOfWork ? (
						<TextSection
							text={data.scopeOfWork}
							label="Scope of Work"
						/>
					) : null}
					<DeliverablesTable rows={data.deliverables} />
				</>
			)}

			{/* Proposal terms */}
			{data.type === "proposal" && (
				<TermsList terms={data.termsAndConditions} />
			)}

			{/* ── INVOICE ───────────────────────── */}
			{data.type === "invoice" && (
				<>
					<InvoiceTable data={data} />
					<TermsList
						terms={data.termsAndConditions}
						label="Payment Terms"
					/>
				</>
			)}

			{/* ── LETTER ────────────────────────── */}
			{data.type === "letter" && data.body ? (
				<TextSection text={data.body} label="Message" />
			) : null}

			{/* ── SOCIAL MEDIA REPORT ───────────── */}
			{data.type === "social_media_report" && (
				<>
					<PerformanceMetrics metrics={data.performanceMetrics} />
					<TopPostsTable posts={data.topPosts} />
				</>
			)}

			{/* ── WEEKLY SALES REPORT ───────────── */}
			{data.type === "weekly_sales_report" && (
				<>
					<SalesMetrics metrics={data.salesMetrics} />
					{data.aiIntro ? null : null}
					<DealBreakdownTable deals={data.dealBreakdown} />
				</>
			)}

			{/* ── INFLUENCER CAMPAIGN ───────────── */}
			{data.type === "influencer_campaign" && (
				<>
					{data.campaignOverview ? (
						<TextSection
							text={data.campaignOverview}
							label="Campaign Overview"
						/>
					) : null}
					<KPIGrid kpis={data.influencerKPIs} />
					<InfluencerRoster influencers={data.influencers} />
				</>
			)}

			{/* Additional Notes — any type */}
			{data.additionalNotes ? (
				<TextSection
					text={data.additionalNotes}
					label="Additional Notes"
				/>
			) : null}

			<PageFooter />
		</Page>
	</Document>
);

/* ────────────────────────────────────────────
   Blob generator  (called from index.ts)
   ──────────────────────────────────────────── */

export async function generatePDFBlob(data: DocumentData): Promise<Blob> {
	return pdf(<PDFDocument data={data} />).toBlob();
}

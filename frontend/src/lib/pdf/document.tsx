import { Document, Page, pdf } from "@react-pdf/renderer";
import { styles } from "./styles";
import type { DocumentData } from "@/src/store";

import {
	Header,
	ClientInfo,
	ExecutiveSummary,
	TextSection,
	TermsList,
	PageFooter,
} from "./sections/common";
import { EngagementOverview, DeliverablesTable } from "./sections/proposal-contract";
import { InvoiceTable } from "./sections/invoice";
import { PerformanceMetrics, TopPostsTable } from "./sections/social-media";
import { SalesMetrics, DealBreakdownTable } from "./sections/sales";
import { KPIGrid, InfluencerRoster } from "./sections/influencer";

export const PDFDocument = ({ data }: { data: DocumentData }) => (
	<Document
		title={`${data.type.replace(/_/g, " ")} - ${data.clientName || "Draft"}`}
		author="GENBUZZ"
		subject={data.projectTitle}
	>
		<Page size="A4" style={styles.page} wrap>
			<Header data={data} />
			<ClientInfo data={data} />

			{data.aiIntro ? <ExecutiveSummary text={data.aiIntro} /> : null}

			{/* ── PROPOSAL / CONTRACT ── */}
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

			{data.type === "proposal" && (
				<TermsList terms={data.termsAndConditions} />
			)}

			{/* ── INVOICE ── */}
			{data.type === "invoice" && (
				<>
					<InvoiceTable data={data} />
					<TermsList
						terms={data.termsAndConditions}
						label="Payment Terms"
					/>
				</>
			)}

			{/* ── LETTER ── */}
			{data.type === "letter" && data.body ? (
				<TextSection text={data.body} label="Message" />
			) : null}

			{/* ── SOCIAL MEDIA REPORT ── */}
			{data.type === "social_media_report" && (
				<>
					<PerformanceMetrics metrics={data.performanceMetrics} />
					<TopPostsTable posts={data.topPosts} />
				</>
			)}

			{/* ── WEEKLY SALES REPORT ── */}
			{data.type === "weekly_sales_report" && (
				<>
					<SalesMetrics metrics={data.salesMetrics} />
					<DealBreakdownTable deals={data.dealBreakdown} />
				</>
			)}

			{/* ── INFLUENCER CAMPAIGN ── */}
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

export async function generatePDFBlob(data: DocumentData): Promise<Blob> {
	return pdf(<PDFDocument data={data} />).toBlob();
}

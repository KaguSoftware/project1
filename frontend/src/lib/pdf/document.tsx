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

type Lang = "en" | "ar";

export const PDFDocument = ({ data, lang = "en" }: { data: DocumentData; lang?: Lang }) => (
	<Document
		title={`${data.type.replace(/_/g, " ")} - ${data.clientName || "Draft"}`}
		author="GENBUZZ"
		subject={data.projectTitle}
	>
		<Page size="A4" style={styles.page} wrap>
			<Header data={data} lang={lang} />
			<ClientInfo data={data} lang={lang} />

			{data.aiIntro ? <ExecutiveSummary text={data.aiIntro} lang={lang} /> : null}

			{/* ── PROPOSAL / CONTRACT ── */}
			{(data.type === "proposal" || data.type === "contract") && (
				<>
					<EngagementOverview data={data} lang={lang} />
					{data.type === "contract" && data.agreementOverview ? (
						<TextSection
							text={data.agreementOverview}
							label="Agreement Overview"
							lang={lang}
						/>
					) : null}
					{data.scopeOfWork ? (
						<TextSection
							text={data.scopeOfWork}
							label="Scope of Work"
							lang={lang}
						/>
					) : null}
					<DeliverablesTable rows={data.deliverables} lang={lang} />
				</>
			)}

			{data.type === "proposal" && (
				<TermsList terms={data.termsAndConditions} lang={lang} />
			)}

			{/* ── INVOICE ── */}
			{data.type === "invoice" && (
				<>
					<InvoiceTable data={data} lang={lang} />
					<TermsList
						terms={data.termsAndConditions}
						label="Payment Terms"
						lang={lang}
					/>
				</>
			)}

			{/* ── LETTER ── */}
			{data.type === "letter" && data.body ? (
				<TextSection text={data.body} label="Message" lang={lang} />
			) : null}

			{/* ── SOCIAL MEDIA REPORT ── */}
			{data.type === "social_media_report" && (
				<>
					<PerformanceMetrics metrics={data.performanceMetrics} lang={lang} />
					<TopPostsTable posts={data.topPosts} lang={lang} />
				</>
			)}

			{/* ── WEEKLY SALES REPORT ── */}
			{data.type === "weekly_sales_report" && (
				<>
					<SalesMetrics metrics={data.salesMetrics} lang={lang} />
					<DealBreakdownTable deals={data.dealBreakdown} lang={lang} />
				</>
			)}

			{/* ── INFLUENCER CAMPAIGN ── */}
			{data.type === "influencer_campaign" && (
				<>
					{data.campaignOverview ? (
						<TextSection
							text={data.campaignOverview}
							label="Campaign Overview"
							lang={lang}
						/>
					) : null}
					<KPIGrid kpis={data.influencerKPIs} lang={lang} />
					<InfluencerRoster influencers={data.influencers} lang={lang} />
				</>
			)}

			{data.additionalNotes ? (
				<TextSection
					text={data.additionalNotes}
					label="Additional Notes"
					lang={lang}
				/>
			) : null}

			<PageFooter lang={lang} />
		</Page>
	</Document>
);

export async function generatePDFBlob(data: DocumentData, lang: Lang = "en"): Promise<Blob> {
	return pdf(<PDFDocument data={data} lang={lang} />).toBlob();
}

import { Document, Page, pdf } from "@react-pdf/renderer";
import { styles, ensureArabicFonts } from "./styles";
import type { DocumentData, CustomSection } from "@/src/store/types";
import { View } from "@react-pdf/renderer";

import {
    Header,
    ClientInfo,
    ExecutiveSummary,
    TextSection,
    TermsList,
    PageFooter,
} from "./sections/common";
import {
    EngagementOverview,
    DeliverablesTable,
} from "./sections/proposal-contract";
import { InvoiceTable } from "./sections/invoice";
import { PerformanceMetrics, TopPostsTable } from "./sections/social-media";
import { SalesMetrics, DealBreakdownTable } from "./sections/sales";
import { KPIGrid, InfluencerRoster } from "./sections/influencer";

type Lang = "en" | "ar";

export const PDFDocument = ({
    data,
    lang = "en",
}: {
    data: DocumentData;
    lang?: Lang;
}) => (
    <Document
        title={`${data.type.replace(/_/g, " ")} - ${
            data.clientName || "Draft"
        }`}
        author="GENBUZZ"
        subject={data.projectTitle}
    >
        <Page size="A4" style={styles.page} wrap>
            <Header data={data} lang={lang} />
            <ClientInfo data={data} lang={lang} />

            {data.aiIntro ? (
                <ExecutiveSummary text={data.aiIntro} lang={lang} />
            ) : (
                <View />
            )}

            {(data.type === "proposal" || data.type === "contract") && (
                <View>
                    <EngagementOverview data={data} lang={lang} />
                    {data.type === "contract" && data.agreementOverview ? (
                        <TextSection
                            text={data.agreementOverview}
                            label="Agreement Overview"
                            lang={lang}
                        />
                    ) : (
                        <View />
                    )}
                    {data.scopeOfWork ? (
                        <TextSection
                            text={data.scopeOfWork}
                            label="Scope of Work"
                            lang={lang}
                        />
                    ) : (
                        <View />
                    )}
                    <DeliverablesTable rows={data.deliverables} lang={lang} />
                </View>
            )}

            {data.type === "proposal" ? (
                <TermsList terms={data.termsAndConditions} lang={lang} />
            ) : (
                <View />
            )}

            {data.type === "invoice" && (
                <View>
                    <InvoiceTable data={data} lang={lang} />
                    <TermsList
                        terms={data.termsAndConditions}
                        label="Payment Terms"
                        lang={lang}
                    />
                </View>
            )}

            {data.type === "letter" && data.body ? (
                <TextSection text={data.body} label="Message" lang={lang} />
            ) : (
                <View />
            )}

            {data.type === "social_media_report" && (
                <View>
                    <PerformanceMetrics
                        metrics={data.performanceMetrics}
                        lang={lang}
                    />
                    <TopPostsTable posts={data.topPosts} lang={lang} />
                </View>
            )}

            {data.type === "weekly_sales_report" && (
                <View>
                    <SalesMetrics metrics={data.salesMetrics} lang={lang} />
                    <DealBreakdownTable
                        deals={data.dealBreakdown}
                        lang={lang}
                    />
                </View>
            )}

            {data.type === "influencer_campaign" && (
                <View>
                    {data.campaignOverview ? (
                        <TextSection
                            text={data.campaignOverview}
                            label="Campaign Overview"
                            lang={lang}
                        />
                    ) : (
                        <View />
                    )}
                    <KPIGrid kpis={data.influencerKPIs} lang={lang} />
                    <InfluencerRoster
                        influencers={data.influencers}
                        lang={lang}
                    />
                </View>
            )}

            {data.customSections?.map((section: CustomSection) => {
                if (section.type === "text" && section.content) {
                    return (
                        <TextSection
                            key={section.id}
                            text={section.content}
                            label={section.header}
                            lang={lang}
                        />
                    );
                }
                if (
                    section.type === "terms" &&
                    section.termsRows &&
                    section.termsRows.length > 0
                ) {
                    return (
                        <TermsList
                            key={section.id}
                            terms={section.termsRows}
                            label={section.header}
                            lang={lang}
                        />
                    );
                }
                if (
                    section.type === "deliverables" &&
                    section.deliverablesRows &&
                    section.deliverablesRows.length > 0
                ) {
                    return (
                        <DeliverablesTable
                            key={section.id}
                            rows={section.deliverablesRows}
                            lang={lang}
                        />
                    );
                }
                return <View key={section.id} />;
            })}

            {data.additionalNotes ? (
                <TextSection
                    text={data.additionalNotes}
                    label="Additional Notes"
                    lang={lang}
                />
            ) : (
                <View />
            )}

            <PageFooter lang={lang} />
        </Page>
    </Document>
);

export async function generatePDFBlob(
    data: DocumentData,
    lang: Lang = "en"
): Promise<Blob> {
    if (lang === "ar") await ensureArabicFonts();
    return pdf(<PDFDocument data={data} lang={lang} />).toBlob();
}

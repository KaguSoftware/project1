import { View, Text } from "@react-pdf/renderer";
import { styles, af, afB, rowDir } from "../styles";
import { deltaStyle, fixArabic } from "./common";
import { t } from "@/src/lib/translations";
import type { DocumentData } from "@/src/store";

type Lang = "en" | "ar";

export const SalesMetrics = ({
    metrics,
    lang = "en",
}: {
    metrics: DocumentData["salesMetrics"];
    lang?: Lang;
}) => {
    const filtered = metrics.filter((m) => m.title);
    if (filtered.length === 0) return <View />;

    return (
        <View style={styles.section} wrap={false}>
            <Text style={[styles.sectionTitle, af(lang)]}>
                {fixArabic(t("Sales Metrics", lang), lang)}
            </Text>
            <View style={[styles.statRow, rowDir(lang)]}>
                {filtered.map((m, i) => (
                    <View
                        key={m.id}
                        style={
                            i === filtered.length - 1
                                ? styles.statBoxLast
                                : styles.statBox
                        }
                    >
                        <Text style={[styles.statLabel, af(lang)]}>
                            {fixArabic(m.title, lang)}
                        </Text>
                        <Text style={[styles.statValue, afB(lang)]}>
                            {fixArabic(m.money, lang)}
                        </Text>
                        <Text style={deltaStyle(m.delta)}>{m.delta}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

export const DealBreakdownTable = ({
    deals,
    lang = "en",
}: {
    deals: DocumentData["dealBreakdown"];
    lang?: Lang;
}) => {
    const filtered = deals.filter((d) => d.client);
    if (filtered.length === 0) return <View />;

    return (
        <View style={styles.section}>
            <Text style={[styles.sectionTitle, af(lang)]}>
                {fixArabic(t("Deal Breakdown", lang), lang)}
            </Text>
            <View>
                <View style={[styles.tableHeaderRow, rowDir(lang)]}>
                    <Text
                        style={[styles.tableHeaderCell, { flex: 3 }, af(lang)]}
                    >
                        {fixArabic(t("Client", lang), lang)}
                    </Text>
                    <Text
                        style={[
                            styles.tableHeaderCell,
                            {
                                flex: 2,
                                textAlign: lang === "ar" ? "left" : "right",
                            },
                            af(lang),
                        ]}
                    >
                        {fixArabic(t("Deal Value", lang), lang)}
                    </Text>
                    <Text
                        style={[
                            styles.tableHeaderCell,
                            {
                                flex: 2,
                                textAlign: lang === "ar" ? "left" : "right",
                            },
                            af(lang),
                        ]}
                    >
                        {fixArabic(t("Stage", lang), lang)}
                    </Text>
                </View>
                {filtered.map((deal) => (
                    <View
                        key={deal.id}
                        style={[styles.tableRow, rowDir(lang)]}
                        wrap={false}
                    >
                        <Text
                            style={[
                                styles.tableCellBold,
                                { flex: 3 },
                                afB(lang),
                            ]}
                        >
                            {fixArabic(deal.client, lang)}
                        </Text>
                        <Text
                            style={[
                                styles.tableCell,
                                {
                                    flex: 2,
                                    textAlign: lang === "ar" ? "left" : "right",
                                },
                                af(lang),
                            ]}
                        >
                            {fixArabic(deal.dealValue, lang)}
                        </Text>
                        <View
                            style={{
                                flex: 2,
                                alignItems:
                                    lang === "ar" ? "flex-start" : "flex-end",
                            }}
                        >
                            <View style={styles.badge}>
                                <Text style={[styles.badgeText, af(lang)]}>
                                    {fixArabic(deal.stage, lang)}
                                </Text>
                            </View>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};

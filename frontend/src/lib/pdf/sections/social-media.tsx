import { View, Text } from "@react-pdf/renderer";
import { styles, af, afB, rowDir } from "../styles";
import { deltaStyle, fixArabic } from "./common";
import { t } from "@/src/lib/translations";
import type { DocumentData } from "@/src/store";

type Lang = "en" | "ar" | "tr";

export const PerformanceMetrics = ({
    metrics,
    lang = "en",
}: {
    metrics: DocumentData["performanceMetrics"];
    lang?: Lang;
}) => {
    const filtered = metrics.filter((m) => m.metric);
    if (filtered.length === 0) return <View />;

    return (
        <View style={styles.section}>
            <Text style={[styles.sectionTitle, af(lang)]}>
                {fixArabic(t("Performance Metrics", lang), lang)}
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {filtered.map((m) => (
                    <View
                        key={m.id}
                        wrap={false}
                        style={{
                            backgroundColor: "#f8fafc",
                            borderWidth: 0.5,
                            borderColor: "#e2e8f0",
                            borderRadius: 8,
                            paddingHorizontal: 12,
                            paddingVertical: 8,
                            minWidth: 90,
                        }}
                    >
                        <Text style={{ fontSize: 7, fontFamily: "Helvetica-Bold", color: "#94a3b8", textTransform: "uppercase", marginBottom: 3 }}>
                            {fixArabic(m.metric, lang)}
                        </Text>
                        <Text style={[styles.metricValue, afB(lang)]}>
                            {fixArabic(m.number, lang)}
                        </Text>
                        {m.delta ? <Text style={deltaStyle(m.delta)}>{m.delta}</Text> : null}
                    </View>
                ))}
            </View>
        </View>
    );
};

export const TopPostsTable = ({
    posts,
    lang = "en",
}: {
    posts: DocumentData["topPosts"];
    lang?: Lang;
}) => {
    const filtered = posts.filter((p) => p.post);
    if (filtered.length === 0) return <View />;

    return (
        <View style={styles.section}>
            <Text style={[styles.sectionTitle, af(lang)]}>
                {fixArabic(t("Top Posts", lang), lang)}
            </Text>
            <View>
                <View style={[styles.tableHeaderRow, rowDir(lang)]}>
                    <Text
                        style={[styles.tableHeaderCell, { flex: 4 }, af(lang)]}
                    >
                        {fixArabic(t("Post", lang), lang)}
                    </Text>
                    <Text
                        style={[
                            styles.tableHeaderCell,
                            {
                                flex: 1,
                                textAlign: lang === "ar" ? "left" : "right",
                            },
                            af(lang),
                        ]}
                    >
                        {fixArabic(t("Likes", lang), lang)}
                    </Text>
                    <Text
                        style={[
                            styles.tableHeaderCell,
                            {
                                flex: 1,
                                textAlign: lang === "ar" ? "left" : "right",
                            },
                            af(lang),
                        ]}
                    >
                        {fixArabic(t("Comments", lang), lang)}
                    </Text>
                    <Text
                        style={[
                            styles.tableHeaderCell,
                            {
                                flex: 1,
                                textAlign: lang === "ar" ? "left" : "right",
                            },
                            af(lang),
                        ]}
                    >
                        {fixArabic(t("Shares", lang), lang)}
                    </Text>
                </View>
                {filtered.map((post) => (
                    <View
                        key={post.id}
                        style={[styles.tableRow, rowDir(lang)]}
                        wrap={false}
                    >
                        <Text
                            style={[
                                styles.tableCellBold,
                                { flex: 4 },
                                afB(lang),
                            ]}
                        >
                            {fixArabic(post.post, lang)}
                        </Text>
                        <Text
                            style={[
                                styles.tableCell,
                                {
                                    flex: 1,
                                    textAlign: lang === "ar" ? "left" : "right",
                                },
                                af(lang),
                            ]}
                        >
                            {fixArabic(post.likes, lang)}
                        </Text>
                        <Text
                            style={[
                                styles.tableCell,
                                {
                                    flex: 1,
                                    textAlign: lang === "ar" ? "left" : "right",
                                },
                                af(lang),
                            ]}
                        >
                            {fixArabic(post.comments, lang)}
                        </Text>
                        <Text
                            style={[
                                styles.tableCell,
                                {
                                    flex: 1,
                                    textAlign: lang === "ar" ? "left" : "right",
                                },
                                af(lang),
                            ]}
                        >
                            {fixArabic(post.shares, lang)}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

const impactDotColor = (impact: string) =>
    impact === "positive" ? "#10b981" : impact === "negative" ? "#ef4444" : "#94a3b8";

const impactBadgeColors = (impact: string): { bg: string; text: string } =>
    impact === "positive"
        ? { bg: "#d1fae5", text: "#065f46" }
        : impact === "negative"
        ? { bg: "#fee2e2", text: "#991b1b" }
        : { bg: "#f1f5f9", text: "#64748b" };

export const KeyInsightsPDF = ({
    insights,
    lang = "en",
}: {
    insights: DocumentData["keyInsights"];
    lang?: Lang;
}) => {
    const filtered = insights?.filter((k) => k.insight) ?? [];
    if (filtered.length === 0) return <View />;

    return (
        <View style={styles.section}>
            <Text style={[styles.sectionTitle, af(lang)]}>
                {fixArabic(t("Key Insights", lang), lang)}
            </Text>
            <View style={{ gap: 6 }}>
                {filtered.map((k) => {
                    const badge = impactBadgeColors(k.impact);
                    return (
                        <View
                            key={k.id}
                            wrap={false}
                            style={{ flexDirection: "row", alignItems: "flex-start", gap: 8 }}
                        >
                            <View
                                style={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: 3,
                                    backgroundColor: impactDotColor(k.impact),
                                    marginTop: 3,
                                    flexShrink: 0,
                                }}
                            />
                            <Text style={[{ flex: 1, fontSize: 8, color: "#334155" }, af(lang)]}>
                                {fixArabic(k.insight, lang)}
                            </Text>
                            <View
                                style={{
                                    backgroundColor: badge.bg,
                                    borderRadius: 4,
                                    paddingHorizontal: 5,
                                    paddingVertical: 2,
                                    flexShrink: 0,
                                }}
                            >
                                <Text style={{ fontSize: 6, color: badge.text, fontFamily: "Helvetica-Bold", textTransform: "uppercase" }}>
                                    {k.impact}
                                </Text>
                            </View>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

export const TopPerformingContentPDF = ({
    content,
    lang = "en",
}: {
    content: DocumentData["topPerformingContent"];
    lang?: Lang;
}) => {
    const filtered = content?.filter((c) => c.title) ?? [];
    if (filtered.length === 0) return <View />;

    return (
        <View style={styles.section}>
            <Text style={[styles.sectionTitle, af(lang)]}>
                {fixArabic(t("Top Performing Content", lang), lang)}
            </Text>
            <View>
                <View style={[styles.tableHeaderRow, rowDir(lang)]}>
                    <Text style={[styles.tableHeaderCell, { flex: 3 }, af(lang)]}>
                        {fixArabic(t("Content", lang), lang)}
                    </Text>
                    <Text style={[styles.tableHeaderCell, { flex: 2 }, af(lang)]}>
                        {fixArabic(t("Metric", lang), lang)}
                    </Text>
                    <Text style={[styles.tableHeaderCell, { flex: 1, textAlign: lang === "ar" ? "left" : "right" }, af(lang)]}>
                        {fixArabic(t("Value", lang), lang)}
                    </Text>
                    <Text style={[styles.tableHeaderCell, { flex: 3 }, af(lang)]}>
                        {fixArabic(t("Note", lang), lang)}
                    </Text>
                </View>
                {filtered.map((c) => (
                    <View key={c.id} style={[styles.tableRow, rowDir(lang)]} wrap={false}>
                        <Text style={[styles.tableCellBold, { flex: 3 }, afB(lang)]}>
                            {fixArabic(c.title, lang)}
                        </Text>
                        <Text style={[styles.tableCell, { flex: 2 }, af(lang)]}>
                            {fixArabic(c.metric, lang)}
                        </Text>
                        <Text style={[styles.tableCell, { flex: 1, textAlign: lang === "ar" ? "left" : "right" }, af(lang)]}>
                            {fixArabic(c.value, lang)}
                        </Text>
                        <Text style={[styles.tableCell, { flex: 3 }, af(lang)]}>
                            {fixArabic(c.note, lang)}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

export const AudienceInsightsPDF = ({
    insights,
    lang = "en",
}: {
    insights: DocumentData["audienceInsights"];
    lang?: Lang;
}) => {
    const filtered = insights?.filter((a) => a.label) ?? [];
    if (filtered.length === 0) return <View />;

    return (
        <View style={styles.section}>
            <Text style={[styles.sectionTitle, af(lang)]}>
                {fixArabic(t("Audience Insights", lang), lang)}
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {filtered.map((a) => (
                    <View
                        key={a.id}
                        wrap={false}
                        style={{
                            backgroundColor: "#f8fafc",
                            borderWidth: 0.5,
                            borderColor: "#e2e8f0",
                            borderRadius: 8,
                            paddingHorizontal: 12,
                            paddingVertical: 8,
                            minWidth: 90,
                        }}
                    >
                        <Text style={{ fontSize: 7, fontFamily: "Helvetica-Bold", color: "#94a3b8", textTransform: "uppercase", marginBottom: 3 }}>
                            {fixArabic(a.label, lang)}
                        </Text>
                        <Text style={[styles.metricValue, afB(lang)]}>
                            {fixArabic(a.value, lang)}
                        </Text>
                        {a.detail ? (
                            <Text style={[{ fontSize: 7, color: "#64748b", marginTop: 2 }, af(lang)]}>
                                {fixArabic(a.detail, lang)}
                            </Text>
                        ) : null}
                    </View>
                ))}
            </View>
        </View>
    );
};

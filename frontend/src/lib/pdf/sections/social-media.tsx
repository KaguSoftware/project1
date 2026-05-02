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

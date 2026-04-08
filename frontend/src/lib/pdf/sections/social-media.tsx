import { View, Text } from "@react-pdf/renderer";
import { styles, af, afB, rowDir } from "../styles";
import { deltaStyle, fixArabic } from "./common";
import { t } from "@/src/lib/translations";
import type { DocumentData } from "@/src/store";

type Lang = "en" | "ar";

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
            {filtered.map((m) => (
                <View
                    key={m.id}
                    style={[styles.metricRow, rowDir(lang)]}
                    wrap={false}
                >
                    <Text style={[styles.metricLabel, afB(lang)]}>
                        {fixArabic(m.metric, lang)}
                    </Text>
                    <View
                        style={{
                            alignItems:
                                lang === "ar" ? "flex-start" : "flex-end",
                        }}
                    >
                        <Text style={[styles.metricValue, afB(lang)]}>
                            {fixArabic(m.number, lang)}
                        </Text>
                        <Text style={deltaStyle(m.delta)}>{m.delta}</Text>
                    </View>
                </View>
            ))}
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

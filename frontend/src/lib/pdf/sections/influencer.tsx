import { View, Text } from "@react-pdf/renderer";
import { styles, af, afB, rowDir } from "../styles";
import { fixArabic } from "./common";
import { t } from "@/src/lib/translations";
import type { DocumentData } from "@/src/store";

type Lang = "en" | "ar";

export const KPIGrid = ({
    kpis,
    lang = "en",
}: {
    kpis: DocumentData["influencerKPIs"];
    lang?: Lang;
}) => {
    const entries = [
        { label: t("Views", lang), value: kpis.views },
        { label: t("Engagement", lang), value: kpis.engagement },
        { label: t("Clicks", lang), value: kpis.clicks },
        { label: t("Conversions", lang), value: kpis.conversions },
        { label: t("ROI", lang), value: kpis.roi },
    ];

    return (
        <View style={styles.section} wrap={false}>
            <Text style={[styles.sectionTitle, af(lang)]}>
                {fixArabic(t("Campaign KPIs", lang), lang)}
            </Text>
            <View style={[styles.statRow, rowDir(lang)]}>
                {entries.map((k, i) => (
                    <View
                        key={k.label}
                        style={
                            i === entries.length - 1
                                ? styles.statBoxLast
                                : styles.statBox
                        }
                    >
                        <Text style={[styles.statLabel, af(lang)]}>
                            {fixArabic(k.label, lang)}
                        </Text>
                        <Text style={[styles.statValue, afB(lang)]}>
                            {fixArabic(k.value || "0", lang)}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

export const InfluencerRoster = ({
    influencers,
    lang = "en",
}: {
    influencers: DocumentData["influencers"];
    lang?: Lang;
}) => {
    const filtered = influencers.filter((i) => i.name);
    if (filtered.length === 0) return <View />;

    return (
        <View style={styles.section}>
            <Text style={[styles.sectionTitle, af(lang)]}>
                {fixArabic(t("Influencer Roster", lang), lang)}
            </Text>
            <View>
                <View style={[styles.tableHeaderRow, rowDir(lang)]}>
                    <Text
                        style={[
                            styles.tableHeaderCell,
                            { flex: 2.5 },
                            af(lang),
                        ]}
                    >
                        {fixArabic(t("Name", lang), lang)}
                    </Text>
                    <Text
                        style={[
                            styles.tableHeaderCell,
                            { flex: 1.5 },
                            af(lang),
                        ]}
                    >
                        {fixArabic(t("Platform", lang), lang)}
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
                        {fixArabic(t("Followers", lang), lang)}
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
                        {fixArabic(t("Fee", lang), lang)}
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
                        {fixArabic(t("Status", lang), lang)}
                    </Text>
                </View>
                {filtered.map((inf) => (
                    <View
                        key={inf.id}
                        style={[styles.tableRow, rowDir(lang)]}
                        wrap={false}
                    >
                        <Text
                            style={[
                                styles.tableCellBold,
                                { flex: 2.5 },
                                afB(lang),
                            ]}
                        >
                            {fixArabic(inf.name, lang)}
                        </Text>
                        <Text
                            style={[styles.tableCell, { flex: 1.5 }, af(lang)]}
                        >
                            {fixArabic(inf.platform, lang)}
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
                            {fixArabic(inf.followers, lang)}
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
                            {fixArabic(inf.rate, lang)}
                        </Text>
                        <View
                            style={{
                                flex: 1,
                                alignItems:
                                    lang === "ar" ? "flex-start" : "flex-end",
                            }}
                        >
                            <View style={styles.badge}>
                                <Text style={[styles.badgeText, af(lang)]}>
                                    {fixArabic(inf.status, lang)}
                                </Text>
                            </View>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};

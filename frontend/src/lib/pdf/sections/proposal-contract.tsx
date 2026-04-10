import { View, Text } from "@react-pdf/renderer";
import { styles, colors, af, afB, rowDir } from "../styles";
import { t } from "@/src/lib/translations";
import { fixArabic } from "./common";
import type { DocumentData } from "@/src/store";

type Lang = "en" | "ar" | "tr";

export const EngagementOverview = ({
    data,
    lang = "en",
}: {
    data: DocumentData;
    lang?: Lang;
}) => {
    const tiers = data.pricingTiers ?? [];
    const hasAnyTierData = tiers.some((t) => t.price || t.description || t.name);
    const hasOverviewData = data.timeline || data.totalPrice || data.validUntil;

    if (!hasAnyTierData && !hasOverviewData) return <View />;

    return (
        <View style={styles.section} wrap={false}>
            <Text style={[styles.sectionTitle, af(lang)]}>
                {fixArabic(t("Engagement Overview", lang), lang)}
            </Text>

            {/* Pricing tier cards — mirrors the preview layout */}
            {tiers.length > 0 && hasAnyTierData && (
                <View style={{ flexDirection: lang === "ar" ? "row-reverse" : "row", marginBottom: hasOverviewData ? 10 : 0 }}>
                    {tiers.filter(tier => tier.name || tier.price || tier.description).map((tier, i) => {
                        const isPopular = tier.isPopular;
                        const isLast = i === tiers.length - 1;
                        const descLines = tier.description
                            ? tier.description.split(/[,،\n]+/).map((s) => s.trim()).filter(Boolean)
                            : [];
                        return (
                            <View
                                key={tier.id}
                                style={{
                                    flex: 1,
                                    borderRadius: 10,
                                    backgroundColor: isPopular ? "#eef2ff" : colors.slate50,
                                    marginRight: isLast ? 0 : 8,
                                }}
                            >
                                {/* Popular badge — in normal flow at top, no absolute */}
                                {isPopular ? (
                                    <View style={{ alignItems: lang === "ar" ? "flex-start" : "flex-end" }}>
                                        <View style={{
                                            backgroundColor: colors.indigo500,
                                            paddingHorizontal: 8,
                                            paddingVertical: 4,
                                            borderBottomLeftRadius: lang === "ar" ? 0 : 7,
                                            borderBottomRightRadius: lang === "ar" ? 7 : 0,
                                            borderTopRightRadius: 8,
                                            borderTopLeftRadius: lang === "ar" ? 8 : 0,
                                        }}>
                                            <Text style={[{ fontSize: 6, fontFamily: "Helvetica-Bold", color: colors.white, textTransform: "uppercase", letterSpacing: 1 }, af(lang)]}>
                                                {fixArabic(t("Popular", lang), lang)}
                                            </Text>
                                        </View>
                                    </View>
                                ) : null}

                                {/* Card content with padding */}
                                <View style={{ padding: 10 }}>
                                    {/* Name */}
                                    <View style={{ backgroundColor: colors.white, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 7, alignItems: "center", marginBottom: 7 }}>
                                        <Text style={[{ fontSize: 11, fontFamily: "Helvetica-Bold", color: isPopular ? colors.indigo500 : colors.slate700 }, af(lang)]}>
                                            {fixArabic(t(tier.name, lang), lang)}
                                        </Text>
                                    </View>
                                    {/* Price */}
                                    {tier.price ? (
                                        <View style={{ backgroundColor: colors.white, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 7, alignItems: "center", marginBottom: 7 }}>
                                            <Text style={[{ fontSize: 11, fontFamily: "Helvetica-Bold", color: colors.slate900 }, afB(lang)]}>
                                                {fixArabic(`${data.defaultCurrency} ${tier.price}`, lang)}
                                            </Text>
                                        </View>
                                    ) : null}
                                    {/* Description with dot bullets (tick char unreliable in PDF fonts) */}
                                    {descLines.length > 0 ? (
                                        <View style={{ backgroundColor: colors.white, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 8 }}>
                                            {descLines.map((line, idx) => (
                                                <View key={idx} style={{ flexDirection: lang === "ar" ? "row-reverse" : "row", alignItems: "center", marginBottom: idx < descLines.length - 1 ? 5 : 0 }}>
                                                    <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: colors.emerald500, marginRight: lang === "ar" ? 0 : 6, marginLeft: lang === "ar" ? 6 : 0, marginTop: 1 }} />
                                                    <Text style={[{ fontSize: 8, color: colors.slate600, lineHeight: 1.4, flex: 1 }, af(lang)]}>
                                                        {fixArabic(t(line, lang), lang)}
                                                    </Text>
                                                </View>
                                            ))}
                                        </View>
                                    ) : tier.description ? (
                                        <View style={{ backgroundColor: colors.white, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 8 }}>
                                            <Text style={[{ fontSize: 8, color: colors.slate600, lineHeight: 1.4, textAlign: "center" }, af(lang)]}>
                                                {fixArabic(t(tier.description, lang), lang)}
                                            </Text>
                                        </View>
                                    ) : null}
                                </View>
                            </View>
                        );
                    })}
                </View>
            )}

            {/* Timeline / Total / Valid Until */}
            {hasOverviewData && (
                <View style={[styles.statRow, rowDir(lang)]}>
                    {[
                        data.timeline && { label: t("Timeline", lang), value: data.timeline },
                        data.totalPrice && { label: t("Total", lang), value: `${data.defaultCurrency} ${data.totalPrice}` },
                        data.validUntil && { label: t("Valid Until", lang), value: data.validUntil },
                    ].filter(Boolean).map((stat: any, i, arr) => (
                        <View key={stat.label} style={i === arr.length - 1 ? styles.statBoxLast : styles.statBox}>
                            <Text style={[styles.statLabel, af(lang)]}>{fixArabic(stat.label, lang)}</Text>
                            <Text style={[styles.statValue, afB(lang)]}>{fixArabic(stat.value, lang)}</Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
};

export const DeliverablesTable = ({
    rows,
    lang = "en",
}: {
    rows: DocumentData["deliverables"];
    lang?: Lang;
}) => {
    const filtered = rows.filter((d) => d.deliverable);
    if (filtered.length === 0) return <View />;

    const isRtl = lang === "ar";
    const dir = isRtl ? "row-reverse" : "row";

    return (
        <View style={styles.section}>
            <Text style={[styles.sectionTitle, af(lang), { color: colors.indigo500 }]}>
                {fixArabic(t("Deliverables", lang), lang)}
            </Text>
            <View style={{ borderWidth: 0.5, borderColor: colors.slate200, borderRadius: 8, overflow: "hidden" }}>
                {/* Header row */}
                <View style={{ flexDirection: dir, backgroundColor: colors.slate50, borderBottomWidth: 0.5, borderBottomColor: colors.slate200, paddingHorizontal: 12, paddingVertical: 7 }}>
                    <Text style={{ width: 20, fontSize: 6.5, fontFamily: "Helvetica-Bold", color: colors.slate400, textTransform: "uppercase", letterSpacing: 1 }}>#</Text>
                    <Text style={[{ flex: 1, fontSize: 6.5, fontFamily: "Helvetica-Bold", color: colors.slate400, textTransform: "uppercase", letterSpacing: 1 }, af(lang)]}>
                        {fixArabic(t("Deliverable", lang), lang)}
                    </Text>
                    <Text style={[{ width: 55, fontSize: 6.5, fontFamily: "Helvetica-Bold", color: colors.slate400, textTransform: "uppercase", letterSpacing: 1 }, af(lang)]}>
                        {fixArabic(t("Status", lang), lang)}
                    </Text>
                </View>
                {/* Data rows */}
                {filtered.map((item, idx) => (
                    <View
                        key={item.id}
                        style={{
                            flexDirection: dir,
                            alignItems: "center",
                            paddingHorizontal: 12,
                            paddingVertical: 9,
                            borderBottomWidth: idx < filtered.length - 1 ? 0.5 : 0,
                            borderBottomColor: colors.slate100,
                        }}
                        wrap={false}
                    >
                        <Text style={{ width: 20, fontSize: 8, fontFamily: "Helvetica-Bold", color: colors.slate300 }}>
                            {idx + 1}
                        </Text>
                        <Text style={[{ flex: 1, fontSize: 9, fontFamily: "Helvetica-Bold", color: colors.slate800, paddingRight: isRtl ? 0 : 8, paddingLeft: isRtl ? 8 : 0 }, afB(lang)]}>
                            {fixArabic(item.deliverable, lang)}
                        </Text>
                        <View style={{ width: 55 }}>
                            <View style={{ backgroundColor: colors.indigo100, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, alignSelf: isRtl ? "flex-end" : "flex-start" }}>
                                <Text style={[{ fontSize: 6.5, fontFamily: "Helvetica-Bold", textTransform: "uppercase", color: colors.indigo500 }, af(lang)]}>
                                    {fixArabic(item.status || t("Pending", lang), lang)}
                                </Text>
                            </View>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};

import { View, Text } from "@react-pdf/renderer";
import { styles, colors, af, afB, rowDir } from "../styles";
import { t } from "@/src/lib/translations";
import { fixArabic } from "./common";
import type { DocumentData } from "@/src/store";

type Lang = "en" | "ar";

export const EngagementOverview = ({
    data,
    lang = "en",
}: {
    data: DocumentData;
    lang?: Lang;
}) => {
    const selectedTierName =
        data.pricingTiers?.find(
            (t) =>
                t.name.toLowerCase() ===
                (data.pricingPackage || "").toLowerCase()
        )?.name ?? data.pricingPackage;

    const items = [
        data.pricingPackage && {
            label: t("Package", lang),
            value: selectedTierName,
        },
        data.timeline && { label: t("Timeline", lang), value: data.timeline },
        data.totalPrice && {
            label: t("Total", lang),
            value: `${data.defaultCurrency} ${data.totalPrice}`,
        },
        data.validUntil && {
            label: t("Valid Until", lang),
            value: data.validUntil,
        },
    ].filter(Boolean) as { label: string; value: string }[];

    if (items.length === 0) return <View />;

    return (
        <View style={styles.section} wrap={false}>
            <Text style={[styles.sectionTitle, af(lang)]}>
                {fixArabic(t("Engagement Overview", lang), lang)}
            </Text>
            <View style={[styles.statRow, rowDir(lang)]}>
                {items.map((stat, i) => (
                    <View
                        key={stat.label}
                        style={
                            i === items.length - 1
                                ? styles.statBoxLast
                                : styles.statBox
                        }
                    >
                        <Text style={[styles.statLabel, af(lang)]}>
                            {fixArabic(stat.label, lang)}
                        </Text>
                        <Text style={[styles.statValue, afB(lang)]}>
                            {fixArabic(stat.value, lang)}
                        </Text>
                    </View>
                ))}
            </View>
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

    return (
        <View style={styles.section}>
            <Text
                style={[
                    styles.sectionTitle,
                    af(lang),
                    { color: colors.indigo500 },
                ]}
            >
                {fixArabic(t("Deliverables", lang), lang)}
            </Text>
            <View
                style={{
                    borderWidth: 0.5,
                    borderColor: colors.slate200,
                    borderRadius: 8,
                    overflow: "hidden",
                }}
            >
                {filtered.map((item, idx) => (
                    <View
                        key={item.id}
                        style={[
                            {
                                flexDirection:
                                    lang === "ar" ? "row-reverse" : "row",
                                alignItems: "flex-start",
                                paddingHorizontal: 12,
                                paddingVertical: 10,
                                borderBottomWidth:
                                    idx < filtered.length - 1 ? 0.5 : 0,
                                borderBottomColor: colors.slate100,
                                gap: 10,
                            },
                        ]}
                        wrap={false}
                    >
                        <View
                            style={{
                                width: 18,
                                height: 18,
                                borderRadius: 9,
                                backgroundColor: colors.indigo100,
                                borderWidth: 0.5,
                                borderColor: colors.indigo200,
                                alignItems: "center",
                                justifyContent: "center",
                                marginTop: 1,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 7,
                                    fontFamily: "Helvetica-Bold",
                                    color: colors.indigo500,
                                }}
                            >
                                {idx + 1}
                            </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text
                                style={[
                                    styles.tableCellBold,
                                    { marginBottom: 4 },
                                    afB(lang),
                                ]}
                            >
                                {fixArabic(item.deliverable, lang)}
                            </Text>
                            <View
                                style={{
                                    flexDirection:
                                        lang === "ar" ? "row-reverse" : "row",
                                    gap: 14,
                                }}
                            >
                                {item.timeline ? (
                                    <View
                                        style={{
                                            flexDirection:
                                                lang === "ar"
                                                    ? "row-reverse"
                                                    : "row",
                                            gap: 3,
                                            alignItems: "center",
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 6.5,
                                                fontFamily: "Helvetica-Bold",
                                                textTransform: "uppercase",
                                                letterSpacing: 0.5,
                                                color: colors.amber500,
                                            }}
                                        >
                                            {fixArabic(
                                                t("Timeline", lang),
                                                lang
                                            )}
                                        </Text>
                                        <Text
                                            style={[
                                                {
                                                    fontSize: 8,
                                                    color: colors.slate500,
                                                },
                                                af(lang),
                                            ]}
                                        >
                                            {fixArabic(item.timeline, lang)}
                                        </Text>
                                    </View>
                                ) : null}
                                <View
                                    style={{
                                        flexDirection:
                                            lang === "ar"
                                                ? "row-reverse"
                                                : "row",
                                        gap: 3,
                                        alignItems: "center",
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 6.5,
                                            fontFamily: "Helvetica-Bold",
                                            textTransform: "uppercase",
                                            letterSpacing: 0.5,
                                            color: colors.emerald600,
                                        }}
                                    >
                                        {fixArabic(t("Status", lang), lang)}
                                    </Text>
                                    <View
                                        style={{
                                            backgroundColor: colors.emerald50,
                                            borderWidth: 0.5,
                                            borderColor: colors.emerald100,
                                            borderRadius: 8,
                                            paddingHorizontal: 6,
                                            paddingVertical: 1,
                                        }}
                                    >
                                        <Text
                                            style={[
                                                {
                                                    fontSize: 7,
                                                    fontFamily:
                                                        "Helvetica-Bold",
                                                    textTransform: "uppercase",
                                                    color: colors.emerald600,
                                                },
                                                af(lang),
                                            ]}
                                        >
                                            {fixArabic(
                                                item.status ||
                                                    t("Pending", lang),
                                                lang
                                            )}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};

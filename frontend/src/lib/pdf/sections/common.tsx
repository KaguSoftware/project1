import { View, Text, Image } from "@react-pdf/renderer";
import { styles, colors, af, afB, rowDir } from "../styles";
import { t } from "@/src/lib/translations";
import type { DocumentData } from "@/src/store/types";
import * as arabicReshaper from "arabic-reshaper";

const LOGO_URL =
    typeof window !== "undefined"
        ? `${window.location.origin}/logo-main-genbuzz.png`
        : "/logo-main-genbuzz.png";

type Lang = "en" | "ar" | "tr";

/** * Fixes Arabic rendering for react-pdf by:
 * 1. Reshaping (joining letters)
 * 2. Adding a hair space (\u200A) to prevent final dot-shift
 * 3. Reversing (fixing visual order)
 */
export const fixArabic = (text: string | undefined, lang: Lang) => {
    if (!text || lang !== "ar") return text || "";

    const reshaper = (arabicReshaper as any).default || arabicReshaper;

    if (typeof reshaper.reshape !== "function") {
        return text;
    }

    const reshaped = reshaper.reshape(text);

    // Hair Space (\u200A) provides an invisible safety buffer
    return (reshaped + "\u200A").split("").reverse().join("");
};

export const formatDate = () =>
    new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

export const deltaStyle = (delta: string) =>
    delta.startsWith("-") ? styles.deltaNegative : styles.deltaPositive;

export const Header = ({
    data,
    lang = "en",
}: {
    data: DocumentData;
    lang?: Lang;
}) => (
    <View>
        <View style={[styles.headerRow, rowDir(lang)]}>
            <View>
                <Text style={[styles.docType, af(lang)]}>
                    {fixArabic(t(data.type.replace(/_/g, " "), lang), lang)}
                </Text>
                <Text style={[styles.refLine, af(lang)]}>
                    {fixArabic(
                        `${t("Reference", lang)}: ${
                            data.projectTitle || t("Untitled Project", lang)
                        }`,
                        lang
                    )}
                    {" \u2022 "} {formatDate()}
                </Text>
            </View>
            <View
                style={{
                    alignItems: lang === "ar" ? "flex-start" : "flex-end",
                }}
            >
                <Image
                    src={LOGO_URL}
                    style={{ width: 100, height: 30, objectFit: "contain", marginBottom: 4 }}
                />
                <Text
                    style={[
                        styles.brandSub,
                        af(lang),
                        lang === "ar" ? { textAlign: "left" } : {},
                    ]}
                >
                    {fixArabic(t("Official Document", lang), lang)}
                </Text>
            </View>
        </View>
        <View style={styles.dividerThick} />
    </View>
);

const HIDE_CLIENT_INFO_TYPES = ["invoice", "social_media_report", "weekly_sales_report", "influencer_campaign"];

export const ClientInfo = ({
    data,
    lang = "en",
}: {
    data: DocumentData;
    lang?: Lang;
}) => {
    if (HIDE_CLIENT_INFO_TYPES.includes(data.type)) return <View />;
    return (
        <View style={[styles.clientRow, rowDir(lang)]}>
            <View>
                <Text style={[styles.labelSmall, af(lang)]}>
                    {fixArabic(t("Prepared For", lang), lang)}
                </Text>
                <Text style={[styles.clientName, afB(lang)]}>
                    {fixArabic(data.clientName || t("Client Name", lang), lang)}
                </Text>
            </View>
            <View>
                <Text
                    style={[
                        styles.projectTitle,
                        afB(lang),
                        lang === "ar" ? { textAlign: "left" } : {},
                    ]}
                >
                    {fixArabic(
                        data.projectTitle || t("Project Description", lang),
                        lang
                    )}
                </Text>
            </View>
        </View>
    );
};

export const ExecutiveSummary = ({
    text,
    lang = "en",
}: {
    text: string;
    lang?: Lang;
}) => (
    <View style={styles.section}>
        <Text style={[styles.sectionTitle, af(lang)]}>
            {fixArabic(t("Executive Summary", lang), lang)}
        </Text>
        <Text
            style={[
                styles.summaryText,
                af(lang),
                lang === "ar"
                    ? {
                          fontFamily: "IBMPlexSansArabic",
                          borderLeftWidth: 0,
                          borderRightWidth: 3,
                          borderRightColor: colors.slate200,
                          paddingLeft: 0,
                          paddingRight: 16,
                      }
                    : lang === "tr"
                    ? { fontFamily: "GoogleSansFlex" }
                    : {},
            ]}
        >
            {fixArabic(text, lang)}
        </Text>
    </View>
);

export const TextSection = ({
    text,
    label,
    lang = "en",
}: {
    text: string;
    label: string;
    lang?: Lang;
}) => (
    <View style={styles.section}>
        <Text style={[styles.sectionTitle, af(lang)]}>
            {fixArabic(t(label, lang), lang)}
        </Text>
        <Text style={[styles.bodyText, af(lang)]}>{fixArabic(text, lang)}</Text>
    </View>
);

export const TermsList = ({
    terms,
    label,
    lang = "en",
}: {
    terms: DocumentData["termsAndConditions"];
    label?: string;
    lang?: Lang;
}) => {
    const filtered = terms.filter((t) => t.text);
    if (filtered.length === 0) return <View />;

    return (
        <View style={styles.section}>
            <Text style={[styles.sectionTitle, af(lang)]}>
                {fixArabic(t(label || "Terms & Conditions", lang), lang)}
            </Text>
            {filtered.map((clause, idx) => (
                <View
                    key={clause.id}
                    style={[styles.termRow, rowDir(lang)]}
                    wrap={false}
                >
                    <View
                        style={[
                            styles.termBadge,
                            lang === "ar"
                                ? { marginRight: 0, marginLeft: 10 }
                                : {},
                        ]}
                    >
                        <Text style={styles.termNumber}>{idx + 1}</Text>
                    </View>
                    <Text style={[styles.termText, af(lang)]}>
                        {fixArabic(t(clause.text, lang), lang)}
                    </Text>
                </View>
            ))}
        </View>
    );
};

export const SignatureBlock = ({
    label,
    signerLabel,
    lang = "en",
}: {
    label?: string;
    signerLabel?: string;
    lang?: Lang;
}) => (
    <View style={styles.section}>
        <Text style={[styles.sectionTitle, af(lang)]}>
            {fixArabic(t(label || "Authorized Signature", lang), lang)}
        </Text>
        <View style={[{ flexDirection: lang === "ar" ? "row-reverse" : "row", gap: 40, marginTop: 8 }]}>
            <View style={{ flex: 1 }}>
                <View style={{ borderBottomWidth: 1, borderBottomColor: "#94a3b8", marginBottom: 6, height: 36 }} />
                <Text style={[styles.labelSmall, af(lang)]}>
                    {fixArabic(t(signerLabel || "Signature", lang), lang)}
                </Text>
            </View>
            <View style={{ flex: 1 }}>
                <View style={{ borderBottomWidth: 1, borderBottomColor: "#94a3b8", marginBottom: 6, height: 36 }} />
                <Text style={[styles.labelSmall, af(lang)]}>
                    {fixArabic(t("Name & Title", lang), lang)}
                </Text>
            </View>
            <View style={{ flex: 1 }}>
                <View style={{ borderBottomWidth: 1, borderBottomColor: "#94a3b8", marginBottom: 6, height: 36 }} />
                <Text style={[styles.labelSmall, af(lang)]}>
                    {fixArabic(t("Date", lang), lang)}
                </Text>
            </View>
        </View>
    </View>
);

export const PageFooter = ({ lang = "en" }: { lang?: Lang }) => (
    <View style={[styles.footer, rowDir(lang)]} fixed>
        <Text style={[styles.footerTextItalic, af(lang)]}>
            GENBUZZ INTERNAL SYSTEMS
        </Text>
        <Text
            style={[styles.pageNumber, af(lang)]}
            render={({ pageNumber, totalPages }) =>
                `${pageNumber} / ${totalPages}`
            }
        />
        <Text style={[styles.footerText, af(lang)]}>
            {fixArabic(t("Confidential", lang), lang)} {"\u2022"}{" "}
            {new Date().getFullYear()}
        </Text>
    </View>
);

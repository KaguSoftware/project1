import { View, Text } from "@react-pdf/renderer";
import { styles, af, afB, rowDir } from "../styles";
import { t } from "@/src/lib/translations";
import { fixArabic } from "./common";
import type { DocumentData } from "@/src/store";

type Lang = "en" | "ar" | "tr";

export const InvoiceTable = ({
    data,
    lang = "en",
}: {
    data: DocumentData;
    lang?: Lang;
}) => {
    const segments = (data.invoiceSegments ?? []).filter((s) => s.name);
    if (segments.length === 0) return <View />;

    const cur = data.defaultCurrency || "";
    const fmt = (n: number) => (cur ? `${cur} ${n.toLocaleString()}` : n.toLocaleString());

    const totalPaid = segments.reduce((s, seg) => s + (seg.paid || 0), 0);
    const totalPayment = segments.reduce((s, seg) => s + (seg.totalPayment || 0), 0);
    const totalRemaining = totalPayment - totalPaid;

    const isAr = lang === "ar";
    const rightOrLeft = isAr ? "left" : "right";

    return (
        <View style={styles.section}>
            <Text style={[styles.sectionTitle, af(lang)]}>
                {fixArabic(t("Billing Details", lang), lang)}
            </Text>
            <View>
                {/* Header */}
                <View style={[styles.tableHeaderRow, rowDir(lang)]}>
                    <Text style={[styles.tableHeaderCell, { flex: 4 }, af(lang)]}>
                        {fixArabic(t("Segment", lang), lang)}
                    </Text>
                    <Text style={[styles.tableHeaderCell, { flex: 2, textAlign: "center" }, af(lang)]}>
                        {fixArabic(t("Paid", lang), lang)}
                    </Text>
                    <Text style={[styles.tableHeaderCell, { flex: 2, textAlign: "center" }, af(lang)]}>
                        {fixArabic(t("Remaining", lang), lang)}
                    </Text>
                    <Text style={[styles.tableHeaderCell, { flex: 2.5, textAlign: rightOrLeft }, af(lang)]}>
                        {fixArabic(t("Total Payment", lang), lang)}
                    </Text>
                </View>

                {/* Segment rows */}
                {segments.map((seg) => {
                    const remaining = (seg.totalPayment || 0) - (seg.paid || 0);
                    return (
                        <View key={seg.id} style={[styles.tableRow, rowDir(lang)]} wrap={false}>
                            <Text style={[styles.tableCellBold, { flex: 4 }, afB(lang)]}>
                                {fixArabic(seg.name, lang)}
                            </Text>
                            <Text style={[styles.tableCell, { flex: 2, textAlign: "center", color: "#10b981" }, af(lang)]}>
                                {fmt(seg.paid || 0)}
                            </Text>
                            <Text style={[styles.tableCell, { flex: 2, textAlign: "center", color: remaining >= 0 ? "#ef4444" : "#10b981" }, af(lang)]}>
                                {fmt(remaining)}
                            </Text>
                            <Text style={[styles.tableCellBold, { flex: 2.5, textAlign: rightOrLeft }, afB(lang)]}>
                                {fmt(seg.totalPayment || 0)}
                            </Text>
                        </View>
                    );
                })}

                {/* Totals row */}
                <View style={[styles.tableTotalRow, rowDir(lang)]}>
                    <Text style={[styles.totalLabel, { flex: 4 }, afB(lang)]}>
                        {fixArabic(t("Total", lang), lang)}
                    </Text>
                    <Text style={[styles.totalValue, { flex: 2, textAlign: "center", color: "#10b981" }, afB(lang)]}>
                        {fmt(totalPaid)}
                    </Text>
                    <Text style={[styles.totalValue, { flex: 2, textAlign: "center", color: totalRemaining >= 0 ? "#ef4444" : "#10b981" }, afB(lang)]}>
                        {fmt(totalRemaining)}
                    </Text>
                    <Text style={[styles.totalValue, { flex: 2.5, textAlign: rightOrLeft }, afB(lang)]}>
                        {fmt(totalPayment)}
                    </Text>
                </View>
            </View>
        </View>
    );
};

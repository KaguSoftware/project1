import { View, Text } from "@react-pdf/renderer";
import { styles, af, afB, rowDir } from "../styles";
import { deltaStyle, fixArabic } from "./common";
import { t } from "@/src/lib/translations";
import type { DocumentData } from "@/src/store";
import type { LeadStatus } from "@/src/store/types";

type Lang = "en" | "ar" | "tr";

// ── Status label map ──────────────────────────────────────────────────────────

const STATUS_LABEL_KEYS: Record<LeadStatus, string> = {
    new_lead:         "New Lead",
    meeting_arranged: "Meeting Arranged",
    proposal_sent:    "Proposal Sent",
    closed_won:       "Closed Won",
    closed_lost:      "Closed Lost",
    follow_up_needed: "Follow-up Needed",
};

const STATUS_COLORS: Record<LeadStatus, string> = {
    new_lead:         "#6366f1",
    meeting_arranged: "#f59e0b",
    proposal_sent:    "#3b82f6",
    closed_won:       "#22c55e",
    closed_lost:      "#ef4444",
    follow_up_needed: "#8b5cf6",
};

function formatDate(iso: string) {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("en-GB", {
        day: "2-digit", month: "short", year: "numeric",
    });
}

// ── Weekly Sales PDF ──────────────────────────────────────────────────────────

export const WeeklySalesPDF = ({
    doc,
    lang = "en",
}: {
    doc: DocumentData;
    lang?: Lang;
}) => {
    const ws = doc.weeklySales;
    if (!ws) return <View />;

    const hasLeads = ws.leads.some((l) => l.clientName);

    return (
        <View style={styles.section}>
            {/* Header block */}
            {(ws.salesPersonName || ws.department || ws.weekStart) && (
                <View style={{ marginBottom: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: "#e2e8f0" }}>
                    <View style={{ flexDirection: "row", gap: 24 }}>
                        {ws.salesPersonName ? (
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 7, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>
                                    {t("Sales Person", lang)}
                                </Text>
                                <Text style={[styles.bodyText, afB(lang)]}>{ws.salesPersonName}</Text>
                            </View>
                        ) : null}
                        {ws.department ? (
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 7, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>
                                    {t("Department", lang)}
                                </Text>
                                <Text style={[styles.bodyText, afB(lang)]}>{ws.department}</Text>
                            </View>
                        ) : null}
                    </View>
                    {(ws.weekStart || ws.weekEnd) ? (
                        <View style={{ marginTop: 8 }}>
                            <Text style={{ fontSize: 7, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>
                                {t("Period", lang)}
                            </Text>
                            <Text style={[styles.bodyText, afB(lang)]}>
                                {formatDate(ws.weekStart)}{ws.weekStart && ws.weekEnd ? " – " : ""}{formatDate(ws.weekEnd)}
                            </Text>
                        </View>
                    ) : null}
                </View>
            )}

            {/* Status summary grid */}
            {hasLeads && (() => {
                const counts: Partial<Record<LeadStatus, number>> = {};
                ws.leads.filter((l) => l.clientName && l.status).forEach((l) => {
                    const s = l.status as LeadStatus;
                    counts[s] = (counts[s] ?? 0) + 1;
                });
                const entries = Object.keys(STATUS_LABEL_KEYS) as LeadStatus[];
                const rows = [entries.slice(0, 3), entries.slice(3)];
                return (
                    <View style={{ gap: 6, marginBottom: 16 }}>
                        {rows.map((row, ri) => (
                            <View key={ri} style={{ flexDirection: "row", gap: 6 }}>
                            {row.map((s) => (
                            <View key={s} style={{
                                backgroundColor: `${STATUS_COLORS[s]}18`,
                                borderRadius: 6,
                                padding: 8,
                                flex: 1,
                            }}>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: 3, marginBottom: 4 }}>
                                    <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: STATUS_COLORS[s] }} />
                                    <Text style={{ fontSize: 6, color: STATUS_COLORS[s], fontWeight: "bold", textTransform: "uppercase" }}>
                                        {t(STATUS_LABEL_KEYS[s], lang)}
                                    </Text>
                                </View>
                                <Text style={{ fontSize: 18, fontWeight: "bold", color: STATUS_COLORS[s], lineHeight: 1 }}>
                                    {counts[s] ?? 0}
                                </Text>
                            </View>
                            ))}
                            </View>
                        ))}
                    </View>
                );
            })()}

            {/* Leads */}
            {hasLeads && (
                <View style={{ marginBottom: 16 }}>
                    <Text style={[styles.sectionTitle, af(lang)]}>{t("Leads", lang)}</Text>
                    {ws.leads.filter((l) => l.clientName).map((lead) => {
                        const statusColor = lead.status ? STATUS_COLORS[lead.status as LeadStatus] : "#94a3b8";
                        const statusLabel = lead.status ? t(STATUS_LABEL_KEYS[lead.status as LeadStatus], lang) : "";
                        return (
                            <View
                                key={lead.id}
                                wrap={false}
                                style={{
                                    borderWidth: 1,
                                    borderColor: "#e2e8f0",
                                    borderRadius: 6,
                                    padding: 10,
                                    marginBottom: 8,
                                }}
                            >
                                {/* Lead header row */}
                                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
                                    <View>
                                        <Text style={[styles.tableCell, afB(lang), { fontWeight: "bold", color: "#1e293b" }]}>
                                            {fixArabic(lead.clientName, lang)}
                                        </Text>
                                        {lead.contactPerson ? (
                                            <Text style={[styles.tableCell, af(lang), { color: "#64748b" }]}>
                                                {fixArabic(lead.contactPerson, lang)}
                                            </Text>
                                        ) : null}
                                    </View>
                                    {statusLabel ? (
                                        <View style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            gap: 4,
                                            backgroundColor: `${statusColor}18`,
                                            paddingHorizontal: 6,
                                            paddingVertical: 3,
                                            borderRadius: 20,
                                        }}>
                                            <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: statusColor }} />
                                            <Text style={{ fontSize: 7, color: statusColor, fontWeight: "bold" }}>
                                                {statusLabel}
                                            </Text>
                                        </View>
                                    ) : null}
                                </View>

                                {/* Contact info */}
                                <View style={{ flexDirection: "row", gap: 16, marginBottom: 6 }}>
                                    {lead.email ? <Text style={[styles.tableCell, af(lang), { color: "#64748b" }]}>{lead.email}</Text> : null}
                                    {lead.phone ? <Text style={[styles.tableCell, af(lang), { color: "#64748b" }]}>{lead.phone}</Text> : null}
                                    {lead.leadSource ? (
                                        <Text style={[styles.tableCell, af(lang), { color: "#64748b", textTransform: "capitalize" }]}>
                                            {lead.leadSource.replace(/_/g, " ")}
                                        </Text>
                                    ) : null}
                                </View>

                                {/* Meeting + deal */}
                                <View style={{ flexDirection: "row", gap: 16, marginBottom: lead.notes ? 6 : 0 }}>
                                    {lead.meetingDate ? (
                                        <Text style={[styles.tableCell, af(lang)]}>
                                            <Text style={{ color: "#94a3b8" }}>{t("Meeting Date", lang)}: </Text>
                                            {formatDate(lead.meetingDate)}
                                        </Text>
                                    ) : null}
                                    {lead.dealValue ? (
                                        <Text style={[styles.tableCell, afB(lang)]}>
                                            <Text style={{ color: "#94a3b8", fontWeight: "normal" }}>{t("Deal Value", lang)}: </Text>
                                            {fixArabic(lead.dealValue, lang)}
                                        </Text>
                                    ) : null}
                                </View>

                                {lead.notes ? (
                                    <Text style={[styles.tableCell, af(lang), { color: "#64748b", fontStyle: "italic", borderTopWidth: 1, borderTopColor: "#f1f5f9", paddingTop: 6 }]}>
                                        {fixArabic(lead.notes, lang)}
                                    </Text>
                                ) : null}
                            </View>
                        );
                    })}
                </View>
            )}

            {/* Week summary */}
            {ws.weekSummary ? (
                <View style={{ marginBottom: 12 }} wrap={false}>
                    <Text style={[styles.sectionTitle, af(lang)]}>{t("Week Summary", lang)}</Text>
                    <Text style={[styles.bodyText, af(lang)]}>{fixArabic(ws.weekSummary, lang)}</Text>
                </View>
            ) : null}

            {/* Challenges */}
            {ws.challenges ? (
                <View style={{ marginBottom: 12 }} wrap={false}>
                    <Text style={[styles.sectionTitle, af(lang)]}>{t("Challenges / Obstacles", lang)}</Text>
                    <Text style={[styles.bodyText, af(lang)]}>{fixArabic(ws.challenges, lang)}</Text>
                </View>
            ) : null}

            {/* Next week goals */}
            {ws.nextWeekGoals ? (
                <View style={{ marginBottom: 12 }} wrap={false}>
                    <Text style={[styles.sectionTitle, af(lang)]}>{t("Next Week's Goals", lang)}</Text>
                    <Text style={[styles.bodyText, af(lang)]}>{fixArabic(ws.nextWeekGoals, lang)}</Text>
                </View>
            ) : null}

            {/* Additional notes */}
            {ws.additionalNotes ? (
                <View style={{ marginBottom: 12 }} wrap={false}>
                    <Text style={[styles.sectionTitle, af(lang)]}>{t("Additional Notes", lang)}</Text>
                    <Text style={[styles.bodyText, af(lang)]}>{fixArabic(ws.additionalNotes, lang)}</Text>
                </View>
            ) : null}
        </View>
    );
};

// ── Legacy exports (used by other doc types) ──────────────────────────────────

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
                        style={i === filtered.length - 1 ? styles.statBoxLast : styles.statBox}
                    >
                        <Text style={[styles.statLabel, af(lang)]}>{fixArabic(m.title, lang)}</Text>
                        <Text style={[styles.statValue, afB(lang)]}>{fixArabic(m.money, lang)}</Text>
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
                    <Text style={[styles.tableHeaderCell, { flex: 3 }, af(lang)]}>
                        {fixArabic(t("Client", lang), lang)}
                    </Text>
                    <Text style={[styles.tableHeaderCell, { flex: 2, textAlign: lang === "ar" ? "left" : "right" }, af(lang)]}>
                        {fixArabic(t("Deal Value", lang), lang)}
                    </Text>
                    <Text style={[styles.tableHeaderCell, { flex: 2, textAlign: lang === "ar" ? "left" : "right" }, af(lang)]}>
                        {fixArabic(t("Stage", lang), lang)}
                    </Text>
                </View>
                {filtered.map((deal) => (
                    <View key={deal.id} style={[styles.tableRow, rowDir(lang)]} wrap={false}>
                        <Text style={[styles.tableCellBold, { flex: 3 }, afB(lang)]}>
                            {fixArabic(deal.client, lang)}
                        </Text>
                        <Text style={[styles.tableCell, { flex: 2, textAlign: lang === "ar" ? "left" : "right" }, af(lang)]}>
                            {fixArabic(deal.dealValue, lang)}
                        </Text>
                        <View style={{ flex: 2, alignItems: lang === "ar" ? "flex-start" : "flex-end" }}>
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

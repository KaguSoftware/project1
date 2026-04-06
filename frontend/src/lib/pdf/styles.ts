import { StyleSheet, Font } from "@react-pdf/renderer";

// Prevent ugly word hyphenation
Font.registerHyphenationCallback((word) => [word]);

export const colors = {
	slate900: "#0f172a",
	slate800: "#1e293b",
	slate700: "#334155",
	slate600: "#475569",
	slate500: "#64748b",
	slate400: "#94a3b8",
	slate300: "#cbd5e1",
	slate200: "#e2e8f0",
	slate100: "#f1f5f9",
	slate50: "#f8fafc",
	white: "#ffffff",
	emerald500: "#10b981",
	red500: "#ef4444",
} as const;

export const styles = StyleSheet.create({
	// ─── Page ──────────────────────────
	page: {
		paddingTop: 50,
		paddingBottom: 65,
		paddingHorizontal: 50,
		fontFamily: "Helvetica",
		fontSize: 9.5,
		color: colors.slate800,
		backgroundColor: colors.white,
	},

	// ─── Header ────────────────────────
	headerRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		marginBottom: 12,
	},
	docType: {
		fontSize: 26,
		fontFamily: "Helvetica-Bold",
		color: colors.slate900,
		letterSpacing: 4,
		textTransform: "uppercase",
		marginBottom: 4,
	},
	refLine: {
		fontSize: 7.5,
		color: colors.slate500,
		letterSpacing: 2,
		textTransform: "uppercase",
	},
	brandBox: {
		backgroundColor: colors.slate900,
		paddingHorizontal: 14,
		paddingVertical: 8,
		borderRadius: 6,
		marginBottom: 3,
	},
	brandText: {
		fontSize: 16,
		fontFamily: "Helvetica-Bold",
		color: colors.white,
		letterSpacing: -0.5,
	},
	brandSub: {
		fontSize: 6.5,
		color: colors.slate400,
		textTransform: "uppercase",
		fontFamily: "Helvetica-Bold",
		letterSpacing: 2,
		textAlign: "right",
	},
	dividerThick: {
		width: "100%",
		height: 3,
		backgroundColor: colors.slate900,
		marginBottom: 30,
	},

	// ─── Client Row ────────────────────
	clientRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 35,
	},
	labelSmall: {
		fontSize: 7,
		color: colors.slate400,
		textTransform: "uppercase",
		letterSpacing: 2,
		fontFamily: "Helvetica-Bold",
		marginBottom: 5,
	},
	clientName: {
		fontSize: 18,
		fontFamily: "Helvetica-Bold",
		color: colors.slate900,
	},
	projectTitle: {
		fontSize: 18,
		fontFamily: "Helvetica-Bold",
		color: colors.slate900,
		textAlign: "right",
	},

	// ─── Sections ──────────────────────
	section: {
		marginBottom: 24,
	},
	sectionTitle: {
		fontSize: 8,
		color: colors.slate400,
		textTransform: "uppercase",
		letterSpacing: 3,
		fontFamily: "Helvetica-Bold",
		marginBottom: 10,
	},
	bodyText: {
		fontSize: 9.5,
		color: colors.slate700,
		lineHeight: 1.7,
	},
	summaryText: {
		fontSize: 11,
		color: colors.slate700,
		lineHeight: 1.8,
		fontFamily: "Helvetica-Oblique",
		borderLeftWidth: 3,
		borderLeftColor: colors.slate200,
		paddingLeft: 16,
	},

	// ─── Stat Grid ─────────────────────
	statRow: {
		flexDirection: "row",
	},
	statBox: {
		flex: 1,
		backgroundColor: colors.slate50,
		borderRadius: 8,
		padding: 12,
		borderWidth: 0.5,
		borderColor: colors.slate200,
		marginRight: 8,
	},
	statBoxLast: {
		flex: 1,
		backgroundColor: colors.slate50,
		borderRadius: 8,
		padding: 12,
		borderWidth: 0.5,
		borderColor: colors.slate200,
		marginRight: 0,
	},
	statLabel: {
		fontSize: 6.5,
		fontFamily: "Helvetica-Bold",
		color: colors.slate400,
		textTransform: "uppercase",
		letterSpacing: 1,
		marginBottom: 4,
	},
	statValue: {
		fontSize: 11,
		fontFamily: "Helvetica-Bold",
		color: colors.slate900,
	},

	// ─── Tables ────────────────────────
	tableHeaderRow: {
		flexDirection: "row",
		borderBottomWidth: 1.5,
		borderBottomColor: colors.slate900,
		paddingBottom: 8,
		marginBottom: 2,
	},
	tableRow: {
		flexDirection: "row",
		borderBottomWidth: 0.5,
		borderBottomColor: colors.slate100,
		paddingVertical: 8,
		alignItems: "center",
	},
	tableHeaderCell: {
		fontSize: 7,
		fontFamily: "Helvetica-Bold",
		textTransform: "uppercase",
		letterSpacing: 1,
		color: colors.slate900,
	},
	tableCell: {
		fontSize: 9,
		color: colors.slate700,
	},
	tableCellBold: {
		fontSize: 9,
		fontFamily: "Helvetica-Bold",
		color: colors.slate700,
	},

	// ─── Table Footer (totals) ─────────
	tableTotalRow: {
		flexDirection: "row",
		borderTopWidth: 2,
		borderTopColor: colors.slate900,
		paddingTop: 10,
		marginTop: 4,
		alignItems: "center",
	},
	totalLabel: {
		fontSize: 8,
		fontFamily: "Helvetica-Bold",
		textTransform: "uppercase",
		letterSpacing: 2,
		color: colors.slate900,
	},
	totalValue: {
		fontSize: 14,
		fontFamily: "Helvetica-Bold",
		color: colors.slate900,
	},

	// ─── Terms List ────────────────────
	termRow: {
		flexDirection: "row",
		marginBottom: 8,
	},
	termBadge: {
		width: 16,
		height: 16,
		borderRadius: 8,
		backgroundColor: colors.slate100,
		alignItems: "center",
		justifyContent: "center",
		marginRight: 10,
		marginTop: 1,
	},
	termNumber: {
		fontSize: 7,
		fontFamily: "Helvetica-Bold",
		color: colors.slate500,
	},
	termText: {
		fontSize: 9,
		color: colors.slate600,
		lineHeight: 1.6,
		flex: 1,
	},

	// ─── Status Badge ──────────────────
	badge: {
		paddingHorizontal: 8,
		paddingVertical: 2,
		borderRadius: 10,
		backgroundColor: colors.slate100,
	},
	badgeText: {
		fontSize: 7,
		fontFamily: "Helvetica-Bold",
		textTransform: "uppercase",
		color: colors.slate500,
	},

	// ─── Delta ─────────────────────────
	deltaPositive: {
		fontSize: 7,
		fontFamily: "Helvetica-Bold",
		color: colors.emerald500,
	},
	deltaNegative: {
		fontSize: 7,
		fontFamily: "Helvetica-Bold",
		color: colors.red500,
	},

	// ─── Metric Row (performance) ──────
	metricRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		borderBottomWidth: 0.5,
		borderBottomColor: colors.slate50,
		paddingVertical: 8,
		alignItems: "center",
	},
	metricLabel: {
		fontSize: 9.5,
		fontFamily: "Helvetica-Bold",
		color: colors.slate600,
	},
	metricValue: {
		fontSize: 11,
		fontFamily: "Helvetica-Bold",
		color: colors.slate900,
	},

	// ─── Footer ────────────────────────
	footer: {
		position: "absolute",
		bottom: 28,
		left: 50,
		right: 50,
		borderTopWidth: 0.5,
		borderTopColor: colors.slate200,
		paddingTop: 10,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	footerText: {
		fontSize: 6.5,
		color: colors.slate400,
		textTransform: "uppercase",
		letterSpacing: 2,
		fontFamily: "Helvetica-Bold",
	},
	footerTextItalic: {
		fontSize: 6.5,
		color: colors.slate400,
		textTransform: "uppercase",
		letterSpacing: 2,
		fontFamily: "Helvetica-BoldOblique",
	},
	pageNumber: {
		fontSize: 7,
		color: colors.slate400,
		fontFamily: "Helvetica-Bold",
	},
});

import { View, Text } from "@react-pdf/renderer";
import { styles, af, afB, rowDir } from "../styles";
import { t } from "@/src/lib/translations";
import type { DocumentData } from "@/src/store";

type Lang = "en" | "ar";

export const InvoiceTable = ({ data, lang = "en" }: { data: DocumentData; lang?: Lang }) => {
	const items = data.lineItems.filter((i) => i.description);
	if (items.length === 0) return null;

	const total = items.reduce((sum, i) => sum + i.qty * i.rate, 0);
	const cur = data.defaultCurrency || "USD";

	return (
		<View style={styles.section}>
			<Text style={[styles.sectionTitle, af(lang)]}>{t("Billing Details", lang)}</Text>
			<View>
				<View style={[styles.tableHeaderRow, rowDir(lang)]}>
					<Text style={[styles.tableHeaderCell, { flex: 4 }, af(lang)]}>
						{t("Description", lang)}
					</Text>
					<Text
						style={[
							styles.tableHeaderCell,
							{ flex: 1, textAlign: "center" },
							af(lang),
						]}
					>
						{t("Qty", lang)}
					</Text>
					<Text
						style={[
							styles.tableHeaderCell,
							{ flex: 1.5, textAlign: lang === "ar" ? "left" : "right" },
							af(lang),
						]}
					>
						{t("Rate", lang)}
					</Text>
					<Text
						style={[
							styles.tableHeaderCell,
							{ flex: 1.5, textAlign: lang === "ar" ? "left" : "right" },
							af(lang),
						]}
					>
						{t("Total", lang)}
					</Text>
				</View>

				{items.map((item) => (
					<View key={item.id} style={[styles.tableRow, rowDir(lang)]} wrap={false}>
						<Text style={[styles.tableCellBold, { flex: 4 }, afB(lang)]}>
							{item.description}
						</Text>
						<Text
							style={[
								styles.tableCell,
								{ flex: 1, textAlign: "center" },
								af(lang),
							]}
						>
							{String(item.qty)}
						</Text>
						<Text
							style={[
								styles.tableCell,
								{ flex: 1.5, textAlign: lang === "ar" ? "left" : "right" },
								af(lang),
							]}
						>
							{cur} {item.rate.toLocaleString()}
						</Text>
						<Text
							style={[
								styles.tableCellBold,
								{ flex: 1.5, textAlign: lang === "ar" ? "left" : "right" },
								afB(lang),
							]}
						>
							{cur} {(item.qty * item.rate).toLocaleString()}
						</Text>
					</View>
				))}

				<View style={[styles.tableTotalRow, rowDir(lang)]}>
					<Text
						style={[
							styles.totalLabel,
							{
								flex: 6.5,
								textAlign: lang === "ar" ? "left" : "right",
								paddingRight: lang === "ar" ? 0 : 12,
								paddingLeft: lang === "ar" ? 12 : 0,
							},
							afB(lang),
						]}
					>
						{t("Total", lang)}
					</Text>
					<Text
						style={[
							styles.totalValue,
							{ flex: 1.5, textAlign: lang === "ar" ? "left" : "right" },
							afB(lang),
						]}
					>
						{cur} {total.toLocaleString()}
					</Text>
				</View>
			</View>
		</View>
	);
};

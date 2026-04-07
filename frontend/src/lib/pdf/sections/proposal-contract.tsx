import { View, Text } from "@react-pdf/renderer";
import { styles, af, afB, rowDir } from "../styles";
import { t } from "@/src/lib/translations";
import type { DocumentData } from "@/src/store";

type Lang = "en" | "ar";

export const EngagementOverview = ({ data, lang = "en" }: { data: DocumentData; lang?: Lang }) => {
	const items = [
		data.pricingPackage && { label: t("Package", lang), value: data.pricingPackage },
		data.timeline && { label: t("Timeline", lang), value: data.timeline },
		data.totalPrice && {
			label: t("Total", lang),
			value: `${data.defaultCurrency} ${data.totalPrice}`,
		},
		data.validUntil && { label: t("Valid Until", lang), value: data.validUntil },
	].filter(Boolean) as { label: string; value: string }[];

	if (items.length === 0) return null;

	return (
		<View style={styles.section} wrap={false}>
			<Text style={[styles.sectionTitle, af(lang)]}>{t("Engagement Overview", lang)}</Text>
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
						<Text style={[styles.statLabel, af(lang)]}>{stat.label}</Text>
						<Text style={[styles.statValue, afB(lang)]}>{stat.value}</Text>
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
	if (filtered.length === 0) return null;

	return (
		<View style={styles.section}>
			<Text style={[styles.sectionTitle, af(lang)]}>{t("Deliverables", lang)}</Text>
			<View>
				<View style={[styles.tableHeaderRow, rowDir(lang)]}>
					<Text style={[styles.tableHeaderCell, { flex: 3 }, af(lang)]}>
						{t("Deliverable", lang)}
					</Text>
					<Text style={[styles.tableHeaderCell, { flex: 2 }, af(lang)]}>
						{t("Timeline", lang)}
					</Text>
					<Text
						style={[
							styles.tableHeaderCell,
							{ flex: 1, textAlign: lang === "ar" ? "left" : "right" },
							af(lang),
						]}
					>
						{t("Status", lang)}
					</Text>
				</View>
				{filtered.map((item) => (
					<View key={item.id} style={[styles.tableRow, rowDir(lang)]} wrap={false}>
						<Text style={[styles.tableCellBold, { flex: 3 }, afB(lang)]}>
							{item.deliverable}
						</Text>
						<Text style={[styles.tableCell, { flex: 2 }, af(lang)]}>
							{item.timeline}
						</Text>
						<View style={{ flex: 1, alignItems: lang === "ar" ? "flex-start" : "flex-end" }}>
							<View style={styles.badge}>
								<Text style={[styles.badgeText, af(lang)]}>
									{item.status || t("Pending", lang)}
								</Text>
							</View>
						</View>
					</View>
				))}
			</View>
		</View>
	);
};

import { View, Text } from "@react-pdf/renderer";
import { styles, af, afB, rowDir } from "../styles";
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
			<Text style={[styles.sectionTitle, af(lang)]}>{t("Campaign KPIs", lang)}</Text>
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
						<Text style={[styles.statLabel, af(lang)]}>{k.label}</Text>
						<Text style={[styles.statValue, afB(lang)]}>{k.value || "0"}</Text>
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
	if (filtered.length === 0) return null;

	return (
		<View style={styles.section}>
			<Text style={[styles.sectionTitle, af(lang)]}>{t("Influencer Roster", lang)}</Text>
			<View>
				<View style={[styles.tableHeaderRow, rowDir(lang)]}>
					<Text style={[styles.tableHeaderCell, { flex: 2.5 }, af(lang)]}>
						{t("Name", lang)}
					</Text>
					<Text style={[styles.tableHeaderCell, { flex: 1.5 }, af(lang)]}>
						{t("Platform", lang)}
					</Text>
					<Text
						style={[
							styles.tableHeaderCell,
							{ flex: 1, textAlign: lang === "ar" ? "left" : "right" },
							af(lang),
						]}
					>
						{t("Followers", lang)}
					</Text>
					<Text
						style={[
							styles.tableHeaderCell,
							{ flex: 1, textAlign: lang === "ar" ? "left" : "right" },
							af(lang),
						]}
					>
						{t("Fee", lang)}
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
				{filtered.map((inf) => (
					<View key={inf.id} style={[styles.tableRow, rowDir(lang)]} wrap={false}>
						<Text style={[styles.tableCellBold, { flex: 2.5 }, afB(lang)]}>
							{inf.name}
						</Text>
						<Text style={[styles.tableCell, { flex: 1.5 }, af(lang)]}>
							{inf.platform}
						</Text>
						<Text
							style={[
								styles.tableCell,
								{ flex: 1, textAlign: lang === "ar" ? "left" : "right" },
								af(lang),
							]}
						>
							{inf.followers}
						</Text>
						<Text
							style={[
								styles.tableCell,
								{ flex: 1, textAlign: lang === "ar" ? "left" : "right" },
								af(lang),
							]}
						>
							{inf.rate}
						</Text>
						<View style={{ flex: 1, alignItems: lang === "ar" ? "flex-start" : "flex-end" }}>
							<View style={styles.badge}>
								<Text style={[styles.badgeText, af(lang)]}>
									{inf.status}
								</Text>
							</View>
						</View>
					</View>
				))}
			</View>
		</View>
	);
};

import { View, Text } from "@react-pdf/renderer";
import { styles } from "../styles";
import type { DocumentData } from "@/src/store";

export const KPIGrid = ({
	kpis,
}: {
	kpis: DocumentData["influencerKPIs"];
}) => {
	const entries = [
		{ label: "Views", value: kpis.views },
		{ label: "Engagement", value: kpis.engagement },
		{ label: "Clicks", value: kpis.clicks },
		{ label: "Conversions", value: kpis.conversions },
		{ label: "ROI", value: kpis.roi },
	];

	return (
		<View style={styles.section} wrap={false}>
			<Text style={styles.sectionTitle}>Campaign Impact Score</Text>
			<View style={styles.statRow}>
				{entries.map((k, i) => (
					<View
						key={k.label}
						style={
							i === entries.length - 1
								? styles.statBoxLast
								: styles.statBox
						}
					>
						<Text style={styles.statLabel}>{k.label}</Text>
						<Text style={styles.statValue}>{k.value || "0"}</Text>
					</View>
				))}
			</View>
		</View>
	);
};

export const InfluencerRoster = ({
	influencers,
}: {
	influencers: DocumentData["influencers"];
}) => {
	const filtered = influencers.filter((i) => i.name);
	if (filtered.length === 0) return null;

	return (
		<View style={styles.section}>
			<Text style={styles.sectionTitle}>Influencer Roster</Text>
			<View>
				<View style={styles.tableHeaderRow}>
					<Text style={[styles.tableHeaderCell, { flex: 2.5 }]}>
						Name
					</Text>
					<Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>
						Platform
					</Text>
					<Text
						style={[
							styles.tableHeaderCell,
							{ flex: 1, textAlign: "right" },
						]}
					>
						Followers
					</Text>
					<Text
						style={[
							styles.tableHeaderCell,
							{ flex: 1, textAlign: "right" },
						]}
					>
						Rate
					</Text>
					<Text
						style={[
							styles.tableHeaderCell,
							{ flex: 1, textAlign: "right" },
						]}
					>
						Status
					</Text>
				</View>
				{filtered.map((inf) => (
					<View key={inf.id} style={styles.tableRow} wrap={false}>
						<Text style={[styles.tableCellBold, { flex: 2.5 }]}>
							{inf.name}
						</Text>
						<Text style={[styles.tableCell, { flex: 1.5 }]}>
							{inf.platform}
						</Text>
						<Text
							style={[
								styles.tableCell,
								{ flex: 1, textAlign: "right" },
							]}
						>
							{inf.followers}
						</Text>
						<Text
							style={[
								styles.tableCell,
								{ flex: 1, textAlign: "right" },
							]}
						>
							{inf.rate}
						</Text>
						<View style={{ flex: 1, alignItems: "flex-end" }}>
							<View style={styles.badge}>
								<Text style={styles.badgeText}>
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

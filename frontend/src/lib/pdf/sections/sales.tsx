import { View, Text } from "@react-pdf/renderer";
import { styles } from "../styles";
import { deltaStyle } from "./common";
import type { DocumentData } from "@/src/store";

export const SalesMetrics = ({
	metrics,
}: {
	metrics: DocumentData["salesMetrics"];
}) => {
	const filtered = metrics.filter((m) => m.title);
	if (filtered.length === 0) return null;

	return (
		<View style={styles.section} wrap={false}>
			<Text style={styles.sectionTitle}>Weekly Sales Metrics</Text>
			<View style={styles.statRow}>
				{filtered.map((m, i) => (
					<View
						key={m.id}
						style={
							i === filtered.length - 1
								? styles.statBoxLast
								: styles.statBox
						}
					>
						<Text style={styles.statLabel}>{m.title}</Text>
						<Text style={styles.statValue}>{m.money}</Text>
						<Text style={deltaStyle(m.delta)}>{m.delta}</Text>
					</View>
				))}
			</View>
		</View>
	);
};

export const DealBreakdownTable = ({
	deals,
}: {
	deals: DocumentData["dealBreakdown"];
}) => {
	const filtered = deals.filter((d) => d.client);
	if (filtered.length === 0) return null;

	return (
		<View style={styles.section}>
			<Text style={styles.sectionTitle}>Deal Breakdown</Text>
			<View>
				<View style={styles.tableHeaderRow}>
					<Text style={[styles.tableHeaderCell, { flex: 3 }]}>
						Client
					</Text>
					<Text
						style={[
							styles.tableHeaderCell,
							{ flex: 2, textAlign: "right" },
						]}
					>
						Deal Value
					</Text>
					<Text
						style={[
							styles.tableHeaderCell,
							{ flex: 2, textAlign: "right" },
						]}
					>
						Stage
					</Text>
				</View>
				{filtered.map((deal) => (
					<View key={deal.id} style={styles.tableRow} wrap={false}>
						<Text style={[styles.tableCellBold, { flex: 3 }]}>
							{deal.client}
						</Text>
						<Text
							style={[
								styles.tableCell,
								{ flex: 2, textAlign: "right" },
							]}
						>
							{deal.dealValue}
						</Text>
						<View style={{ flex: 2, alignItems: "flex-end" }}>
							<View style={styles.badge}>
								<Text style={styles.badgeText}>
									{deal.stage}
								</Text>
							</View>
						</View>
					</View>
				))}
			</View>
		</View>
	);
};

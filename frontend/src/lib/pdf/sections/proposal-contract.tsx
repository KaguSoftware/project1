import { View, Text } from "@react-pdf/renderer";
import { styles } from "../styles";
import type { DocumentData } from "@/src/store";

export const EngagementOverview = ({ data }: { data: DocumentData }) => {
	const items = [
		data.pricingPackage && { label: "Package", value: data.pricingPackage },
		data.timeline && { label: "Timeline", value: data.timeline },
		data.totalPrice && {
			label: "Total",
			value: `${data.defaultCurrency} ${data.totalPrice}`,
		},
		data.validUntil && { label: "Valid Until", value: data.validUntil },
	].filter(Boolean) as { label: string; value: string }[];

	if (items.length === 0) return null;

	return (
		<View style={styles.section} wrap={false}>
			<Text style={styles.sectionTitle}>Engagement Overview</Text>
			<View style={styles.statRow}>
				{items.map((stat, i) => (
					<View
						key={stat.label}
						style={
							i === items.length - 1
								? styles.statBoxLast
								: styles.statBox
						}
					>
						<Text style={styles.statLabel}>{stat.label}</Text>
						<Text style={styles.statValue}>{stat.value}</Text>
					</View>
				))}
			</View>
		</View>
	);
};

export const DeliverablesTable = ({
	rows,
}: {
	rows: DocumentData["deliverables"];
}) => {
	const filtered = rows.filter((d) => d.deliverable);
	if (filtered.length === 0) return null;

	return (
		<View style={styles.section}>
			<Text style={styles.sectionTitle}>Deliverables</Text>
			<View>
				<View style={styles.tableHeaderRow}>
					<Text style={[styles.tableHeaderCell, { flex: 3 }]}>
						Deliverable
					</Text>
					<Text style={[styles.tableHeaderCell, { flex: 2 }]}>
						Timeline
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
				{filtered.map((item) => (
					<View key={item.id} style={styles.tableRow} wrap={false}>
						<Text style={[styles.tableCellBold, { flex: 3 }]}>
							{item.deliverable}
						</Text>
						<Text style={[styles.tableCell, { flex: 2 }]}>
							{item.timeline}
						</Text>
						<View style={{ flex: 1, alignItems: "flex-end" }}>
							<View style={styles.badge}>
								<Text style={styles.badgeText}>
									{item.status || "Pending"}
								</Text>
							</View>
						</View>
					</View>
				))}
			</View>
		</View>
	);
};

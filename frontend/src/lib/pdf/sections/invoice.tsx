import { View, Text } from "@react-pdf/renderer";
import { styles } from "../styles";
import type { DocumentData } from "@/src/store";

export const InvoiceTable = ({ data }: { data: DocumentData }) => {
	const items = data.lineItems.filter((i) => i.description);
	if (items.length === 0) return null;

	const total = items.reduce((sum, i) => sum + i.qty * i.rate, 0);
	const cur = data.defaultCurrency || "USD";

	return (
		<View style={styles.section}>
			<Text style={styles.sectionTitle}>Billing Details</Text>
			<View>
				<View style={styles.tableHeaderRow}>
					<Text style={[styles.tableHeaderCell, { flex: 4 }]}>
						Description
					</Text>
					<Text
						style={[
							styles.tableHeaderCell,
							{ flex: 1, textAlign: "center" },
						]}
					>
						Qty
					</Text>
					<Text
						style={[
							styles.tableHeaderCell,
							{ flex: 1.5, textAlign: "right" },
						]}
					>
						Rate
					</Text>
					<Text
						style={[
							styles.tableHeaderCell,
							{ flex: 1.5, textAlign: "right" },
						]}
					>
						Total
					</Text>
				</View>

				{items.map((item) => (
					<View key={item.id} style={styles.tableRow} wrap={false}>
						<Text style={[styles.tableCellBold, { flex: 4 }]}>
							{item.description}
						</Text>
						<Text
							style={[
								styles.tableCell,
								{ flex: 1, textAlign: "center" },
							]}
						>
							{String(item.qty)}
						</Text>
						<Text
							style={[
								styles.tableCell,
								{ flex: 1.5, textAlign: "right" },
							]}
						>
							{cur} {item.rate.toLocaleString()}
						</Text>
						<Text
							style={[
								styles.tableCellBold,
								{ flex: 1.5, textAlign: "right" },
							]}
						>
							{cur} {(item.qty * item.rate).toLocaleString()}
						</Text>
					</View>
				))}

				<View style={styles.tableTotalRow}>
					<Text
						style={[
							styles.totalLabel,
							{
								flex: 6.5,
								textAlign: "right",
								paddingRight: 12,
							},
						]}
					>
						Total
					</Text>
					<Text
						style={[
							styles.totalValue,
							{ flex: 1.5, textAlign: "right" },
						]}
					>
						{cur} {total.toLocaleString()}
					</Text>
				</View>
			</View>
		</View>
	);
};

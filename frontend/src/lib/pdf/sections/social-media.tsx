import { View, Text } from "@react-pdf/renderer";
import { styles } from "../styles";
import { deltaStyle } from "./common";
import type { DocumentData } from "@/src/store";

export const PerformanceMetrics = ({
	metrics,
}: {
	metrics: DocumentData["performanceMetrics"];
}) => {
	const filtered = metrics.filter((m) => m.metric);
	if (filtered.length === 0) return null;

	return (
		<View style={styles.section}>
			<Text style={styles.sectionTitle}>Metric Performance</Text>
			{filtered.map((m) => (
				<View key={m.id} style={styles.metricRow} wrap={false}>
					<Text style={styles.metricLabel}>{m.metric}</Text>
					<View style={{ alignItems: "flex-end" }}>
						<Text style={styles.metricValue}>{m.number}</Text>
						<Text style={deltaStyle(m.delta)}>{m.delta}</Text>
					</View>
				</View>
			))}
		</View>
	);
};

export const TopPostsTable = ({
	posts,
}: {
	posts: DocumentData["topPosts"];
}) => {
	const filtered = posts.filter((p) => p.post);
	if (filtered.length === 0) return null;

	return (
		<View style={styles.section}>
			<Text style={styles.sectionTitle}>Top Performing Posts</Text>
			<View>
				<View style={styles.tableHeaderRow}>
					<Text style={[styles.tableHeaderCell, { flex: 4 }]}>
						Post
					</Text>
					<Text
						style={[
							styles.tableHeaderCell,
							{ flex: 1, textAlign: "right" },
						]}
					>
						Likes
					</Text>
					<Text
						style={[
							styles.tableHeaderCell,
							{ flex: 1, textAlign: "right" },
						]}
					>
						Comments
					</Text>
					<Text
						style={[
							styles.tableHeaderCell,
							{ flex: 1, textAlign: "right" },
						]}
					>
						Shares
					</Text>
				</View>
				{filtered.map((post) => (
					<View key={post.id} style={styles.tableRow} wrap={false}>
						<Text style={[styles.tableCellBold, { flex: 4 }]}>
							{post.post}
						</Text>
						<Text
							style={[
								styles.tableCell,
								{ flex: 1, textAlign: "right" },
							]}
						>
							{post.likes}
						</Text>
						<Text
							style={[
								styles.tableCell,
								{ flex: 1, textAlign: "right" },
							]}
						>
							{post.comments}
						</Text>
						<Text
							style={[
								styles.tableCell,
								{ flex: 1, textAlign: "right" },
							]}
						>
							{post.shares}
						</Text>
					</View>
				))}
			</View>
		</View>
	);
};

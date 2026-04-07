import { View, Text } from "@react-pdf/renderer";
import { styles, af, afB, rowDir } from "../styles";
import { deltaStyle } from "./common";
import { t } from "@/src/lib/translations";
import type { DocumentData } from "@/src/store";

type Lang = "en" | "ar";

export const PerformanceMetrics = ({
	metrics,
	lang = "en",
}: {
	metrics: DocumentData["performanceMetrics"];
	lang?: Lang;
}) => {
	const filtered = metrics.filter((m) => m.metric);
	if (filtered.length === 0) return null;

	return (
		<View style={styles.section}>
			<Text style={[styles.sectionTitle, af(lang)]}>{t("Performance Metrics", lang)}</Text>
			{filtered.map((m) => (
				<View key={m.id} style={[styles.metricRow, rowDir(lang)]} wrap={false}>
					<Text style={[styles.metricLabel, afB(lang)]}>{m.metric}</Text>
					<View style={{ alignItems: lang === "ar" ? "flex-start" : "flex-end" }}>
						<Text style={[styles.metricValue, afB(lang)]}>{m.number}</Text>
						<Text style={deltaStyle(m.delta)}>{m.delta}</Text>
					</View>
				</View>
			))}
		</View>
	);
};

export const TopPostsTable = ({
	posts,
	lang = "en",
}: {
	posts: DocumentData["topPosts"];
	lang?: Lang;
}) => {
	const filtered = posts.filter((p) => p.post);
	if (filtered.length === 0) return null;

	return (
		<View style={styles.section}>
			<Text style={[styles.sectionTitle, af(lang)]}>{t("Top Posts", lang)}</Text>
			<View>
				<View style={[styles.tableHeaderRow, rowDir(lang)]}>
					<Text style={[styles.tableHeaderCell, { flex: 4 }, af(lang)]}>
						{t("Post", lang)}
					</Text>
					<Text
						style={[
							styles.tableHeaderCell,
							{ flex: 1, textAlign: lang === "ar" ? "left" : "right" },
							af(lang),
						]}
					>
						{t("Likes", lang)}
					</Text>
					<Text
						style={[
							styles.tableHeaderCell,
							{ flex: 1, textAlign: lang === "ar" ? "left" : "right" },
							af(lang),
						]}
					>
						{t("Comments", lang)}
					</Text>
					<Text
						style={[
							styles.tableHeaderCell,
							{ flex: 1, textAlign: lang === "ar" ? "left" : "right" },
							af(lang),
						]}
					>
						{t("Shares", lang)}
					</Text>
				</View>
				{filtered.map((post) => (
					<View key={post.id} style={[styles.tableRow, rowDir(lang)]} wrap={false}>
						<Text style={[styles.tableCellBold, { flex: 4 }, afB(lang)]}>
							{post.post}
						</Text>
						<Text
							style={[
								styles.tableCell,
								{ flex: 1, textAlign: lang === "ar" ? "left" : "right" },
								af(lang),
							]}
						>
							{post.likes}
						</Text>
						<Text
							style={[
								styles.tableCell,
								{ flex: 1, textAlign: lang === "ar" ? "left" : "right" },
								af(lang),
							]}
						>
							{post.comments}
						</Text>
						<Text
							style={[
								styles.tableCell,
								{ flex: 1, textAlign: lang === "ar" ? "left" : "right" },
								af(lang),
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

import { View, Text } from "@react-pdf/renderer";
import { styles, colors, af, afB, rowDir } from "../styles";
import { t } from "@/src/lib/translations";
import type { DocumentData } from "@/src/store";

type Lang = "en" | "ar";

export const formatDate = () =>
	new Date().toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

export const deltaStyle = (delta: string) =>
	delta.startsWith("-") ? styles.deltaNegative : styles.deltaPositive;

export const Header = ({ data, lang = "en" }: { data: DocumentData; lang?: Lang }) => (
	<View>
		<View style={[styles.headerRow, rowDir(lang)]}>
			<View>
				<Text style={[styles.docType, af(lang)]}>
					{data.type.replace(/_/g, " ")}
				</Text>
				<Text style={[styles.refLine, af(lang)]}>
					{t("Reference", lang)}: {data.projectTitle || t("Untitled Project", lang)} {" \u2022 "}{" "}
					{formatDate()}
				</Text>
			</View>
			<View style={{ alignItems: lang === "ar" ? "flex-start" : "flex-end" }}>
				<View style={styles.brandBox}>
					<Text style={styles.brandText}>GENBUZZ</Text>
				</View>
				<Text style={[styles.brandSub, lang === "ar" ? { textAlign: "left" } : {}]}>
					{t("Official Document", lang)}
				</Text>
			</View>
		</View>
		<View style={styles.dividerThick} />
	</View>
);

export const ClientInfo = ({ data, lang = "en" }: { data: DocumentData; lang?: Lang }) => (
	<View style={[styles.clientRow, rowDir(lang)]}>
		<View>
			<Text style={[styles.labelSmall, af(lang)]}>{t("Prepared For", lang)}</Text>
			<Text style={[styles.clientName, afB(lang)]}>
				{data.clientName || t("Client Name", lang)}
			</Text>
		</View>
		<View>
			<Text style={[styles.projectTitle, afB(lang), lang === "ar" ? { textAlign: "left" } : {}]}>
				{data.projectTitle || t("Project Description", lang)}
			</Text>
		</View>
	</View>
);

export const ExecutiveSummary = ({ text, lang = "en" }: { text: string; lang?: Lang }) => (
	<View style={styles.section}>
		<Text style={[styles.sectionTitle, af(lang)]}>{t("Executive Summary", lang)}</Text>
		<Text
			style={[
				styles.summaryText,
				af(lang),
				lang === "ar"
					? { borderLeftWidth: 0, borderRightWidth: 3, borderRightColor: colors.slate200, paddingLeft: 0, paddingRight: 16 }
					: {},
			]}
		>
			{text}
		</Text>
	</View>
);

export const TextSection = ({
	text,
	label,
	lang = "en",
}: {
	text: string;
	label: string;
	lang?: Lang;
}) => (
	<View style={styles.section}>
		<Text style={[styles.sectionTitle, af(lang)]}>{t(label, lang)}</Text>
		<Text style={[styles.bodyText, af(lang)]}>{text}</Text>
	</View>
);

export const TermsList = ({
	terms,
	label,
	lang = "en",
}: {
	terms: DocumentData["termsAndConditions"];
	label?: string;
	lang?: Lang;
}) => {
	const filtered = terms.filter((t) => t.text);
	if (filtered.length === 0) return null;

	return (
		<View style={styles.section}>
			<Text style={[styles.sectionTitle, af(lang)]}>
				{t(label || "Terms & Conditions", lang)}
			</Text>
			{filtered.map((clause, idx) => (
				<View key={clause.id} style={[styles.termRow, rowDir(lang)]} wrap={false}>
					<View style={[styles.termBadge, lang === "ar" ? { marginRight: 0, marginLeft: 10 } : {}]}>
						<Text style={styles.termNumber}>{idx + 1}</Text>
					</View>
					<Text style={[styles.termText, af(lang)]}>{clause.text}</Text>
				</View>
			))}
		</View>
	);
};

export const PageFooter = ({ lang = "en" }: { lang?: Lang }) => (
	<View style={[styles.footer, rowDir(lang)]} fixed>
		<Text style={[styles.footerTextItalic, af(lang)]}>GENBUZZ INTERNAL SYSTEMS</Text>
		<Text
			style={[styles.pageNumber, af(lang)]}
			render={({ pageNumber, totalPages }) =>
				`${pageNumber} / ${totalPages}`
			}
		/>
		<Text style={[styles.footerText, af(lang)]}>
			{t("Confidential", lang)} {"\u2022"} {new Date().getFullYear()}
		</Text>
	</View>
);

import { View, Text } from "@react-pdf/renderer";
import { styles } from "../styles";
import type { DocumentData } from "@/src/store";

export const formatDate = () =>
	new Date().toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

export const deltaStyle = (delta: string) =>
	delta.startsWith("-") ? styles.deltaNegative : styles.deltaPositive;

export const Header = ({ data }: { data: DocumentData }) => (
	<View>
		<View style={styles.headerRow}>
			<View>
				<Text style={styles.docType}>
					{data.type.replace(/_/g, " ")}
				</Text>
				<Text style={styles.refLine}>
					Reference: {data.projectTitle || "Untitled Project"} {" \u2022 "}{" "}
					{formatDate()}
				</Text>
			</View>
			<View style={{ alignItems: "flex-end" }}>
				<View style={styles.brandBox}>
					<Text style={styles.brandText}>GENBUZZ</Text>
				</View>
				<Text style={styles.brandSub}>Official Document</Text>
			</View>
		</View>
		<View style={styles.dividerThick} />
	</View>
);

export const ClientInfo = ({ data }: { data: DocumentData }) => (
	<View style={styles.clientRow}>
		<View>
			<Text style={styles.labelSmall}>Prepared For</Text>
			<Text style={styles.clientName}>
				{data.clientName || "Client Name"}
			</Text>
		</View>
		<View>
			<Text style={styles.projectTitle}>
				{data.projectTitle || "Project Description"}
			</Text>
		</View>
	</View>
);

export const ExecutiveSummary = ({ text }: { text: string }) => (
	<View style={styles.section}>
		<Text style={styles.sectionTitle}>Executive Summary</Text>
		<Text style={styles.summaryText}>{text}</Text>
	</View>
);

export const TextSection = ({
	text,
	label,
}: {
	text: string;
	label: string;
}) => (
	<View style={styles.section}>
		<Text style={styles.sectionTitle}>{label}</Text>
		<Text style={styles.bodyText}>{text}</Text>
	</View>
);

export const TermsList = ({
	terms,
	label,
}: {
	terms: DocumentData["termsAndConditions"];
	label?: string;
}) => {
	const filtered = terms.filter((t) => t.text);
	if (filtered.length === 0) return null;

	return (
		<View style={styles.section}>
			<Text style={styles.sectionTitle}>
				{label || "Terms & Conditions"}
			</Text>
			{filtered.map((clause, idx) => (
				<View key={clause.id} style={styles.termRow} wrap={false}>
					<View style={styles.termBadge}>
						<Text style={styles.termNumber}>{idx + 1}</Text>
					</View>
					<Text style={styles.termText}>{clause.text}</Text>
				</View>
			))}
		</View>
	);
};

export const PageFooter = () => (
	<View style={styles.footer} fixed>
		<Text style={styles.footerTextItalic}>GENBUZZ INTERNAL SYSTEMS</Text>
		<Text
			style={styles.pageNumber}
			render={({ pageNumber, totalPages }) =>
				`${pageNumber} / ${totalPages}`
			}
		/>
		<Text style={styles.footerText}>
			Confidential {"\u2022"} {new Date().getFullYear()}
		</Text>
	</View>
);

import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-latin" });
const notoArabic = Noto_Sans_Arabic({ subsets: ["arabic"], weight: ["400", "500", "600", "700", "900"], variable: "--font-arabic" });

export const metadata: Metadata = {
	title: "Document Builder",
	description: "Premium document generation",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" data-theme="lofi">
			<body
				className={`${jakarta.variable} ${notoArabic.variable} bg-base-200 text-base-content antialiased`}
				style={{ fontFamily: "var(--font-latin), var(--font-arabic), sans-serif" }}
			>
				{children}
			</body>
		</html>
	);
}

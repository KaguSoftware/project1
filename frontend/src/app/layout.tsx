import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

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
				className={`${jakarta.className} bg-base-200 text-base-content antialiased`}
			>
				{children}
			</body>
		</html>
	);
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "MindForge - AI-Powered Mind Mapping",
  description: "Transform your ideas into visual masterpieces with AI-powered collaborative mind mapping. Real-time collaboration, intelligent suggestions, and stunning visualizations.",
  keywords: ["mind mapping", "brainstorming", "collaboration", "AI", "productivity", "project planning"],
  authors: [{ name: "MindForge Team" }],
  openGraph: {
    title: "MindForge - AI-Powered Mind Mapping",
    description: "Transform your ideas into visual masterpieces with AI-powered collaborative mind mapping.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

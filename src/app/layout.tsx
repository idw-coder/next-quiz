import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Web開発者向けクイズ",
    template: "%s | Web開発者向けクイズ",
  },
  description: "Web開発者向けクイズカテゴリー一覧ページ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <main
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            maxWidth: "1000px",
            margin: "0 auto",
            minHeight: "calc(100vh - 48px - 1.2rem)",
            padding: "1rem",
          }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}

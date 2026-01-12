import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Script from "next/script";
import GoogleAdSense from "@/components/GoogleAdSense";
import QueryProvider from "@/providers/QueryProvider";

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
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const isDevelopment = process.env.NODE_ENV === "development";

  return (
    <html lang="en">
      <head>
        {clientId && !isDevelopment && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
            strategy="afterInteractive"
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
        suppressHydrationWarning
      >
        <QueryProvider>
          <Header />
          <main
            style={{
              flex: "1",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              maxWidth: "1000px",
              margin: "0 auto",
              // minHeight: "calc(100vh - 48px - 1.2rem)",
              padding: "1rem",
            }}
          >
            {children}
          </main>
          <footer
            style={{
              maxWidth: "1000px",
              margin: "0 auto",
              padding: "1rem",
              width: "100%",
            }}
          >
            <GoogleAdSense />
          </footer>
        </QueryProvider>
      </body>
    </html>
  );
}

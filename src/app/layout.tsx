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
    default: "Web開発者向けクイズ | 登録不要・完全無料のプログラミング学習・面接対策",
    template: "%s | Web開発者向けクイズ",
  },
  description: "エンジニアのための登録不要・完全無料クイズサイト。移動時間やスキマ時間に手軽にJavaScript, React, Next.jsなどの知識チェック。独学や面接対策に最適です。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const isDevelopment = process.env.NODE_ENV === "development";
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

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
        {/* Google Analytics */}
        {gaId && !isDevelopment && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <Script
              id="gtag-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
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
              // alignItems: "center",
              alignItems: "stretch",
              justifyContent: "center",
              maxWidth: "1000px",
              width: "100%",
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

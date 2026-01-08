import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Web開発者向けクイズ",
  description: "Web開発者向けクイズカテゴリー一覧ページ",
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


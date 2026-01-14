import type { Metadata } from "next";
import axios from "axios";

type Props = {
  params: { categoryId: string };
};

type Category = {
  id: number;
  category_name: string;
  description: string;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { categoryId } = await params;
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    const { data: categories } = await axios.get<Category[]>(`${API_BASE_URL}/quiz/categories`);
    
    const category = categories.find((category) => category.id === Number(categoryId));

    if (category) {
      return {
        title: `${category.category_name} | Web開発者向けクイズ`,
        description: category.description || `${category.category_name}のクイズ一覧`,
      };
    }
  } catch (error) {
    console.error("Failed to generate metadata:", error);
  }

  return {
    title: "クイズ一覧 | Web開発者向けクイズ",
    description: "Web開発者向けクイズカテゴリー一覧ページ",
  };
}

export default function QuizCategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


import type { Metadata } from "next";
import { quizRepository } from "@/lib/quiz.repository";

type Props = {
  params: { categoryId: string; quizId: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const quizzes = await quizRepository.listByCategory(Number(params.categoryId));  
    const quiz = quizzes.find((quiz) => quiz.id === Number(params.quizId));

    if (quiz) {
      // 問題文が長い場合は最初の50文字程度に制限
      const questionPreview = quiz.question.length > 50 
        ? quiz.question.substring(0, 50) + "..." 
        : quiz.question;

      // TODO アプリ名、タイトル
      return {
        title: `${questionPreview} | Web開発者向けクイズ`,
        description: quiz.question,
      };
    }
  } catch (error) {
    console.error("Failed to generate metadata:", error);
  }

  return {
    title: "クイズ問題 | Web開発者向けクイズ",
    description: "Web開発者向けクイズ問題ページ",
  };
}

export default function QuizPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


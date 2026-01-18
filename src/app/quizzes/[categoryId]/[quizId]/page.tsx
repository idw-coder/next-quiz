import { notFound } from "next/navigation";
import Link from "next/link";
import AnswerForm from "./AnswerForm";
import EditButton from "./EditButton";
import { quizRepository } from "@/lib/quiz.repository";
import { Metadata } from "next";

type Props = {
  params: Promise<{ categoryId: string; quizId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { quizId } = await params;
  try {
    const { quiz } = await quizRepository.getQuizWithChoices(Number(quizId));
    
    // 問題文をタイトルに設定（長すぎる場合は省略）
    const title = quiz.question.length > 50 
      ? `Q. ${quiz.question.substring(0, 50)}...` 
      : `Q. ${quiz.question}`;

    return {
      title: title,
      description: `【解説付き・登録不要】${quiz.question}。移動時間のスキマに手軽に知識チェック。Web開発者向け無料クイズでプログラミング学習や面接対策を効率化しよう。`,
    };
  } catch (error) {
    return {
      title: "クイズ問題",
      description: "登録不要で手軽に挑戦できるWeb開発者向けクイズ。移動時間やスキマ時間の学習、面接対策に最適。完全無料でプログラミング知識をチェック。",
    };
  }
}

export default async function QuizPage({ params }: Props) {
  const { categoryId, quizId } = await params;

  try {
    const { quiz, choices } = await quizRepository.getQuizWithChoices(Number(quizId));
    return (
      <div className="w-full">
        <div className="flex justify-between items-center mb-4">
          <Link href={`/quizzes/${categoryId}`}>
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors">
              <span className="bg-current rounded-full p-1 flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </span>
              一覧に戻る
            </button>
          </Link>

          <EditButton categoryId={categoryId} quizId={quizId} />
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-base font-medium mb-4 text-gray-900">
            {quiz.question}
          </h2>
          <AnswerForm choices={choices} explanation={quiz.explanation} />
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}
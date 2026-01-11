"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AnswerForm from "./AnswerForm";
import { quizRepository, Quiz, Choice } from "@/lib/quiz.repository";
import { useAuth } from "@/hooks/useAuth";

export default function QuizPage() {
  const params = useParams();
  const categoryId = params.categoryId as string;
  const quizId = params.quizId as string;
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [quizChoices, setQuizChoices] = useState<Choice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const hasEditorOrMore = user?.role ? ['admin', 'author', 'moderator'].includes(user.role) : false;

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const { quiz, choices } = await quizRepository.getQuizWithChoices(Number(quizId));
        setQuiz(quiz);
        setQuizChoices(choices);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "問題の取得に失敗しました"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  if (loading) {
    return <div className="p-4">読み込み中...</div>;
  }

  if (error || !quiz) {
    return <div className="p-4 text-red-600">{error || "問題が見つかりません"}</div>;
  }

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

        {(hasEditorOrMore) && (
          <Link href={`/quizzes/${categoryId}/${quizId}/edit`}>
            <button className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-700 transition-colors">
              編集する
            </button>
          </Link>
        )}
      </div>
      

      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-base font-medium mb-4 text-gray-900">
          {quiz.question}
        </h2>
        <AnswerForm choices={quizChoices} explanation={quiz.explanation} />
      </div>
    </div>
  );
}

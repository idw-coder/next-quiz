"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { quizRepository, QuizWithChoices } from "@/lib/quiz.repository";
import AnswerForm from "../components/AnswerForm";
import { use } from "react";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";


type Phase = "playing" | "finished"; // TODO

interface Result {
    quizId: number;
    isCorrect: boolean;
}

export default function RandomQuizPage({
    params,
    searchParams,
}: {
    params: Promise<{ categoryId: string }>;
    searchParams: Promise<{ ids?: string }>;
}) {
    const { categoryId } = use(params); // TODO
    const { ids } = use(searchParams); //
    const categoryIdNum = Number(categoryId);

    const idArray = ids ? ids.split(",").map(Number) : undefined;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [results, setResults] = useState<Result[]>([]);
    const [phase, setPhase] = useState<Phase>("playing");

    const { data: quizzes, isLoading, error } = useQuery({
        queryKey: ["randomQuizzes", categoryIdNum, ids], //
        queryFn: () => quizRepository.getRandomQuizzes(categoryIdNum, 5, idArray),
    });

    const handleAnswered = (isCorrect: boolean) => { //
        if (!quizzes) return; //
        const currentQuiz = quizzes[currentIndex];
        setResults((prev) => [...prev, { quizId: currentQuiz.quiz.id, isCorrect }]);
    };

    const handleNext = () => {
        if (!quizzes) return;
        if (currentIndex + 1 >= quizzes.length) {
            setPhase("finished");
        } else {
            setCurrentIndex((prev) => prev + 1);
        }
    }

    if (isLoading) {
        return (
          <div className="w-full max-w-5xl mx-auto">
            <div className="text-center py-8">
              <p className="text-gray-600">問題を読み込み中...</p>
            </div>
          </div>
        );
      }
    
      // エラー
      if (error || !quizzes || quizzes.length === 0) {
        return (
          <div className="w-full max-w-5xl mx-auto">
            <div className="text-center py-8">
              <p className="text-red-600">
                {error ? "問題の取得に失敗しました" : "このカテゴリーには問題がありません"}
              </p>
            </div>
          </div>
        );
      }
    
      // 結果画面
      if (phase === "finished") {
        const correctCount = results.filter((r) => r.isCorrect).length;
        return (
          <div className="w-full max-w-5xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-bold text-center mb-4">結果発表</h2>
              <p className="text-center text-2xl font-bold mb-6">
                {quizzes.length}問中{correctCount}問正解
              </p>
              <div className="flex flex-col gap-2 mb-6">
                {results.map((result, index) => (
                  <div
                    key={result.quizId}
                    className={`p-2 rounded text-sm ${
                      result.isCorrect
                        ? "bg-green-50 text-green-800"
                        : "bg-red-50 text-red-800"
                    }`}
                  >
                    第{index + 1}問: {result.isCorrect ? "正解" : "不正解"}
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-4">
                <Link
                  href={`/quizzes/${categoryId}`}
                  className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
                >
                  一覧に戻る
                </Link>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  もう一度挑戦
                </button>
              </div>
            </div>
          </div>
        );
      }
    
      // 問題表示
      const currentQuiz = quizzes[currentIndex];
      const hasAnswered = results.length > currentIndex;
    
      return (
        <div className="w-full max-w-5xl mx-auto">
          <Link
            href={`/quizzes/${categoryId}`}
            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowBackIcon fontSize="small" />
            一覧に戻る
          </Link>
    
          <div className="mb-4 text-sm text-gray-600 text-center">
            第{currentIndex + 1}問 / 全{quizzes.length}問
          </div>
    
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-base font-medium mb-4 text-gray-900">
              {currentQuiz.quiz.question}
            </h2>
            <AnswerForm
              key={currentQuiz.quiz.id}
              quizId={currentQuiz.quiz.id}
              categoryId={categoryIdNum}
              choices={currentQuiz.choices}
              explanation={currentQuiz.quiz.explanation}
              onAnswered={handleAnswered}
              showNextButton={hasAnswered}
              onNext={handleNext}
            />
          </div>
        </div>
      );
}
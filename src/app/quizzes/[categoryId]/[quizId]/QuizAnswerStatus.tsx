"use client";

import { useQuizHistory } from "@/hooks/useQuizHistory";
import { FaCheck } from "react-icons/fa6";
import { FaXmark } from "react-icons/fa6";

interface Props {
    quizId: number;
}

export default function QuizAnswerStatus({ quizId }: Props) {
    const { getLatestAnswer, getAnswerHistory } = useQuizHistory();
    const latest = getLatestAnswer(quizId);
    const history = getAnswerHistory(quizId);

    if (!latest || history.length === 0) return null;

    // 正答率の計算
    const correctCount = history.filter(h => h.isCorrect).length;
    const accuracyRate = Math.round((correctCount / history.length) * 100);

    return (
        <div className="inline-flex items-center gap-2 text-xs bg-gray-100 rounded-full px-3 py-1.5 ml-auto">
            {/* 前回結果 */}
            <div className="flex items-center gap-1.5">
                {latest.isCorrect ? (
                    <>
                        <span className="text-emerald-600 font-medium">前回</span>
                        <FaCheck className="w-3.5 h-3.5 text-emerald-500" />
                    </>
                ) : (
                    <>
                        <span className="text-rose-600 font-medium">前回</span>
                        <FaXmark className="w-3.5 h-3.5 text-rose-500" />
                    </>
                )}
            </div>

            {/* 正答率 */}
            <div className="flex items-center gap-1">
                <span className="text-gray-500">正答率</span>
                <span className="font-bold text-gray-700 min-w-8 text-right">{accuracyRate}%</span>
                <span className="text-[10px] text-gray-400">({history.length}回)</span>
            </div>
        </div>
    );
}
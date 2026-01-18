"use client";

import { useQuizHistory } from "@/hooks/useQuizHistory";

interface Props {
    quizId: number;
}

export default function QuizAnswerStatus({ quizId }: Props) {
    const { getLatestAnswer } = useQuizHistory();
    const latest = getLatestAnswer(quizId);

    if (!latest) return null;

    return (
        <span className="ml-2 text-xs">
            {latest.isCorrect ? <span className="text-green-500">前回正解</span> : <span className="text-red-500">前回不正解</span>}
        </span>
    );
}
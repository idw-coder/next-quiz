"use client";

import Link from "next/link";
import { useState } from "react";
import ReplayIcon from "@mui/icons-material/Replay";
import { useQuizHistory } from "@/hooks/useQuizHistory";


export default function QuizModeSelector({ categoryId }: { categoryId: string }) {
    const [count, setCount] = useState(5);
    const { getWrongQuizIdsByCategory } = useQuizHistory();

    const wrongIds = getWrongQuizIdsByCategory(Number(categoryId));

    return (
        <>
            <div className="flex justify-center gap-2 mb-6">
                <select 
                    value={count} 
                    onChange={(e) => setCount(Number(e.target.value))}
                    className="border rounded px-2 py-2 text-sm"
                >
                    <option value={5}>5問</option>
                    <option value={10}>10問</option>
                    <option value={20}>20問</option>
                </select>
                
                <Link
                    href={`/quizzes/${categoryId}/random?count=${count}`}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                    ランダム出題
                </Link>
            </div>

            {wrongIds.length > 0 && (
                <div className="flex justify-center gap-4 mb-6">
                    <Link
                        href={`/quizzes/${categoryId}/random?ids=${wrongIds.join(",")}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white text-sm rounded hover:bg-orange-700"
                    >
                        <ReplayIcon fontSize="small" />
                        間違えた問題（{wrongIds.length}問）
                    </Link>
                </div>
            )}
        </>
    )
}
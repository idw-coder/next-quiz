"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ReplayIcon from "@mui/icons-material/Replay";
import { useQuizHistory } from "@/hooks/useQuizHistory";
import { quizRepository } from "@/lib/quiz.repository";
import { Checkbox } from "@/components/ui/checkbox";

export default function QuizModeSelector({ categoryId }: { categoryId: string }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [count, setCount] = useState(5);
    const { getWrongQuizIdsByCategory } = useQuizHistory();

    const tagIdsParam = searchParams.get("tag_ids");
    const selectedTagIds = tagIdsParam ? tagIdsParam.split(",").map(Number) : [];

    const wrongIds = getWrongQuizIdsByCategory(Number(categoryId));

    const { data: tags, isLoading: tagsLoading } = useQuery({
        queryKey: ["tags", categoryId],
        queryFn: () => quizRepository.fetchTagsByCategory(Number(categoryId)),
    });

    // タグ選択時に即反映
    const handleTagChange = (tagId: number, checked: boolean) => {
        const newTagIds = checked
            ? [...selectedTagIds, tagId]
            : selectedTagIds.filter((id) => id !== tagId);
        
        const params = new URLSearchParams();
        if (newTagIds.length > 0) {
            params.set("tag_ids", newTagIds.join(","));
        }
        router.push(`/quizzes/${categoryId}?${params.toString()}`);
    };

    // ランダム出題URL生成
    const buildRandomUrl = () => {
        const params = new URLSearchParams();
        params.set("count", String(count));
        if (selectedTagIds.length > 0) {
            params.set("tag_ids", selectedTagIds.join(","));
        }
        return `/quizzes/${categoryId}/random?${params.toString()}`;
    };

    return (
        <>
            {!tagsLoading && tags && tags.length > 0 && (
                <div className="mb-4">
                    <div className="flex flex-wrap justify-center items-center gap-3">
                        {tags.map((tag) => (
                            <label
                                key={tag.id}
                                className="flex items-center gap-1.5 text-sm cursor-pointer"
                            >
                                <Checkbox
                                    id={`tag-${tag.id}`}
                                    checked={selectedTagIds.includes(tag.id)}
                                    onCheckedChange={(checked) =>
                                        handleTagChange(tag.id, checked === true)
                                    }
                                />
                                <span>{tag.tag_name}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex justify-center items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border rounded">
                        <span className="text-sm text-gray-600">ランダム出題</span>
                        <select 
                            value={count} 
                            onChange={(e) => setCount(Number(e.target.value))}
                            className="border rounded px-2 py-1 text-xs bg-white"
                        >
                            <option value={5}>5問</option>
                            <option value={10}>10問</option>
                            <option value={20}>20問</option>
                        </select>
                        <Link
                            href={buildRandomUrl()}
                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                        >
                            スタート
                        </Link>
                    </div>
                </div>

                {wrongIds.length > 0 && (
                    <Link
                        href={`/quizzes/${categoryId}/random?ids=${wrongIds.join(",")}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 border border-amber-300 text-sm rounded hover:bg-amber-200"
                    >
                        <ReplayIcon fontSize="small" />
                        間違えた問題を復習（{wrongIds.length}問）
                    </Link>
                )}
            </div>
        </>
    );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ReplayIcon from "@mui/icons-material/Replay";
import { useQuizHistory } from "@/hooks/useQuizHistory";
import { quizRepository } from "@/lib/quiz.repository";
import { Checkbox } from "@/components/ui/checkbox";

export default function QuizModeSelector({ categoryId }: { categoryId: string }) {
    const [count, setCount] = useState(5);
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
    const { getWrongQuizIdsByCategory } = useQuizHistory();

    const wrongIds = getWrongQuizIdsByCategory(Number(categoryId));

    const { data: tags, isLoading: tagsLoading } = useQuery({
        queryKey: ["tags", categoryId],
        queryFn: () => quizRepository.fetchTagsByCategory(Number(categoryId)),
    });

    const handleTagChange = (tagId: number, checked: boolean) => {
        if (checked) {
            setSelectedTagIds((prev) => [...prev, tagId]);
        } else {
            setSelectedTagIds((prev) => prev.filter((id) => id !== tagId));
        }
    };

    // タグパラメータを含むURL生成
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
            {/* タグ選択UI */}
            {!tagsLoading && tags && tags.length > 0 && (
                <div className="mb-6">
                    <p className="text-sm text-gray-600 text-center mb-2">タグで絞り込み（AND検索）</p>
                    <div className="flex flex-wrap justify-center gap-3">
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
                    href={buildRandomUrl()}
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
    );
}

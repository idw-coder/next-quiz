"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Image, Eye, Pencil, RotateCcw, Trash2 } from "lucide-react";

interface CategoryCardProps {
    category: {
        id: number;
        category_name: string;
        description: string;
        deleted_at?: string | null;
        created_at: string;
        updated_at: string;
    };
        hasEditorOrMore: boolean;
        onDelete: (id: number) => void;
        onRestore: (id: number) => void;
}

export default function CategoryCard({
    category,
    hasEditorOrMore,
    onDelete,
    onRestore,
}: CategoryCardProps) {
    const router = useRouter();

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <Card className={`pt-0 pb-0 gap-0 overflow-hidden ${category.deleted_at ? "opacity-75 bg-gray-50" : ""}`}>
      <div className="flex flex-row sm:flex-col">
        {/* 画像エリア：スマホは左側固定幅、デスクトップは上部全幅 */}
        <div className="w-20 sm:w-full sm:aspect-video bg-gray-50 flex items-center justify-center border-r sm:border-r-0 sm:border-b border-gray-100 flex-shrink-0">
          <Image className="w-8 h-8 sm:w-12 sm:h-12 text-gray-300" strokeWidth={1.5} />
        </div>

        {/* コンテンツエリア：スマホは右側、デスクトップは下部 */}
        <div className="flex-1 flex flex-col justify-center gap-2 py-2">
          <CardHeader className="py-0 sm:py-4">
            <CardTitle className="line-clamp-1 text-sm sm:text-base">{category.category_name}</CardTitle>
            <CardDescription className="line-clamp-1 sm:line-clamp-2 text-xs sm:text-sm">
              {category.description || "説明はありません。"}
            </CardDescription>
          </CardHeader>

          <CardContent className="py-0 sm:py-2">
            <div className="flex items-center justify-between gap-2">
              <Button size="sm" className="h-7 sm:h-9 text-xs sm:text-sm" onClick={() => router.push(`/quizzes/${category.id}`)}>
                開始
              </Button>

              {hasEditorOrMore && (
                <div className="flex gap-0.5 sm:gap-1">
                  <button
                    onClick={() => router.push(`/quiz-categories/${category.id}`)}
                    title="詳細"
                    className="p-1.5 sm:p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    onClick={() => router.push(`/quiz-categories/${category.id}/edit`)}
                    title="編集"
                    className="p-1.5 sm:p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                  {category.deleted_at ? (
                    <button
                      onClick={() => onRestore(category.id)}
                      title="復元"
                      className="p-1.5 sm:p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => onDelete(category.id)}
                      title="削除"
                      className="p-1.5 sm:p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </div>
      </div>

      {hasEditorOrMore && (
        <CardFooter className="text-[10px] text-gray-400 grid grid-cols-2 gap-y-1 py-2 border-t border-gray-100">
          <div>作成: {formatDate(category.created_at)}</div>
          <div>更新: {formatDate(category.updated_at)}</div>
          {category.deleted_at && (
            <div className="col-span-2 text-red-400">
              削除: {formatDate(category.deleted_at)}
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
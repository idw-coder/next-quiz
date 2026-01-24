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

//   // アイコンコンポーネント
//   const NoImageIcon = () => (
//     <svg className="w-8 h-8 sm:w-12 sm:h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//     </svg>
//   );

//   const VisibilityIcon = () => (
//     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//     </svg>
//   );

//   const EditIcon = () => (
//     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//     </svg>
//   );

//   const RestoreIcon = () => (
//     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//     </svg>
//   );

//   const DeleteIcon = () => (
//     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//     </svg>
//   );

  return (
    <Card className={category.deleted_at ? "opacity-75 bg-gray-50" : ""}>
      <div className="w-24 sm:w-full aspect-square sm:aspect-video bg-gray-50 flex items-center justify-center border-r sm:border-r-0 sm:border-b border-gray-100 flex-shrink-0">
        <Image className="w-12 h-12 text-gray-300" strokeWidth={1.5} />
      </div>

      <CardHeader>
        <CardTitle className="line-clamp-1">{category.category_name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {category.description || "説明はありません。"}
        </CardDescription>
    </CardHeader>
        
    <CardContent>
        <div className="flex items-center justify-between gap-2">
          <Button onClick={() => router.push(`/quizzes/${category.id}`)}>
            開始
          </Button>

          {hasEditorOrMore && (
            <div className="flex gap-1">
              <button
                onClick={() => router.push(`/quiz-categories/${category.id}`)}
                title="詳細"
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => router.push(`/quiz-categories/${category.id}/edit`)}
                title="編集"
                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Pencil className="w-4 h-4" />
              </button>
              {category.deleted_at ? (
                <button
                  onClick={() => onRestore(category.id)}
                  title="復元"
                  className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => onDelete(category.id)}
                  title="削除"
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </CardContent>

      {hasEditorOrMore && (
        <CardFooter className="text-[10px] text-gray-400 grid grid-cols-2 gap-y-1">
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
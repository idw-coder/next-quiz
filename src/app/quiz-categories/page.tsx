"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { quizRepository } from "@/lib/quiz.repository";
import { Button } from "@/components/ui/button";
import { Pencil, RotateCcw, Trash2, Plus } from "lucide-react";

export default function QuizCategoriesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ["categories"],
    queryFn: () => quizRepository.findAllCategory(),
    enabled: user?.role === "admin",
  });

  const handleDelete = async (id: number) => {
    if (!window.confirm("問題カテゴリーを削除してもよろしいですか？")) return;
    // TODO: バックエンドAPI実装後に有効化
    console.log("Delete category:", id);
  };

  const handleRestore = async (id: number) => {
    if (!window.confirm("問題カテゴリーを復元してもよろしいですか？")) return;
    // TODO: バックエンドAPI実装後に有効化
    console.log("Restore category:", id);
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString();

  if (authLoading || isLoading) {
    return <div className="w-full max-w-5xl mx-auto px-4 py-6 text-center text-gray-500">Loading...</div>;
  }

  if (user?.role !== "admin") {
    return <div className="w-full max-w-5xl mx-auto px-4 py-6 text-center text-red-500">アクセス権限がありません。</div>;
  }

  if (error) {
    return <div className="w-full max-w-5xl mx-auto px-4 py-6 text-center text-red-500">データの取得に失敗しました</div>;
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">カテゴリー管理</h1>
        <Button onClick={() => router.push("/quiz-categories/create")} size="sm">
          <Plus className="w-4 h-4 mr-1" />
          新規登録
        </Button>
      </div>

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="text-left p-2">ID</th>
            <th className="text-left p-2">カテゴリー名</th>
            <th className="text-left p-2 hidden sm:table-cell">作成日</th>
            <th className="text-left p-2 hidden sm:table-cell">更新日</th>
            <th className="text-left p-2">状態</th>
            <th className="text-right p-2">操作</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id} className={`border-b hover:bg-gray-50 ${cat.deleted_at ? "opacity-50" : ""}`}>
              <td className="p-2">{cat.id}</td>
              <td className="p-2">{cat.category_name}</td>
              <td className="p-2 hidden sm:table-cell">{formatDate(cat.created_at)}</td>
              <td className="p-2 hidden sm:table-cell">{formatDate(cat.updated_at)}</td>
              <td className="p-2">
                {cat.deleted_at ? <span className="text-red-500">削除済</span> : <span className="text-green-600">公開中</span>}
              </td>
              <td className="p-2 text-right">
                <div className="flex justify-end gap-1">
                  <button onClick={() => router.push(`/quiz-categories/${cat.id}/edit`)} title="編集" className="p-1 hover:bg-blue-50 rounded">
                    <Pencil className="w-4 h-4 text-blue-500" />
                  </button>
                  {cat.deleted_at ? (
                    <button onClick={() => handleRestore(cat.id)} title="復元" className="p-1 hover:bg-green-50 rounded">
                      <RotateCcw className="w-4 h-4 text-green-500" />
                    </button>
                  ) : (
                    <button onClick={() => handleDelete(cat.id)} title="削除" className="p-1 hover:bg-red-50 rounded">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

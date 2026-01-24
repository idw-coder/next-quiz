"use client";
import { useRouter } from "next/navigation";
import { quizRepository } from "@/lib/quiz.repository";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from '@tanstack/react-query'
import Link from "next/link";
import CategoryCard from "./components/CategoryCard";

interface QuizCategory {
  id: number;
  category_name: string;
  description: string;
  author_id: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  const hasEditorOrMore = user?.role ? ['admin', 'author', 'moderator'].includes(user.role) : false;

  // TODO
  const { data: categories = [], isLoading: loading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: () => quizRepository.findAllCategory(),
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("問題カテゴリーを削除してもよろしいですか？")) {
      return;
    }
    // TODO: バックエンドAPI実装後に有効化
  };

  const handleRestore = async (id: number) => {
    if (!window.confirm("問題カテゴリーを復元してもよろしいですか？")) {
      return;
    }
    // TODO: バックエンドAPI実装後に有効化
  };

  const AddIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-6">
        <div className="text-center text-gray-500">Loading...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-6">
        <div className="text-center text-red-500">
          {error instanceof Error ? error.message : "データの取得に失敗しました"}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      {hasEditorOrMore && (
        <div className="flex justify-end mb-6">
          <button
            onClick={() => router.push("/quiz-categories/create")}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm"
          >
            <AddIcon />
            問題カテゴリー新規登録
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <CategoryCard
          key={category.id}
          category={category}
          hasEditorOrMore={hasEditorOrMore}
          onDelete={handleDelete}
          onRestore={handleRestore}
        />
        ))}
      </div>
    </div>
  );
}

"use client";
import { useRouter } from "next/navigation";
import { quizRepository } from "@/lib/quiz.repository";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from '@tanstack/react-query'
import Link from "next/link";

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

  // アイコンコンポーネント
  const NoImageIcon = () => (
    <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );

  const AddIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );

  const VisibilityIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );

  const EditIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );

  const RestoreIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );

  const DeleteIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
    <div className="w-full max-w-5xl mx-auto px-4">
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
          <div
            key={category.id}
            className={`flex flex-col border rounded-xl overflow-hidden transition-all duration-200 hover:shadow-lg ${
              category.deleted_at ? "bg-gray-50 opacity-75 border-gray-200" : "bg-white border-gray-100 shadow-sm"
            }`}
          >
            {/* サムネイルエリア */}
            <div className="aspect-video bg-gray-50 flex items-center justify-center border-b border-gray-100">
              <NoImageIcon />
            </div>

            {/* コンテンツエリア */}
            <div className="p-5 flex flex-col flex-1">
              <div className="mb-2">
                <h3 className="font-bold text-lg text-gray-800 line-clamp-1">
                  {category.category_name}
                </h3>
              </div>
              
              <p className="text-gray-600 text-sm line-clamp-2 mb-6 flex-1">
                {category.description || "説明はありません。"}
              </p>

              <div className="flex items-center justify-between mt-auto">
                <Link
                  href={`/quizzes/${category.id}`}
                  className="inline-flex items-center justify-center px-6 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  prefetch={false}
                >
                  開始
                </Link>

                {hasEditorOrMore && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => router.push(`/quiz-categories/${category.id}`)}
                      title="詳細"
                      className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <VisibilityIcon />
                    </button>
                    <button
                      onClick={() => router.push(`/quiz-categories/${category.id}/edit`)}
                      title="編集"
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <EditIcon />
                    </button>
                    {category.deleted_at ? (
                      <button
                        onClick={() => handleRestore(category.id)}
                        title="復元"
                        className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <RestoreIcon />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleDelete(category.id)}
                        title="削除"
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <DeleteIcon />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* 管理者向けメタデータ */}
              {hasEditorOrMore && (
                <div className="mt-4 pt-4 border-t border-gray-100 text-[10px] text-gray-400 grid grid-cols-2 gap-y-1">
                  <div>作成: {formatDate(category.created_at)}</div>
                  <div>更新: {formatDate(category.updated_at)}</div>
                  {category.deleted_at && (
                    <div className="col-span-2 text-red-400">
                      削除: {formatDate(category.deleted_at)}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

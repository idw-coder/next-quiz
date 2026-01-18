"use client";
import { useRouter } from "next/navigation";
import { quizRepository } from "@/lib/quiz.repository";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from '@tanstack/react-query'

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
      <div className="w-full max-w-3xl mx-auto px-4 py-6">
        <div className="text-center text-gray-500">Loading...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="w-full max-w-3xl mx-auto px-4 py-6">
        <div className="text-center text-red-500">
          {error instanceof Error ? error.message : "データの取得に失敗しました"}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      {hasEditorOrMore && (
        <div className="flex justify-end mb-4">
          <button
            onClick={() => router.push("/quiz-categories/create")}
            className="inline-flex items-center gap-2 p-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <AddIcon />
            問題カテゴリー新規登録
          </button>
        </div>
      )}
      <div className="border rounded-sm overflow-hidden">
        <table
          className="w-full"
          style={{ fontSize: "clamp(10px, 3vw, 12px)" }}
        >
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-1 text-center w-16">No</th>
              <th className="p-1 text-left">カテゴリー名</th>
              <th className="p-1 text-left">説明</th>
              <th className="p-1 text-center w-20">クイズ</th>
              {hasEditorOrMore && (
                <>
                  <th className="p-1 text-center">作成日時</th>
                  <th className="p-1 text-center">更新日時</th>
                  <th className="p-1 text-center">削除日時</th>
                  <th className="p-1 text-center">操作</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y">
            {categories.map((category, index) => (
              <tr
                key={category.id}
                className={`hover:bg-gray-50 ${
                  category.deleted_at ? "bg-gray-100" : ""
                }`}
              >
                <td className="p-1 text-center">{index + 1}</td>
                <td className="p-1">{category.category_name}</td>
                <td className="p-1">{category.description}</td>
                <td className="p-1 text-center">
                  <button
                    onClick={() => router.push(`/quizzes/${category.id}`)}
                    className="px-2 py-1 text-xs border border-blue-500 text-blue-500 rounded hover:bg-blue-50"
                  >
                    開始
                  </button>
                </td>

                {hasEditorOrMore && (
                  <>
                    <td className="p-1 text-center">
                      {formatDate(category.created_at)}
                    </td>
                    <td className="p-1 text-center">
                      {formatDate(category.updated_at)}
                    </td>
                    <td className="p-1 text-center">
                      {category.deleted_at
                        ? formatDate(category.deleted_at)
                        : "---"}
                    </td>
                    <td className="p-1 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() =>
                            router.push(`/quiz-categories/${category.id}`)
                          }
                          title="詳細"
                          className="p-1 text-blue-500 hover:bg-blue-50 rounded"
                        >
                          <VisibilityIcon />
                        </button>
                        <button
                          onClick={() =>
                            router.push(`/quiz-categories/${category.id}/edit`)
                          }
                          title="編集"
                          className="p-1 text-blue-500 hover:bg-blue-50 rounded"
                        >
                          <EditIcon />
                        </button>
                        {category.deleted_at ? (
                          <button
                            onClick={() => handleRestore(category.id)}
                            title="復元"
                            className="p-1 text-blue-400 hover:bg-blue-50 rounded"
                          >
                            <RestoreIcon />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDelete(category.id)}
                            title="削除"
                            className="p-1 text-red-400 hover:bg-red-50 rounded"
                          >
                            <DeleteIcon />
                          </button>
                        )}
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

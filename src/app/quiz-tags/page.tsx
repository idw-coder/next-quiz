"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { quizRepository, QuizTag } from "@/lib/quiz.repository";

export default function QuizTagsPage() {
  const [tags, setTags] = useState<QuizTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 新規作成用
  const [newTagName, setNewTagName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [creating, setCreating] = useState(false);

  // 編集用
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTagName, setEditTagName] = useState("");
  const [editSlug, setEditSlug] = useState("");

  const fetchTags = async () => {
    try {
      setLoading(true);
      const data = await quizRepository.fetchTags();
      setTags(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "タグの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim() || !newSlug.trim()) return;

    try {
      setCreating(true);
      await quizRepository.createTag({ tag_name: newTagName, slug: newSlug });
      setNewTagName("");
      setNewSlug("");
      await fetchTags();
    } catch (err) {
      alert("作成に失敗しました");
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = (tag: QuizTag) => {
    setEditingId(tag.id);
    setEditTagName(tag.tag_name);
    setEditSlug(tag.slug);
  };

  const handleUpdate = async (id: number) => {
    if (!editTagName.trim() || !editSlug.trim()) return;

    try {
      await quizRepository.updateTag(id, { tag_name: editTagName, slug: editSlug });
      setEditingId(null);
      await fetchTags();
    } catch (err) {
      alert("更新に失敗しました");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("このタグを削除しますか？関連するクイズからも外れます。")) return;

    try {
      await quizRepository.deleteTag(id);
      await fetchTags();
    } catch (err) {
      alert("削除に失敗しました");
    }
  };

  if (loading) {
    return <div className="p-4">読み込み中...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <Link
        href="/home"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
      >
        ホームに戻る
      </Link>

      <h1 className="text-xl font-bold mb-6">クイズタグ管理</h1>

      {/* 新規作成フォーム */}
      <form onSubmit={handleCreate} className="mb-8 p-4 bg-gray-50 rounded-sm">
        <h2 className="font-medium mb-3">新規タグ作成</h2>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="タグ名"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
            required
          />
          <input
            type="text"
            placeholder="スラッグ（英数字）"
            value={newSlug}
            onChange={(e) => setNewSlug(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
            required
          />
          <button
            type="submit"
            disabled={creating}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
          >
            {creating ? "作成中..." : "作成"}
          </button>
        </div>
      </form>

      {/* タグ一覧 */}
      <div className="border rounded-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-2 py-1 text-left">タグ名</th>
              <th className="px-2 py-1 text-left">スラッグ</th>
              <th className="px-2 py-1 text-center w-32">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {tags.map((tag) => (
              <tr key={tag.id} className="hover:bg-gray-50">
                {editingId === tag.id ? (
                  <>
                    <td className="p-2">
                      <input
                        type="text"
                        value={editTagName}
                        onChange={(e) => setEditTagName(e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={editSlug}
                        onChange={(e) => setEditSlug(e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                      />
                    </td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => handleUpdate(tag.id)}
                        className="px-2 py-1 text-green-600 hover:bg-green-50 rounded text-xs mr-1"
                      >
                        保存
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded text-xs"
                      >
                        取消
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-2 py-1 text-xs">{tag.tag_name}</td>
                    <td className="px-2 py-1 text-gray-500 text-xs">{tag.slug}</td>
                    <td className="px-2 py-1 text-center text-xs">
                      <button
                        onClick={() => handleEdit(tag)}
                        className="px-2 py-1 text-blue-600 hover:bg-blue-50 rounded text-xs mr-1"
                      >
                        編集
                      </button>
                      <button
                        onClick={() => handleDelete(tag.id)}
                        className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-xs"
                      >
                        削除
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {tags.length === 0 && (
          <p className="text-center text-gray-500 py-8">タグがありません</p>
        )}
      </div>
    </div>
  );
}
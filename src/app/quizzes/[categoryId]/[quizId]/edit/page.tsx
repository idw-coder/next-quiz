"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { quizRepository, Quiz, Choice, QuizTag } from "@/lib/quiz.repository";

export default function QuizEditPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.categoryId as string;
  const quizId = params.quizId as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [choices, setChoices] = useState<Choice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [question, setQuestion] = useState("");
  const [explanation, setExplanation] = useState("");
  const [existingTags, setExistingTags] = useState<QuizTag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const { quiz, choices, tags } = await quizRepository.getQuizWithChoices(
          Number(quizId)
        );
        setQuiz(quiz);
        setChoices(choices);
        setQuestion(quiz.question);
        setExplanation(quiz.explanation);
        setSelectedTagIds(tags ? tags.map(t => t.id) : []);

        const categoryTags = await quizRepository.fetchTags();
        setExistingTags(categoryTags);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "問題の取得に失敗しました"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);
  const handleChoiceTextChange = (index: number, text: string) => {
    const newChoices = [...choices];
    newChoices[index].choice_text = text;
    setChoices(newChoices);
  };

  const handleChoiceCorrectChange = (index: number, isCorrect: boolean) => {
    const newChoices = [...choices];
    newChoices[index].is_correct = isCorrect;
    setChoices(newChoices);
  };

  const  handleTagToggle = (tagId: number) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
      );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await quizRepository.setQuizTagRelations(Number(quizId), selectedTagIds);
      alert("保存しました");
    } catch (err) {
      alert("保存に失敗しました");
    }
  };

  if (loading) {
    return <div className="p-4">読み込み中...</div>;
  }

  if (error || !quiz) {
    return (
      <div className="p-4 text-red-600">{error || "問題が見つかりません"}</div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-2">
      <div className="flex justify-between items-center mb-4">
        <Link href={`/quizzes/${categoryId}/${quizId}`}>
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors">
            <span className="bg-current rounded-full p-1 flex items-center justify-center">
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </span>
            戻る
          </button>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                問題文
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                解説
              </label>
              <textarea
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                正解を選択
              </label>
              <div className="space-y-3">
                {choices.map((choice, index) => (
                  <div key={choice.id} className="flex gap-3 items-center">
                    <input
                      type="radio"
                      checked={choice.is_correct}
                      onChange={() => {
                        const newChoices = choices.map((c, i) => ({
                          ...c,
                          is_correct: i === index,
                        }));
                        setChoices(newChoices);
                      }}
                      className="h-2 w-2 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <input
                        type="text"
                        value={choice.choice_text}
                        onChange={(e) =>
                          handleChoiceTextChange(index, e.target.value)
                        }
                        className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>

              {existingTags.length > 0 && (
                <div>
                  <label className="block font-medium text-gray-700 mb-2">
                    タグ
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {existingTags.map((tag) => (
                      <label
                        key={tag.id}
                        className={`flex items-center gap-1 px-2 py-1 border rounded cursor-pointer ${
                          selectedTagIds.includes(tag.id)
                            ? "bg-blue-100 border-blue-500"
                            : "bg-gray-50 border-gray-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedTagIds.includes(tag.id)}
                          onChange={() => handleTagToggle(tag.id)}
                          className="h-3 w-3"
                        />
                        <span>{tag.tag_name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between gap-3">
          <Link href={`/quizzes/${categoryId}/${quizId}`}>
            <button
              type="button"
              className="px-3 py-1 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
            >
              キャンセル
            </button>
          </Link>
          <button
            type="submit"
            className="px-3 py-1 text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
          >
            保存する
          </button>
        </div>
      </form>
    </div>
  );
}

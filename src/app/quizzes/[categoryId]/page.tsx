import Link from "next/link";
import { notFound } from "next/navigation"; //
import { quizRepository } from "@/lib/quiz.repository";
import { Metadata } from "next";
import Pagination from "./Pagination";
import QuizAnswerStatus from "./[quizId]/QuizAnswerStatus";
import QuizModeSelector from "./components/QuizModeSelector";

type Props = {
  params: Promise<{ categoryId: string }>;
  searchParams: Promise<{ page?: string; tag_ids?: string; keyword?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoryId } = await params;

  try {
    const categories = await quizRepository.findAllCategory();
    const category = categories.find((c) => c.id === Number(categoryId));
    if (category) {
      return {
        title: category.category_name,
        description:
          category.description || `${category.category_name}のクイズ一覧`,
      };
    }
  } catch (error) {
    console.error("Failed to generate metadata ", error);
  }

  return {
    title: "クイズ一覧",
    description: "Web開発者向けクイズカテゴリー一覧ページ",
  };
}

export default async function QuizListPage({ params, searchParams }: Props) {
  const { categoryId } = await params;
  const { page, tag_ids, keyword } = await searchParams;

  const currentPage = Math.max(1, Number(page) || 1);
  const perPage = 10;
  const tagIds = tag_ids ? tag_ids.split(",").map(Number) : undefined;

  const [categories, paginatedQuizzes] = await Promise.all([
    quizRepository.findAllCategory(),
    quizRepository.listByCategory(Number(categoryId), {
      page: currentPage,
      perPage,
      tagIds: tagIds,
      keyword: keyword,
    }),
  ]);

  const category = categories.find((cat) => cat.id === Number(categoryId));

  if (!category) {
    notFound(); //
  }

  const { data: quizzes, last_page, total } = paginatedQuizzes;
  const startNumber = (currentPage - 1) * perPage + 1;

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Link
        href="/home"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
      >
        ホームに戻る
      </Link>

      <h2 className="text-xl font-bold text-center mb-6">
        {category.category_name}
      </h2>
      <p className="text-center text-sm text-gray-500 mb-6">
        {category.description || "説明はありません。"}
      </p>

      <p className="text-center text-sm text-gray-500 mb-6">
        全{total}問中 {startNumber}〜
        {Math.min(startNumber + perPage - 1, total)}問を表示
      </p>

      <QuizModeSelector categoryId={categoryId} />


      <div className="border rounded-sm overflow-hidden">
        <table
          className="w-full"
          style={{ fontSize: "clamp(10px, 3vw, 12px)" }}
        >
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-1 text-center w-6">No.</th>
              <th className="p-1 text-left">問題</th>
              <th className="p-1 text-center w-14"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {quizzes.map((quiz, index) => (
              <tr key={quiz.id} className="hover:bg-gray-50">
                <td className="p-1 text-center align-middle">{startNumber + index}</td>
                <td className="p-1 align-middle">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <span>{quiz.question}</span>
                    <QuizAnswerStatus quizId={quiz.id} />
                  </div>
                </td>
                <td className="p-1 text-center align-middle">
                  <Link
                    href={`/quizzes/${categoryId}/${quiz.id}`}
                    className="inline-block px-2 py-1 border border-blue-500 text-blue-500 rounded hover:bg-blue-50"
                    prefetch={false}
                  >
                    解答
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {quizzes.length === 0 && (
        <p className="text-center text-gray-500 py-8">問題がありません</p>
      )}

      <Pagination
        currentPage={currentPage}
        lastPage={last_page}
        baseUrl={`/quizzes/${categoryId}`}
        tagIds={tag_ids}
        keyword={keyword}
      />
    </div>
  );
}

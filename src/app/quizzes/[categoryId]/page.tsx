import Link from "next/link";
import { notFound } from "next/navigation"; //
import { quizRepository } from "@/lib/quiz.repository";
import { Metadata } from "next";

type Props = {
  params: Promise<{ categoryId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoryId } = await params;

  try {
    const categories = await quizRepository.findAllCategory();
    const category = categories.find((c) => c.id === Number(categoryId));
    if (category) {
      return {
        title: category.category_name,
        description: category.description || `${category.category_name}のクイズ一覧`,
      };
    }
  } catch (error) {
    console.error("Failed to generate metadata ", error);
  }

  return {
    title: "クイズ一覧",
    description: "Web開発者向けクイズカテゴリー一覧ページ"
  }
}

export default async function QuizListPage({ params }: Props) {
  const { categoryId } = await params // TODO

  const [categories, quizzes] = await Promise.all([ // 
    quizRepository.findAllCategory(),
    quizRepository.listByCategory(Number(categoryId)),
  ])

  const category = categories.find((cat) => cat.id === Number(categoryId));

  if (!category) {
    notFound() //
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6">
      <Link
        href="/home"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
      >
        ホームに戻る
      </Link>

      <h2 className="text-xl font-bold text-center mb-6">
        {category.category_name}
      </h2>

      <div className="border rounded-sm overflow-hidden">
        <table className="w-full" style={{fontSize: "clamp(10px, 3vw, 12px)"}}>
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-3 py-1 text-center w-16">No.</th>
              <th className="px-3 py-1 text-left">問題</th>
              <th className="px-3 py-1 text-center w-20">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {quizzes.map((quiz, index) => (
              <tr key={quiz.id} className="hover:bg-gray-50">
                <td className="px-3 py-1 text-center">{index + 1}</td>
                <td className="px-3 py-1">{quiz.question}</td>
                <td className="px-3 py-1 text-center">
                  <Link
                    href={`/quizzes/${categoryId}/${quiz.id}`}
                    className="px-3 py-1 text-xs border border-blue-500 text-blue-500 rounded hover:bg-blue-50"
                  >
                    解く
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
    </div>
  )
}
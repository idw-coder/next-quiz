import { quizRepository, QuizCategory } from "@/lib/quiz.repository";
import CategoryCard from "./home/components/CategoryCard";

async function getCategories(): Promise<QuizCategory[]> {
  try {
    const categories = await quizRepository.findAllCategory();
    return categories;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

export default async function Home() {
  const categories = await getCategories();

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
          />
        ))}
      </div>
    </div>
  );
}

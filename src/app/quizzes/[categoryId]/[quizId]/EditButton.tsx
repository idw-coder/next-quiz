"use client";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

type Props = {
  categoryId: string;
  quizId: string;
};

export default function EditButton({ categoryId, quizId }: Props) {
  const { user } = useAuth();
  const hasEditorOrMore = user?.role
    ? ["admin", "author", "moderator"].includes(user.role)
    : false;

  if (!hasEditorOrMore) return null;

  return (
    <Link href={`/quizzes/${categoryId}/${quizId}/edit`}>
      <button className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-700 transition-colors">
        編集する
      </button>
    </Link>
  );
}

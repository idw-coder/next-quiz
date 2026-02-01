/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon } from "lucide-react";

interface CategoryCardProps {
  category: {
    id: number;
    category_name: string;
    description: string;
    thumbnail_path?: string | null;
    thumbnail_url?: string | null;
    deleted_at?: string | null;
    created_at: string;
    updated_at: string;
  };
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Card className={`pt-0 pb-0 gap-0 overflow-hidden ${category.deleted_at ? "opacity-75 bg-gray-50" : ""}`}>
      <div className="flex flex-row sm:flex-col">
        {/* 画像エリア：スマホは左側固定幅、デスクトップは上部全幅 */}
        <div className="w-28 h-28 sm:w-full sm:h-40 bg-gray-50 flex items-center justify-center border-r sm:border-r-0 sm:border-b border-gray-100 flex-shrink-0 overflow-hidden">
          {category.thumbnail_url ? (
            <img src={category.thumbnail_url} alt={category.category_name} className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-8 h-8 sm:w-12 sm:h-12 text-gray-300" strokeWidth={1.5} />
          )}
        </div>

        {/* コンテンツエリア：スマホは右側、デスクトップは下部 */}
        <div className="flex-1 flex flex-col justify-center gap-2 py-2">
          <CardHeader className="py-0 sm:py-4">
            <CardTitle className="line-clamp-1 text-sm sm:text-base">{category.category_name}</CardTitle>
            <CardDescription className="line-clamp-1 sm:line-clamp-2 text-xs sm:text-sm">
              {category.description || "説明はありません。"}
            </CardDescription>
          </CardHeader>

          <CardContent className="py-0 sm:py-2">
            <div className="flex items-center justify-between gap-2">
              <Link href={`/quizzes/${category.id}`}>
                <Button size="xs" className="text-xs">
                  開始
                </Button>
              </Link>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}

"use client";

import Link from "next/link";

interface Props {
    currentPage: number;
    lastPage: number;
    baseUrl: string;
    tagIds?: string;
}

export default function Pagination({ currentPage, lastPage, baseUrl, tagIds }: Props) {
    if (lastPage <= 1) return null;

    const buildUrl = (page: number) => {
        const params = new URLSearchParams();
        params.set("page", String(page));
        if (tagIds) {
            params.set("tag_ids", tagIds);
        }
        return `${baseUrl}?${params.toString()}`;
    };
  
    // 表示するページ番号を計算
    const getPageNumbers = (): (number | string)[] => {
      const pages: (number | string)[] = [];
      const showPages = 5; // 表示するページ数
      
      let start = Math.max(1, currentPage - Math.floor(showPages / 2));
      let end = Math.min(lastPage, start + showPages - 1);
      
      // startを調整
      if (end - start + 1 < showPages) {
        start = Math.max(1, end - showPages + 1);
      }
  
      // 最初のページ
      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push("...");
      }
  
      // 中間のページ
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
  
      // 最後のページ
      if (end < lastPage) {
        if (end < lastPage - 1) pages.push("...");
        pages.push(lastPage);
      }
  
      return pages;
    };
  
    const pageNumbers = getPageNumbers();
  
    return (
      <nav className="flex items-center justify-center gap-1 mt-6">
        {/* 前へボタン */}
        {currentPage > 1 ? (
          <Link
            href={buildUrl(currentPage - 1)}
            className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100"
            prefetch={false}
          >
            前へ
          </Link>
        ) : (
          <span className="px-3 py-1 text-xs border border-gray-200 rounded text-gray-300 cursor-not-allowed">
            前へ
          </span>
        )}
  
        {/* ページ番号 */}
        {pageNumbers.map((page, index) =>
          page === "..." ? (
            <span key={`ellipsis-${index}`} className="px-2 py-1 text-xs text-gray-500">
              ...
            </span>
          ) : (
            <Link
              key={page}
              href={buildUrl(page as number)}
              className={`px-3 py-1 text-xs border rounded ${
                currentPage === page
                  ? "bg-blue-500 text-white border-blue-500"
                  : "border-gray-300 hover:bg-gray-100"
              }`}
              prefetch={false}
            >
              {page}
            </Link>
          )
        )}
  
        {/* 次へボタン */}
        {currentPage < lastPage ? (
          <Link
            href={buildUrl(currentPage + 1)}
            className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100"
            prefetch={false}
          >
            次へ
          </Link>
        ) : (
          <span className="px-3 py-1 text-xs border border-gray-200 rounded text-gray-300 cursor-not-allowed">
            次へ
          </span>
        )}
      </nav>
    );
  }
import Link from "next/link";
import { supabase, CategorySummary } from "@/lib/supabase";

async function getCategories(): Promise<CategorySummary[]> {
  const { data, error } = await supabase
    .from("books")
    .select("category, scraped_at");

  if (error || !data) return [];

  const map = new Map<string, { count: number; last_scraped: string }>();
  for (const row of data) {
    const existing = map.get(row.category);
    if (!existing) {
      map.set(row.category, { count: 1, last_scraped: row.scraped_at });
    } else {
      existing.count++;
      if (row.scraped_at > existing.last_scraped) {
        existing.last_scraped = row.scraped_at;
      }
    }
  }

  return Array.from(map.entries())
    .map(([category, { count, last_scraped }]) => ({ category, count, last_scraped }))
    .sort((a, b) => a.category.localeCompare(b.category));
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Tokyo",
  });
}

export default async function HomePage() {
  const categories = await getCategories();

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📚 Books Catalogue</h1>
          <p className="text-gray-500">books.toscrape.com のスクレイピングデータ</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.category}
              href={`/${encodeURIComponent(cat.category)}`}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md hover:border-blue-300 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">📖</span>
                <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">
                  {cat.count}冊
                </span>
              </div>
              <h2 className="font-semibold text-gray-800 group-hover:text-blue-700 transition-colors leading-snug mb-2">
                {cat.category}
              </h2>
              <p className="text-xs text-gray-400">
                最終更新: {formatDate(cat.last_scraped)}
              </p>
            </Link>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center text-gray-400 py-20">
            データが見つかりません。Supabaseの接続設定を確認してください。
          </div>
        )}

        <footer className="mt-16 text-center text-xs text-gray-400">
          合計 {categories.reduce((sum, c) => sum + c.count, 0)} 冊 ·{" "}
          {categories.length} カテゴリ
        </footer>
      </div>
    </main>
  );
}

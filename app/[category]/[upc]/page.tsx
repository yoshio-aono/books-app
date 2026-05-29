import { notFound } from "next/navigation";
import { supabase, Book } from "@/lib/supabase";
import Breadcrumb from "@/components/Breadcrumb";
import StarRating from "@/components/StarRating";
import TranslationSection from "@/components/TranslationSection";

async function getBook(upc: string): Promise<Book | null> {
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .eq("upc", upc)
    .single();

  if (error || !data) return null;
  return data;
}

type Props = {
  params: Promise<{ category: string; upc: string }>;
};

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

export default async function BookDetailPage({ params }: Props) {
  const { category, upc } = await params;
  const decoded = decodeURIComponent(category);
  const book = await getBook(upc);

  if (!book) notFound();

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Breadcrumb
          crumbs={[
            { label: "カテゴリ一覧", href: "/" },
            { label: decoded, href: `/${encodeURIComponent(decoded)}` },
            { label: book.title },
          ]}
        />

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="mb-1">
            <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">
              {book.category}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mt-3 mb-4 leading-snug">
            {book.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="text-3xl font-bold text-green-600">
              £{book.price.toFixed(2)}
            </span>
            <StarRating rating={book.rating} size="lg" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6 bg-gray-50 rounded-lg p-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">UPC</p>
              <p className="font-mono text-sm text-gray-800">{book.upc}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">在庫</p>
              <p className={`text-sm font-semibold ${book.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                {book.stock > 0 ? `${book.stock}冊` : "在庫なし"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">取得日時</p>
              <p className="text-sm text-gray-600">{formatDate(book.scraped_at)}</p>
            </div>
          </div>

          {book.description && (
            <div className="mb-2">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">概要（英語）</h2>
              <p className="text-gray-600 leading-relaxed">{book.description}</p>
            </div>
          )}

          <TranslationSection
            upc={book.upc}
            title={book.title}
            description={book.description}
          />
        </div>
      </div>
    </main>
  );
}

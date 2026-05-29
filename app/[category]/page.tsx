import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase, Book } from "@/lib/supabase";
import Breadcrumb from "@/components/Breadcrumb";
import StarRating from "@/components/StarRating";

async function getBooksByCategory(category: string): Promise<Book[]> {
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .eq("category", category)
    .order("title");

  if (error) return [];
  return data ?? [];
}

type Props = {
  params: Promise<{ category: string }>;
};

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const decoded = decodeURIComponent(category);
  const books = await getBooksByCategory(decoded);

  if (books.length === 0) notFound();

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <Breadcrumb
          crumbs={[
            { label: "カテゴリ一覧", href: "/" },
            { label: decoded },
          ]}
        />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">{decoded}</h1>
          <p className="text-gray-500">{books.length}冊</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.map((book) => (
            <Link
              key={book.upc}
              href={`/${encodeURIComponent(decoded)}/${book.upc}`}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-blue-300 transition-all group"
            >
              <h2 className="font-semibold text-gray-800 group-hover:text-blue-700 transition-colors leading-snug mb-3 line-clamp-3">
                {book.title}
              </h2>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-lg font-bold text-green-600">
                  £{book.price.toFixed(2)}
                </span>
                <StarRating rating={book.rating} size="sm" />
              </div>
              <div className="mt-2 text-xs text-gray-400">
                在庫: {book.stock > 0 ? `${book.stock}冊` : "在庫なし"}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

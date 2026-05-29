"use client";

import { useState, useEffect } from "react";

type Props = {
  upc: string;
  title: string;
  description: string;
};

export default function TranslationSection({ upc, title, description }: Props) {
  const [translation, setTranslation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cacheKey = `translation_${upc}`;

  useEffect(() => {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      setTranslation(cached);
    }
  }, [cacheKey]);

  const handleTranslate = async () => {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      setTranslation(cached);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      if (!res.ok) {
        throw new Error(`翻訳に失敗しました (${res.status})`);
      }

      const data = await res.json();
      sessionStorage.setItem(cacheKey, data.translation);
      setTranslation(data.translation);
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 border-t pt-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">日本語翻訳</h2>

      {!translation && !loading && (
        <button
          onClick={handleTranslate}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg transition-colors shadow-sm"
        >
          🤖 Claude AIで日本語に翻訳する
        </button>
      )}

      {loading && (
        <div className="flex items-center gap-3 text-gray-500">
          <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full" />
          <span>Claude AIが翻訳中...</span>
        </div>
      )}

      {error && (
        <div className="text-red-500 bg-red-50 border border-red-200 rounded-lg p-3">
          {error}
        </div>
      )}

      {translation && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{translation}</p>
          <p className="text-xs text-blue-400 mt-3 text-right">✨ Claude AIによる翻訳（セッションキャッシュ済み）</p>
        </div>
      )}
    </div>
  );
}

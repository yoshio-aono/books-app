import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Books Catalogue",
  description: "books.toscrape.com のスクレイピングデータ閲覧サイト",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <footer className="text-center text-xs text-gray-400 py-4">
          データ出所：<a href="https://books.toscrape.com" target="_blank" rel="noopener noreferrer" className="hover:underline">books.toscrape.com</a>
        </footer>
      </body>
    </html>
  );
}

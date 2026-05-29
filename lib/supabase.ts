import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Book = {
  id: number;
  title: string;
  price: number;
  rating: number;
  upc: string;
  stock: number;
  description: string;
  category: string;
  scraped_at: string;
};

export type CategorySummary = {
  category: string;
  count: number;
  last_scraped: string;
};

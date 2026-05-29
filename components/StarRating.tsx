"use client";

type Props = {
  rating: number;
  size?: "sm" | "md" | "lg";
};

export default function StarRating({ rating, size = "md" }: Props) {
  const sizes = { sm: "text-sm", md: "text-lg", lg: "text-2xl" };
  return (
    <span className={sizes[size]} aria-label={`${rating}つ星`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"}>
          ★
        </span>
      ))}
    </span>
  );
}

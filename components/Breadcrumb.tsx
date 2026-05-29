import Link from "next/link";

type Crumb = { label: string; href?: string };

type Props = { crumbs: Crumb[] };

export default function Breadcrumb({ crumbs }: Props) {
  return (
    <nav className="text-sm text-gray-500 mb-6 flex items-center gap-1 flex-wrap">
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <span>/</span>}
          {crumb.href ? (
            <Link href={crumb.href} className="hover:text-blue-600 hover:underline transition-colors">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-gray-800 font-medium">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

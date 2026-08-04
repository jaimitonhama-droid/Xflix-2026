// ============================================================
// XFLIX — TypeScript Types
// Category Types
// ============================================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  videoCount?: number;
  isFeatured?: boolean;
}

export interface CategoryCardProps {
  category: Category;
  className?: string;
  onClick?: (category: Category) => void;
}

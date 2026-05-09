import portfolioData from "../content/portfolio.json";

export interface PortfolioGalleryImage {
  image: string;
  alt: string;
  caption?: string;
}

export interface PortfolioItem {
  id: string;
  published?: boolean;
  sortOrder?: number;
  title: string;
  category: string;
  summary: string;
  description?: string;
  image: string;
  alt: string;
  location: string;
  featured: boolean;
  gallery?: PortfolioGalleryImage[];
}

export const portfolioItems = (portfolioData.portfolio as PortfolioItem[])
  .filter((item) => item.published !== false)
  .toSorted((a, b) => (a.sortOrder ?? 9999) - (b.sortOrder ?? 9999));

export const featuredPortfolioItems = portfolioItems.filter((item) => item.featured).slice(0, 4);

export const portfolioCategories = ["All", ...new Set(portfolioItems.map((item) => item.category))];


export interface CartRecommendation {
  id: string;
  title: string;
  slug: string;
  priceFormatted: string;
  image?: string;
}

export function getRecommendations(): CartRecommendation[] {
  // Real recommendations arrive in Phase 7
  return [];
}

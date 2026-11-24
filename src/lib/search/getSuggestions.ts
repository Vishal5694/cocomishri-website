export interface ProductSuggestion {
  id: string;
  title: string;
  slug: string;
  category?: string;
  image?: string;
}

export function getSuggestions(_query: string): ProductSuggestion[] {
  void _query;
  // Real product search integration arrives in Phase 5
  return [];
}

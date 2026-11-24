export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number | null;
  badge: "New" | null;
  imageKey: string | null;
}

export const mockProducts: Product[] = [
  { id: "prod-1", slug: "sample-product-1", name: "Sample product 1", price: null, badge: "New", imageKey: "product-1" },
  { id: "prod-2", slug: "sample-product-2", name: "Sample product 2", price: null, badge: "New", imageKey: "product-2" },
  { id: "prod-3", slug: "sample-product-3", name: "Sample product 3", price: null, badge: "New", imageKey: "product-3" },
  { id: "prod-4", slug: "sample-product-4", name: "Sample product 4", price: null, badge: "New", imageKey: "product-4" },
  { id: "prod-5", slug: "sample-product-5", name: "Sample product 5", price: null, badge: "New", imageKey: "product-5" },
  { id: "prod-6", slug: "sample-product-6", name: "Sample product 6", price: null, badge: "New", imageKey: "product-6" },
  { id: "prod-7", slug: "sample-product-7", name: "Sample product 7", price: null, badge: "New", imageKey: "product-7" },
  { id: "prod-8", slug: "sample-product-8", name: "Sample product 8", price: null, badge: "New", imageKey: "product-8" },
];

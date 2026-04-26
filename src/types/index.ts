export interface Section {
  id: string;
  key: string;
  title: string;
  subtitle?: string;
  content: string;
  imageUrl?: string;
  sortOrder: number;
  isVisible: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  category: string;
  featured: number;
  sortOrder: number;
}

export interface Ingredient {
  id: string;
  name: string;
  description: string;
  origin: string;
  imageUrl?: string;
  sortOrder: number;
}

export interface CraftStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  duration: string;
  imageUrl?: string;
}

import { create } from "zustand";

interface Section { id: string; key: string; title: string; subtitle?: string; content: string; imageUrl?: string; sortOrder: number; isVisible: number; }
interface Product { id: string; name: string; description: string; imageUrl?: string; category: string; featured: number; sortOrder: number; }
interface Ingredient { id: string; name: string; description: string; origin: string; imageUrl?: string; sortOrder: number; }
interface CraftStep { id: string; stepNumber: number; title: string; description: string; duration: string; imageUrl?: string; }

interface AppState {
  sections: Section[];
  products: Product[];
  ingredients: Ingredient[];
  craftSteps: CraftStep[];
  loading: boolean;
  error: string;
  adminUser: { id: string; username: string } | null;
  fetchAll: () => Promise<void>;
  login: (u: string, p: string) => Promise<boolean>;
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  sections: [],
  products: [],
  ingredients: [],
  craftSteps: [],
  loading: false,
  error: "",
  adminUser: null,

  async fetchAll() {
    set({ loading: true });
    try {
      const [s, p, i, c] = await Promise.all([
        fetch("/api/sections").then(r => r.json()),
        fetch("/api/products").then(r => r.json()),
        fetch("/api/ingredients").then(r => r.json()),
        fetch("/api/craft-steps").then(r => r.json()),
      ]);
      set({ sections: s, products: p, ingredients: i, craftSteps: c, loading: false });
    } catch (e) {
      set({ error: "加载失败", loading: false });
    }
  },

  async login(username, password) {
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) return false;
      const user = await res.json();
      set({ adminUser: user });
      return true;
    } catch {
      return false;
    }
  },

  logout() {
    set({ adminUser: null });
  },
}));

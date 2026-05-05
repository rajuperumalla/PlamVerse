import { create } from "zustand";
import type { Product } from "@/types";

interface CartState {
  items: { product: Product; qty: number }[];
  add: (p: Product) => void;
  remove: (id: string) => void;
  total: () => number;
  clear: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  add: (p) =>
    set((s) => {
      const found = s.items.find((i) => i.product.id === p.id);
      if (found)
        return {
          items: s.items.map((i) =>
            i.product.id === p.id ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      return { items: [...s.items, { product: p, qty: 1 }] };
    }),
  remove: (id) => set((s) => ({ items: s.items.filter((i) => i.product.id !== id) })),
  total: () => get().items.reduce((sum, i) => sum + i.product.price * i.qty, 0),
  clear: () => set({ items: [] }),
}));

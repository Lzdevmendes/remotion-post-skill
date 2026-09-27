import React, { createContext, useContext } from "react";
import type { Brand } from "../../brand/tipos";
import type { Post } from "../../tipos-post";

export const PromoContext = createContext<{ brand: Brand; post: Post } | null>(null);

export function usePromo() {
  const ctx = useContext(PromoContext);
  if (!ctx) throw new Error("Missing PromoContext");
  return ctx;
}

export function rgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

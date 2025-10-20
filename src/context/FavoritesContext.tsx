import { createContext, ReactNode, useContext, useState } from "react";

type FavoritesValue = {
  favorites: string[];
  toggle: (id: string) => void;
};

const FavoritesContext = createContext<FavoritesValue | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  function toggle(id: string) {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }
  return <FavoritesContext.Provider value={{ favorites, toggle }}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}

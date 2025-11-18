import { useQuery } from "@tanstack/react-query";
import menuData from "@/data/menu.json";

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  price: number;
  veg: boolean;
  description: string;
  image: string;
  alt: string;
  spiceLevel: "mild" | "medium" | "hot" | "extra";
  allergens: string[];
  tags?: string[];
  available: boolean;
}

export const useMenu = () => {
  return useQuery({
    queryKey: ['menu'],
    queryFn: async () => {
      return menuData.menu as MenuItem[];
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

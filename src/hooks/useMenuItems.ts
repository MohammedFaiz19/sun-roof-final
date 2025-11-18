import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface MenuItem {
  id: string;
  category: string;
  name: string;
  price: string;
  veg_nonveg: 'veg' | 'non-veg' | 'egg';
  description: string;
  image_url?: string;
  generated_image_url?: string;
  image_generation_status?: string;
  display_order: number;
  is_active: boolean;
}

export const useMenuItems = () => {
  return useQuery({
    queryKey: ['menu-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true })
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as MenuItem[];
    },
  });
};
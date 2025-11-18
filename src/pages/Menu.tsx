import { useState, useMemo, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Sparkles, ArrowUpDown } from "lucide-react";
import { useMenuItems } from "@/hooks/useMenuItems";
import type { MenuItem } from "@/hooks/useMenu";
import { MenuSearch } from "@/components/menu/MenuSearch";
import { MenuFilters, MenuFiltersState } from "@/components/menu/MenuFilters";
import { MenuGrid } from "@/components/menu/MenuGrid";
import { DishModal } from "@/components/menu/DishModal";
import { MenuSchema } from "@/components/menu/MenuSchema";
import { MenuAnimationCanvas } from "@/components/menu/MenuAnimationCanvas";
import { AnimationToggle } from "@/components/menu/AnimationToggle";
import { Helmet } from "react-helmet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Menu = () => {
  const { data: menuData = [], isLoading } = useMenuItems();
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  // Check for prefers-reduced-motion
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setAnimationsEnabled(false);
    }
  }, []);
  
  // Define exact category order as specified
  const categoryOrder = [
    "Starters → Soups",
    "Chinese Veg Starter",
    "Chinese Non-Veg Starter",
    "Momos",
    "Sharings",
    "Main Course Chinese → Rice",
    "Main Course Chinese → Noodles",
    "Pasta",
    "Pizza",
    "Burger",
    "Sandwiches",
    "Healthy & Light → Salads",
    "Healthy & Light → Juices",
    "Desserts",
    "Beverages → Mojitos",
    "Beverages → Milkshakes",
    "Beverages",
  ];
  
  // Transform database items to match MenuItem interface
  const menuItems: MenuItem[] = menuData.map(item => ({
    id: item.id,
    name: item.name,
    category: item.category, // Keep full category name with subcategory
    subCategory: item.category.includes('→') ? item.category.split('→')[1].trim() : '',
    price: parseInt(item.price),
    veg: item.veg_nonveg === 'veg',
    description: item.description,
    image: item.generated_image_url || item.image_url || '',
    alt: item.name,
    spiceLevel: 'mild' as const,
    allergens: [],
    tags: [],
    available: item.is_active,
  }));
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [filters, setFilters] = useState<MenuFiltersState>({
    categories: [],
    dietary: [],
    spiceLevel: "all",
    priceRange: [0, 500],
    tags: [],
  });
  const [sortBy, setSortBy] = useState<"name" | "price-low" | "price-high" | "popularity">("popularity");

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subCategory.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory =
        filters.categories.length === 0 ||
        filters.categories.includes(item.category);

      // Dietary filter
      const matchesDietary =
        filters.dietary.length === 0 ||
        (filters.dietary.includes("veg") && item.veg) ||
        (filters.dietary.includes("non-veg") && !item.veg);

      // Spice level filter
      const matchesSpice =
        filters.spiceLevel === "all" || item.spiceLevel === filters.spiceLevel;

      // Price range filter
      const matchesPrice =
        item.price >= filters.priceRange[0] && item.price <= filters.priceRange[1];

      return matchesSearch && matchesCategory && matchesDietary && matchesSpice && matchesPrice;
    });
  }, [menuItems, searchQuery, filters]);

  // Sort filtered items
  const sortedItems = useMemo(() => {
    const items = [...filteredItems];
    
    switch (sortBy) {
      case "name":
        return items.sort((a, b) => a.name.localeCompare(b.name));
      case "price-low":
        return items.sort((a, b) => a.price - b.price);
      case "price-high":
        return items.sort((a, b) => b.price - a.price);
      case "popularity":
        // Keep original database order (already sorted by display_order from database)
        return items;
      default:
        return items;
    }
  }, [filteredItems, sortBy]);

  const categoryCounts = useMemo(() => {
    return menuItems.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [menuItems]);

  const groupedItems = useMemo(() => {
    const grouped = sortedItems.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, MenuItem[]>);
    
    // Return categories in exact specified order
    return categoryOrder.reduce((acc, category) => {
      if (grouped[category]) {
        acc[category] = grouped[category];
      }
      return acc;
    }, {} as Record<string, MenuItem[]>);
  }, [sortedItems, categoryOrder]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-muted rounded-2xl animate-pulse" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Sunroof Café — Full Menu | 145+ Dishes | Starters, Mains, Desserts & Drinks</title>
        <meta
          name="description"
          content="Explore Sunroof Café's complete menu with 145+ dishes including Indo-Chinese starters, pasta, pizza, burgers, desserts, and beverages. Order online or visit us today!"
        />
        <meta property="og:title" content="Sunroof Café — Full Menu" />
        <meta
          property="og:description"
          content="Browse our extensive menu featuring soups, starters, momos, rice, noodles, pasta, pizza, burgers, salads, desserts, and drinks."
        />
      </Helmet>

      <MenuSchema items={menuItems} />

      {/* Floating Food Animations */}
      <MenuAnimationCanvas 
        isEnabled={animationsEnabled} 
        activeFilter={filters.categories[0]}
      />

      <div className="min-h-screen relative">
        <Navigation />

        <main className="container mx-auto px-4 py-24 relative z-10" id="main-content">
          {/* Header with Animation Toggle */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <Sparkles className="h-8 w-8 text-flat-yellow animate-wiggle" />
              <h1 className="font-playfair text-5xl md:text-6xl font-bold gradient-text">
                Our Menu
              </h1>
              <Sparkles className="h-8 w-8 text-flat-coral animate-wiggle" />
            </div>
            <p className="mx-auto max-w-2xl font-inter text-lg text-muted-foreground mb-4">
              Discover our carefully curated selection of 145+ dishes
            </p>
            <div className="flex items-center justify-center gap-4 mb-2">
              <p className="text-sm text-muted-foreground font-inter">
                {sortedItems.length} {sortedItems.length === 1 ? 'dish' : 'dishes'} available
              </p>
              <AnimationToggle 
                enabled={animationsEnabled}
                onToggle={setAnimationsEnabled}
              />
            </div>
          </div>

          {/* Search & Filters - Glassmorphism */}
          <div className="mx-auto max-w-4xl mb-12 space-y-4">
            <div className="bg-background/60 backdrop-blur-md rounded-2xl p-6 border border-border/50 shadow-lg">
              <MenuSearch value={searchQuery} onChange={setSearchQuery} />
            </div>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <MenuFilters
                filters={filters}
                onFiltersChange={setFilters}
                categoryCounts={categoryCounts}
              />
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-[200px] bg-background/80 backdrop-blur-sm">
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Most Popular</SelectItem>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Menu Grid by Category */}
          {Object.keys(groupedItems).length > 0 ? (
            <div className="space-y-16">
              {Object.entries(groupedItems).map(([category, items]) => (
                <section key={category} id={category.toLowerCase().replace(/\s+/g, '-')}>
                  <div className="mb-8">
                    <h2 className="font-playfair text-3xl md:text-4xl font-bold text-primary mb-2">
                      {category}
                    </h2>
                    <div className="h-1 w-24 bg-gradient-foodie rounded-full" />
                    <p className="text-sm text-muted-foreground font-inter mt-2">
                      {items.length} {items.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                  <MenuGrid items={items} onItemClick={setSelectedItem} />
                </section>
              ))}
            </div>
          ) : (
            <MenuGrid items={[]} onItemClick={setSelectedItem} />
          )}
        </main>

        <Footer />

        {/* Dish Detail Modal */}
        <DishModal
          item={selectedItem}
          isOpen={selectedItem !== null}
          onClose={() => setSelectedItem(null)}
        />
      </div>
    </>
  );
};

export default Menu;
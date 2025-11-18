import { useState, useMemo } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Sparkles } from "lucide-react";
import { useMenu, MenuItem } from "@/hooks/useMenu";
import { MenuSearch } from "@/components/menu/MenuSearch";
import { MenuFilters, MenuFiltersState } from "@/components/menu/MenuFilters";
import { MenuGrid } from "@/components/menu/MenuGrid";
import { DishModal } from "@/components/menu/DishModal";
import { MenuSchema } from "@/components/menu/MenuSchema";
import { Helmet } from "react-helmet";

const Menu = () => {
  const { data: menuItems = [], isLoading } = useMenu();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [filters, setFilters] = useState<MenuFiltersState>({
    categories: [],
    dietary: [],
    spiceLevel: "all",
    priceRange: [0, 400],
    tags: [],
  });

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

      return matchesSearch && matchesCategory && matchesDietary && matchesSpice;
    });
  }, [menuItems, searchQuery, filters]);

  const categoryCounts = useMemo(() => {
    return menuItems.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [menuItems]);

  const groupedItems = useMemo(() => {
    return filteredItems.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, MenuItem[]>);
  }, [filteredItems]);

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

      <div className="min-h-screen bg-background">
        <Navigation />

        <main className="container mx-auto px-4 py-24" id="main-content">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <Sparkles className="h-8 w-8 text-flat-yellow animate-wiggle" />
              <h1 className="font-playfair text-5xl md:text-6xl font-bold gradient-text">
                Our Menu
              </h1>
              <Sparkles className="h-8 w-8 text-flat-coral animate-wiggle" />
            </div>
            <p className="mx-auto max-w-2xl font-inter text-lg text-muted-foreground mb-2">
              Discover our carefully curated selection of 145+ dishes
            </p>
            <p className="text-sm text-muted-foreground font-inter">
              {filteredItems.length} {filteredItems.length === 1 ? 'dish' : 'dishes'} available
            </p>
          </div>

          {/* Search & Filters */}
          <div className="mx-auto max-w-4xl mb-12 space-y-4">
            <MenuSearch value={searchQuery} onChange={setSearchQuery} />
            <div className="flex items-center justify-center gap-3">
              <MenuFilters
                filters={filters}
                onFiltersChange={setFilters}
                categoryCounts={categoryCounts}
              />
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
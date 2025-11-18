import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Sparkles, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMenuItems } from "@/hooks/useMenuItems";

const Menu = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "veg" | "non-veg">("all");
  
  const { data: menuItems, isLoading, error } = useMenuItems();

  const filteredItems = menuItems?.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = 
      filterType === "all" ||
      (filterType === "veg" && item.veg_nonveg === "veg") ||
      (filterType === "non-veg" && item.veg_nonveg !== "veg");
    return matchesSearch && matchesFilter;
  });

  // Define the menu structure with sections and categories
  const menuStructure = [
    {
      section: 'Starters',
      emoji: '🍜',
      categories: ['Soup', 'Chinese Veg Starter', 'Chinese Non-Veg Starter', 'Momos', 'Sharings']
    },
    {
      section: 'Main Course',
      emoji: '🍕',
      categories: ['Main Course Chinese', 'Side Dish Chinese', 'Pasta', 'Pizza', 'Burger', 'Sandwiches']
    },
    {
      section: 'Healthy & Light',
      emoji: '🥗',
      categories: ['Salad', 'Juices']
    },
    {
      section: 'Desserts',
      emoji: '🍰',
      categories: ['Dessert']
    },
    {
      section: 'Beverages',
      emoji: '🍹',
      categories: ['Mojitos', 'Milkshakes']
    }
  ];

  const groupedItems = filteredItems?.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof filteredItems>);

  const categoryEmojis: Record<string, string> = {
    'Soup': '🍲',
    'Chinese Veg Starter': '🥟',
    'Chinese Non-Veg Starter': '🍗',
    'Momos': '🥟',
    'Sharings': '🍟',
    'Main Course Chinese': '🍜',
    'Side Dish Chinese': '🥘',
    'Pasta': '🍝',
    'Pizza': '🍕',
    'Burger': '🍔',
    'Sandwiches': '🥪',
    'Salad': '🥗',
    'Juices': '🥤',
    'Dessert': '🍰',
    'Mojitos': '🍹',
    'Milkshakes': '🥤',
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-24" id="main-content">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-flat-yellow animate-wiggle" />
            <h1 className="font-playfair text-5xl font-bold gradient-text">Our Menu</h1>
            <Sparkles className="h-8 w-8 text-flat-coral animate-wiggle" />
          </div>
          <p className="mx-auto max-w-2xl font-inter text-lg text-foreground">
            Explore our carefully curated selection of dishes
          </p>
          
          <div className="mx-auto max-w-2xl mt-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg border-2 border-primary/20 focus:border-primary rounded-full"
              />
            </div>
            
            <div className="flex justify-center gap-3">
              <Button
                variant={filterType === "all" ? "default" : "outline"}
                onClick={() => setFilterType("all")}
                className="rounded-full"
              >
                All
              </Button>
              <Button
                variant={filterType === "veg" ? "default" : "outline"}
                onClick={() => setFilterType("veg")}
                className="rounded-full"
              >
                🟢 Vegetarian
              </Button>
              <Button
                variant={filterType === "non-veg" ? "default" : "outline"}
                onClick={() => setFilterType("non-veg")}
                className="rounded-full"
              >
                🔴 Non-Vegetarian
              </Button>
            </div>
          </div>
          
          <div className="mx-auto mt-6 h-1 w-32 gradient-foodie rounded-full" />
        </div>

        {isLoading && (
          <div className="flex justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <p className="text-destructive">Failed to load menu.</p>
          </div>
        )}

        {menuStructure.map((section) => {
          const sectionCategories = section.categories.filter(cat => groupedItems?.[cat]?.length > 0);
          if (sectionCategories.length === 0) return null;
          
          return (
            <div key={section.section} className="mb-20">
              {/* Section Header */}
              <div className="mb-10 text-center">
                <div className="inline-flex items-center gap-4 mb-4">
                  <span className="text-6xl">{section.emoji}</span>
                  <h2 className="font-playfair text-5xl font-bold gradient-text">{section.section}</h2>
                  <span className="text-6xl">{section.emoji}</span>
                </div>
                <div className="mx-auto mt-4 h-1 w-48 gradient-foodie rounded-full" />
              </div>

              {/* Categories within this section */}
              {sectionCategories.map((category) => (
                <div 
                  key={category} 
                  className="mb-12 p-8 rounded-3xl bg-gradient-card border-2 border-primary/30 shadow-medium"
                >
                  <div className="mb-8 text-center">
                    <div className="inline-flex items-center gap-3 mb-4">
                      <span className="text-4xl">{categoryEmojis[category] || '🍽️'}</span>
                      <h3 className="font-playfair text-3xl font-bold text-foreground">{category}</h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groupedItems[category].map((item) => (
                      <Card 
                        key={item.id}
                        className="overflow-hidden hover-lift border-2 hover:border-primary transition-all"
                      >
                        <div className="relative h-48 bg-gradient-to-br from-primary/10 to-accent/10">
                          {item.generated_image_url ? (
                            <img
                              src={item.generated_image_url}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <span className="text-6xl">{categoryEmojis[category] || '🍽️'}</span>
                            </div>
                          )}
                          
                          <div className="absolute top-3 right-3">
                            <Badge variant={item.veg_nonveg === 'veg' ? 'default' : 'destructive'}>
                              {item.veg_nonveg === 'veg' ? '🟢' : item.veg_nonveg === 'egg' ? '🟤' : '🔴'}
                            </Badge>
                          </div>
                        </div>

                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-playfair text-xl font-bold flex-1">{item.name}</h3>
                            <span className="text-primary font-bold text-lg ml-3">{item.price}</span>
                          </div>
                          {item.description && (
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          );
        })}

        {filteredItems?.length === 0 && !isLoading && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No dishes found.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Menu;
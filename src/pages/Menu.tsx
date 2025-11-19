import { useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { MenuAnimationCanvas } from "@/components/menu/MenuAnimationCanvas";
import { AnimationToggle } from "@/components/menu/AnimationToggle";
import { ChefHat, Soup, Leaf, Pizza, Coffee, IceCream, Salad } from "lucide-react";

interface SubCategory {
  name: string;
}

interface Category {
  id: string;
  name: string;
  icon: any;
  color: string;
  subcategories: SubCategory[];
}

const menuStructure: Category[] = [
  {
    id: "starters",
    name: "STARTERS",
    icon: ChefHat,
    color: "from-orange-500 to-red-500",
    subcategories: [
      { name: "SOUP" },
      { name: "CHINESE VEG STARTER" },
      { name: "CHINESE NON-VEG STARTER" },
      { name: "MOMOS" },
      { name: "SHARINGS" }
    ]
  },
  {
    id: "main-course",
    name: "MAIN COURSE",
    icon: Pizza,
    color: "from-amber-500 to-orange-500",
    subcategories: [
      { name: "MAIN COURSE CHINESE" },
      { name: "RICE" },
      { name: "NOODLES" },
      { name: "SIDE DISH CHINESE" },
      { name: "PASTA" },
      { name: "PIZZA" },
      { name: "BURGER" },
      { name: "SANDWICHES" }
    ]
  },
  {
    id: "healthy-light",
    name: "HEALTHY & LIGHT",
    icon: Salad,
    color: "from-green-500 to-emerald-500",
    subcategories: [
      { name: "SALAD" },
      { name: "JUICES" }
    ]
  },
  {
    id: "desserts",
    name: "DESSERTS",
    icon: IceCream,
    color: "from-pink-500 to-rose-500",
    subcategories: []
  },
  {
    id: "beverages",
    name: "BEVERAGES",
    icon: Coffee,
    color: "from-blue-500 to-cyan-500",
    subcategories: [
      { name: "MOJITOS" },
      { name: "MILKSHAKES" }
    ]
  }
];

const Menu = () => {
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <>
      <Helmet>
        <title>Our Menu - Sunroof Cafe</title>
        <meta name="description" content="Explore our delicious menu categories at Sunroof Cafe" />
      </Helmet>

      <div className="min-h-screen bg-background relative overflow-hidden">
        {animationsEnabled && <MenuAnimationCanvas isEnabled={animationsEnabled} />}
        
        <Navigation />
        
        <main className="container mx-auto px-4 py-24 relative z-10">
          {/* Header */}
          <div className="text-center mb-16 space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-playfair font-bold text-primary"
            >
              Our Menu
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-muted-foreground"
            >
              Explore our delicious categories
            </motion.p>
            <AnimationToggle 
              enabled={animationsEnabled}
              onToggle={() => setAnimationsEnabled(!animationsEnabled)}
            />
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {menuStructure.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -8 }}
                onClick={() => setSelectedCategory(category.id)}
                className="cursor-pointer group"
              >
                <div className="relative h-full bg-card/80 backdrop-blur-md rounded-2xl overflow-hidden border border-border/50 shadow-lg hover:shadow-2xl transition-all duration-300">
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
                  
                  {/* Content */}
                  <div className="relative p-8 space-y-6">
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300`}>
                      <category.icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Category Name */}
                    <h2 className="text-2xl font-playfair font-bold text-foreground group-hover:text-primary transition-colors">
                      {category.name}
                    </h2>

                    {/* Subcategories */}
                    {category.subcategories.length > 0 && (
                      <div className="space-y-2">
                        {category.subcategories.map((sub, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 + idx * 0.05 }}
                            className="flex items-center space-x-2 text-sm text-muted-foreground group-hover:text-foreground transition-colors"
                          >
                            <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${category.color}`} />
                            <span>{sub.name}</span>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* Hover indicator */}
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className={`text-sm font-semibold bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}>
                        Click to explore →
                      </div>
                    </div>
                  </div>

                  {/* Shine effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shine" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Coming Soon Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-16 p-8 bg-card/60 backdrop-blur-md rounded-2xl border border-border/50 max-w-2xl mx-auto"
          >
            <p className="text-lg text-muted-foreground">
              Menu items coming soon! Each category will be filled with our delicious offerings.
            </p>
          </motion.div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Menu;
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { MenuAnimationCanvas } from "@/components/menu/MenuAnimationCanvas";
import { AnimationToggle } from "@/components/menu/AnimationToggle";
import { ChefHat, Pizza, Coffee, IceCream, Salad, ArrowLeft } from "lucide-react";
import { useMenuItems } from "@/hooks/useMenuItems";
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { Button } from "@/components/ui/button";
import startersCover from "@/assets/menu-covers/starters-cover.jpg";
import mainCourseCover from "@/assets/menu-covers/main-course-cover.jpg";
import healthyLightCover from "@/assets/menu-covers/healthy-light-cover.jpg";
import dessertsCover from "@/assets/menu-covers/desserts-cover.jpg";
import beveragesCover from "@/assets/menu-covers/beverages-cover.jpg";
import soupCover from "@/assets/menu-covers/soup-cover.jpg";
import chineseVegStarterCover from "@/assets/menu-covers/chinese-veg-starter-cover.jpg";
import chineseNonvegStarterCover from "@/assets/menu-covers/chinese-nonveg-starter-cover.jpg";
import momosCover from "@/assets/menu-covers/momos-cover.jpg";
import sharingsCover from "@/assets/menu-covers/sharings-cover.jpg";
interface SubCategory {
  id: string;
  name: string;
  dbName: string; // Name used in database
  imageUrl?: string;
}
interface MainCategory {
  id: string;
  name: string;
  icon: any;
  color: string;
  imageUrl: string;
  subcategories: SubCategory[];
}

// Hierarchical menu structure: Main Category → Subcategory → Items
const menuHierarchy: MainCategory[] = [{
  id: "starters",
  name: "STARTERS",
  icon: ChefHat,
  color: "from-orange-500 via-red-500 to-pink-500",
  imageUrl: startersCover,
  subcategories: [{
    id: "soup",
    name: "SOUP",
    dbName: "SOUP",
    imageUrl: soupCover
  }, {
    id: "chinese-veg-starter",
    name: "CHINESE VEG STARTER",
    dbName: "CHINESE VEG STARTER",
    imageUrl: chineseVegStarterCover
  }, {
    id: "chinese-nonveg-starter",
    name: "CHINESE NON-VEG STARTER",
    dbName: "CHINESE NON-VEG STARTER",
    imageUrl: chineseNonvegStarterCover
  }, {
    id: "momos",
    name: "MOMOS",
    dbName: "MOMOS",
    imageUrl: momosCover
  }, {
    id: "sharings",
    name: "SHARINGS",
    dbName: "SHARINGS",
    imageUrl: sharingsCover
  }]
}, {
  id: "main-course",
  name: "MAIN COURSE",
  icon: Pizza,
  color: "from-amber-500 via-orange-500 to-red-500",
  imageUrl: mainCourseCover,
  subcategories: [{
    id: "main-dish-chinese",
    name: "MAIN COURSE CHINESE",
    dbName: "MAIN DISH CHINESE"
  }, {
    id: "side-dish-chinese",
    name: "SIDE DISH CHINESE",
    dbName: "SIDE DISH — CHINESE"
  }, {
    id: "pasta",
    name: "PASTA",
    dbName: "PASTA"
  }, {
    id: "pizza",
    name: "PIZZA",
    dbName: "PIZZA"
  }, {
    id: "burger",
    name: "BURGER",
    dbName: "BURGER"
  }, {
    id: "sandwiches",
    name: "SANDWICHES",
    dbName: "SANDWICHES"
  }]
}, {
  id: "healthy-light",
  name: "HEALTHY & LIGHT",
  icon: Salad,
  color: "from-green-500 via-emerald-500 to-teal-500",
  imageUrl: healthyLightCover,
  subcategories: [{
    id: "salad",
    name: "SALAD",
    dbName: "SALAD"
  }, {
    id: "juices",
    name: "JUICES",
    dbName: "JUICES"
  }]
}, {
  id: "desserts",
  name: "DESSERTS",
  icon: IceCream,
  color: "from-pink-500 via-rose-500 to-red-500",
  imageUrl: dessertsCover,
  subcategories: [{
    id: "desserts",
    name: "DESSERTS",
    dbName: "DESSERTS"
  }]
}, {
  id: "beverages",
  name: "BEVERAGES",
  icon: Coffee,
  color: "from-blue-500 via-cyan-500 to-teal-500",
  imageUrl: beveragesCover,
  subcategories: [{
    id: "mojitos",
    name: "MOJITOS",
    dbName: "MOJITOS"
  }, {
    id: "milkshakes",
    name: "MILKSHAKES",
    dbName: "MILKSHAKES"
  }]
}];
const Menu = () => {
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [selectedMainCategory, setSelectedMainCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);
  const {
    data: menuItems,
    isLoading
  } = useMenuItems();
  const currentMainCategory = menuHierarchy.find(cat => cat.id === selectedMainCategory);

  // Filter items based on selected subcategory
  const filteredItems = selectedSubCategory ? menuItems?.filter(item => {
    const normalizedCategory = item.category.toUpperCase().trim();
    const normalizedSelected = selectedSubCategory.dbName.toUpperCase().trim();
    return normalizedCategory === normalizedSelected;
  }) || [] : [];
  const handleMainCategoryClick = (categoryId: string) => {
    const category = menuHierarchy.find(cat => cat.id === categoryId);
    setSelectedMainCategory(categoryId);
    
    // Auto-select subcategory if there's only one
    if (category && category.subcategories.length === 1) {
      setSelectedSubCategory(category.subcategories[0]);
    } else {
      setSelectedSubCategory(null);
    }
  };
  const handleBackToMainCategories = () => {
    setSelectedMainCategory(null);
    setSelectedSubCategory(null);
  };
  const handleBackToSubcategories = () => {
    setSelectedSubCategory(null);
  };
  const handleSubCategoryClick = (subcat: SubCategory) => {
    setSelectedSubCategory(subcat);
  };
  return <>
      <Helmet>
        <title>Our Menu - Sunroof Cafe</title>
        <meta name="description" content="Explore our delicious menu at Sunroof Cafe - from starters to desserts" />
      </Helmet>

      <div className="min-h-screen bg-background relative overflow-hidden">
        {animationsEnabled && <MenuAnimationCanvas isEnabled={animationsEnabled} />}
        
        <Navigation />
        
        <main className="container mx-auto px-4 py-24 relative z-10">
          {/* Header */}
          <div className="text-center mb-16 space-y-4">
            <motion.h1 initial={{
            opacity: 0,
            y: -20
          }} animate={{
            opacity: 1,
            y: 0
          }} className="text-5xl md:text-7xl font-playfair font-bold bg-gradient-to-r from-primary via-orange-500 to-red-500 bg-clip-text text-transparent">
              Our Menu
            </motion.h1>
            <motion.p initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} transition={{
            delay: 0.2
          }} className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our carefully curated selection of dishes
            </motion.p>
          </div>

          {/* Animation Toggle */}
          <div className="flex justify-center mb-8">
            
          </div>

          <AnimatePresence mode="wait">
            {/* Level 1: Main Categories View */}
            {!selectedMainCategory && <motion.div key="main-categories" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            y: -20
          }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {menuHierarchy.map((category, index) => {
              const Icon = category.icon;
              return <motion.div key={category.id} initial={{
                opacity: 0,
                scale: 0.9
              }} animate={{
                opacity: 1,
                scale: 1
              }} transition={{
                delay: index * 0.1
              }} onClick={() => handleMainCategoryClick(category.id)} className="group cursor-pointer">
                      <div className="relative h-64 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105">
                        {/* Background Image */}
                        <img 
                          src={category.imageUrl} 
                          alt={category.name}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        
                        {/* Dark overlay for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />

                        {/* Content */}
                        <div className="relative h-full flex flex-col items-center justify-center text-white p-8">
                          <motion.div whileHover={{
                      scale: 1.2,
                      rotate: 5
                    }} transition={{
                      type: "spring",
                      stiffness: 300
                    }}>
                            <Icon className="w-20 h-20 mb-6 drop-shadow-lg" />
                          </motion.div>
                          
                          <h2 className="text-3xl font-playfair font-bold text-center mb-3 drop-shadow-md">
                            {category.name}
                          </h2>
                          
                          <div className="flex items-center gap-2 text-sm font-medium opacity-90">
                            <span>{category.subcategories.length} Categories</span>
                          </div>

                          {/* Hover indicator */}
                          <motion.div initial={{
                      opacity: 0,
                      y: 10
                    }} whileHover={{
                      opacity: 1,
                      y: 0
                    }} className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-sm font-medium">
                            <span>Explore</span>
                            <motion.span animate={{
                        x: [0, 5, 0]
                      }} transition={{
                        repeat: Infinity,
                        duration: 1.5
                      }}>
                              →
                            </motion.span>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>;
            })}
              </motion.div>}

            {/* Level 2: Subcategories View */}
            {selectedMainCategory && !selectedSubCategory && currentMainCategory && <motion.div key="subcategories" initial={{
            opacity: 0,
            x: 20
          }} animate={{
            opacity: 1,
            x: 0
          }} exit={{
            opacity: 0,
            x: -20
          }}>
                {/* Back Button */}
                <Button onClick={handleBackToMainCategories} variant="outline" className="mb-8 group">
                  <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                  Back to Categories
                </Button>

                {/* Subcategory Header */}
                <motion.div initial={{
              opacity: 0,
              y: -20
            }} animate={{
              opacity: 1,
              y: 0
            }} className="text-center mb-12">
                  <h2 className={`text-4xl md:text-5xl font-playfair font-bold bg-gradient-to-r ${currentMainCategory.color} bg-clip-text text-transparent mb-4`}>
                    {currentMainCategory.name}
                  </h2>
                  <p className="text-muted-foreground">Select a category to view items</p>
                </motion.div>

                {/* Subcategories Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {currentMainCategory.subcategories.map((subcat, index) => <motion.div key={subcat.id} initial={{
                opacity: 0,
                y: 20
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                delay: index * 0.05
              }} onClick={() => handleSubCategoryClick(subcat)} className="group cursor-pointer">
                      <div className="relative h-48 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        {/* Background Image or Gradient */}
                        {subcat.imageUrl ? (
                          <>
                            <img 
                              src={subcat.imageUrl} 
                              alt={subcat.name}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
                          </>
                        ) : (
                          <>
                            <div className={`absolute inset-0 bg-gradient-to-br ${currentMainCategory.color}`} />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
                          </>
                        )}
                        
                        <div className="relative h-full flex flex-col items-center justify-center text-white p-6">
                          <h3 className="text-xl font-bold text-center mb-2 drop-shadow-md">
                            {subcat.name}
                          </h3>
                          
                          <motion.div initial={{
                      opacity: 0
                    }} whileHover={{
                      opacity: 1
                    }} className="text-sm font-medium flex items-center gap-1">
                            <span>View Menu</span>
                            <motion.span animate={{
                        x: [0, 3, 0]
                      }} transition={{
                        repeat: Infinity,
                        duration: 1
                      }}>
                              →
                            </motion.span>
                          </motion.div>
                        </div>

                        <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
                      </div>
                    </motion.div>)}
                </div>
              </motion.div>}

            {/* Level 3: Items View */}
            {selectedSubCategory && <motion.div key="items" initial={{
            opacity: 0,
            x: 20
          }} animate={{
            opacity: 1,
            x: 0
          }} exit={{
            opacity: 0,
            x: -20
          }}>
                {/* Back Button */}
                <Button onClick={handleBackToSubcategories} variant="outline" className="mb-8 group">
                  <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                  Back to {currentMainCategory?.name}
                </Button>

                {/* Items Header */}
                <motion.div initial={{
              opacity: 0,
              y: -20
            }} animate={{
              opacity: 1,
              y: 0
            }} className="text-center mb-12">
                  <h2 className={`text-4xl md:text-5xl font-playfair font-bold bg-gradient-to-r ${currentMainCategory?.color} bg-clip-text text-transparent mb-4`}>
                    {selectedSubCategory.name}
                  </h2>
                </motion.div>

                {/* Items Grid */}
                {isLoading ? <div className="text-center py-20">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="mt-4 text-muted-foreground">Loading delicious items...</p>
                  </div> : filteredItems.length === 0 ? <motion.div initial={{
              opacity: 0,
              scale: 0.9
            }} animate={{
              opacity: 1,
              scale: 1
            }} className="text-center py-20">
                    <div className="mb-6 text-6xl">🍽️</div>
                    <h3 className="font-playfair text-2xl font-bold mb-2">Coming Soon</h3>
                    <p className="text-muted-foreground">
                      We're preparing amazing dishes for this category. Stay tuned!
                    </p>
                  </motion.div> : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredItems.map((item, index) => <MenuItemCard key={item.id} name={item.name} price={item.price} vegNonVeg={item.veg_nonveg} description={item.description} imageUrl={item.image_url || item.generated_image_url || undefined} index={index} />)}
                  </div>}
              </motion.div>}
          </AnimatePresence>
        </main>

        <Footer />
      </div>
    </>;
};
export default Menu;
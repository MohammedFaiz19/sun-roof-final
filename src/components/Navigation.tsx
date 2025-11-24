import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import sunroofLogo from "@/assets/sunroof-logo-new.jpg";

const navItems = [
  { id: "home", title: "Home", path: "/" },
  { id: "menu", title: "Menu", path: "/menu" },
  { id: "booking", title: "Book", hash: "#booking" },
  { id: "gallery", title: "Gallery", hash: "#gallery" },
  { id: "event", title: "Events", hash: "#event" },
  { id: "about", title: "About", hash: "#about" },
  { id: "faq", title: "FAQ", path: "/faq" },
];

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (item: typeof navItems[0]) => {
    setIsMobileMenuOpen(false);
    
    if (item.path) {
      navigate(item.path);
    } else if (item.hash) {
      if (location.pathname !== "/") {
        navigate("/" + item.hash);
      } else {
        const element = document.getElementById(item.hash.substring(1));
        if (element) {
          const offset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
      }
    }
  };

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg"
      >
        Skip to content
      </a>

      <nav className="fixed top-0 z-50 w-full bg-background/95 backdrop-blur-md shadow-medium border-b-2 border-primary/20">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <button
            onClick={() => navigate("/")}
            className="hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-primary rounded"
          >
            <img 
              src={sunroofLogo} 
              alt="Sunroof Cafe & Restaurant Logo" 
              className="h-12 md:h-16 w-auto"
            />
          </button>

          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => handleNavigation(item)}
                className="font-inter font-medium text-foreground hover:text-primary hover:bg-primary/10 transition-all"
              >
                {item.title}
              </Button>
            ))}
            
            <div className="flex items-center gap-2 ml-4 pl-4 border-l-2 border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open("https://www.swiggy.com", "_blank")}
                className="bg-flat-citrus/10 hover:bg-flat-citrus text-flat-citrus hover:text-white border-2 border-flat-citrus"
              >
                Swiggy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open("https://www.zomato.com", "_blank")}
                className="bg-flat-coral/10 hover:bg-flat-coral text-flat-coral hover:text-white border-2 border-flat-coral"
              >
                Zomato
              </Button>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden bg-background border-t-2 border-border">
            <div className="container mx-auto px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item)}
                  className="block w-full text-left font-inter text-lg font-medium text-foreground hover:text-primary py-2 px-4 rounded-lg hover:bg-primary/10"
                >
                  {item.title}
                </button>
              ))}
              
              <div className="pt-4 border-t-2 border-border flex gap-3">
                <Button onClick={() => window.open("https://www.swiggy.com", "_blank")} className="flex-1 bg-flat-citrus text-white">
                  Swiggy
                </Button>
                <Button onClick={() => window.open("https://www.zomato.com", "_blank")} className="flex-1 bg-flat-coral text-white">
                  Zomato
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navigation;
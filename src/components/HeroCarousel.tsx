import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Sparkles, Instagram } from "lucide-react";
import { cn } from "@/lib/utils";

// Import gallery images
import fountain from "@/assets/gallery/fountain.jpg";
import archway from "@/assets/gallery/archway.jpg";
import interior1 from "@/assets/gallery/interior1.jpg";
import interior2 from "@/assets/gallery/interior2.jpg";
import interior3 from "@/assets/gallery/interior3.jpg";
import interior4 from "@/assets/gallery/interior4.jpg";

const slides = [
  { id: 1, image: fountain, alt: "Beautifully lit fountain monument near Sunroof Cafe at night" },
  { id: 2, image: archway, alt: "Elegant archway entrance of Sunroof Cafe with warm lighting and greenery" },
  { id: 3, image: interior1, alt: "Modern interior of Sunroof Cafe with industrial ceiling and pendant lights" },
  { id: 4, image: interior2, alt: "Cozy dining area with geometric wall design and hanging plants" },
  { id: 5, image: interior3, alt: "Spacious seating arrangement with decorative pendant lamps" },
  { id: 6, image: interior4, alt: "Ambient evening dining space with artistic wall features" },
];

interface HeroCarouselProps {
  onBookClick: () => void;
}

const HeroCarousel = ({ onBookClick }: HeroCarouselProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  return (
    <section className="relative h-screen w-full overflow-hidden" role="region" aria-label="Hero carousel">
      {/* Skip to content link */}
      <a
        href="#menu"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg"
      >
        Skip to content
      </a>

      {/* Background Slides */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000",
              currentSlide === index ? "opacity-100 z-10" : "opacity-0 z-0"
            )}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className="h-full w-full object-cover"
              loading={index === 0 ? "eager" : "lazy"}
            />
            <div 
              className="absolute inset-0" 
              style={{ background: "var(--gradient-overlay)" }}
            />
          </div>
        ))}
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "w-3 h-3 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-primary",
              currentSlide === index 
                ? "bg-white w-8" 
                : "bg-white/50 hover:bg-white/70"
            )}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={currentSlide === index}
          />
        ))}
      </div>

      {/* Content Overlay */}
      <div className="relative z-20 flex h-full flex-col items-center justify-center px-4 text-center">
        {/* Floating sparkles */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <Sparkles className="absolute top-20 left-1/4 h-6 w-6 text-flat-yellow animate-float opacity-70" />
          <Sparkles className="absolute top-32 right-1/4 h-8 w-8 text-flat-coral animate-float-delayed opacity-60" />
          <Sparkles className="absolute bottom-40 left-1/3 h-7 w-7 text-flat-citrus animate-bounce-slow opacity-70" />
        </div>

        {/* Highlighted Cafe Name with Gradient Pill */}
        <div className="relative mb-6 animate-fade-in-up opacity-0 [animation-delay:200ms]">
          <div 
            className="absolute inset-0 gradient-foodie rounded-[3rem] blur-2xl opacity-60 animate-pulse"
            style={{ boxShadow: "var(--shadow-pill)" }}
            aria-hidden="true"
          />
          <h1 className="relative font-playfair text-5xl md:text-7xl font-bold text-white drop-shadow-2xl px-8 py-4 bg-primary/30 backdrop-blur-sm rounded-[3rem] border-4 border-white/30">
            Sunroof Cafe & Restaurant
          </h1>
        </div>

        <p className="mb-8 max-w-2xl animate-fade-in-up font-inter text-lg text-white/95 opacity-0 md:text-xl [animation-delay:400ms] drop-shadow-lg">
          Where flavors meet perfection. Experience authentic cuisine in a warm, inviting atmosphere.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row animate-fade-in-up opacity-0 [animation-delay:600ms]">
          <Button
            size="lg"
            onClick={onBookClick}
            className="gradient-foodie hover:opacity-90 text-white font-inter font-semibold px-10 py-7 text-lg rounded-full shadow-2xl hover:shadow-color transition-all duration-300 hover:scale-110 border-4 border-white/30"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Book a Table
          </Button>
          <Button
            size="lg"
            onClick={() => window.location.href = "/menu"}
            variant="outline"
            className="border-4 border-white bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-primary font-inter font-semibold px-10 py-7 text-lg rounded-full hover:scale-105 transition-all duration-300"
          >
            View Menu
          </Button>
          <Button
            size="lg"
            onClick={() => window.open("https://www.instagram.com/_sunroof_cafe_?igsh=cDZ0dnpoMGZkbXBv", "_blank")}
            variant="outline"
            className="border-4 border-white bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-primary font-inter font-semibold px-10 py-7 text-lg rounded-full hover:scale-105 transition-all duration-300"
          >
            <Instagram className="mr-2 h-5 w-5" />
            Instagram
          </Button>
        </div>
      </div>

      {/* Swiggy & Zomato Shortcuts */}
      <div className="absolute bottom-4 right-4 z-30 flex gap-3">
        <a
          href="https://www.swiggy.com/city/mysore/sunroof-cafe-and-restaurant-mysore-north-rest1164798"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-flat-citrus hover:bg-flat-citrus/80 text-white px-6 py-3 rounded-full font-semibold text-sm shadow-medium hover:shadow-strong transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          Order on Swiggy
        </a>
        <a
          href="https://www.zomato.com/mysore/sunroof-cafe-restaurant-1-rajiv-nagar/order"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-flat-coral hover:bg-flat-coral/80 text-white px-6 py-3 rounded-full font-semibold text-sm shadow-medium hover:shadow-strong transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          Order on Zomato
        </a>
      </div>
    </section>
  );
};

export default HeroCarousel;
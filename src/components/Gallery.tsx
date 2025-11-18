import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Gallery = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const { data: galleryImages = [], isLoading } = useQuery({
    queryKey: ["gallery-images"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_images")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const openLightbox = (index: number) => {
    setCurrentImage(index);
    setLightboxOpen(true);
  };

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "ArrowLeft") prevImage();
    if (e.key === "Escape") setLightboxOpen(false);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="aspect-[4/3] bg-muted rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!galleryImages.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No gallery images available yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryImages.map((image, index) => (
          <button
            key={image.id}
            onClick={() => openLightbox(index)}
            className="group relative aspect-[4/3] overflow-hidden rounded-2xl shadow-medium hover:shadow-strong transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary"
            aria-label={`View ${image.alt_text}`}
          >
            <img
              src={image.image_url}
              alt={image.alt_text}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-white font-semibold text-lg">{image.caption}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent 
          className="max-w-7xl w-full h-[90vh] p-0 bg-black/95 border-none"
          onKeyDown={handleKeyDown}
        >
          <div className="relative h-full flex items-center justify-center">
            {/* Close Button */}
            <Button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 z-50 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2"
              size="icon"
              variant="ghost"
              aria-label="Close lightbox"
            >
              <X className="h-6 w-6 text-white" />
            </Button>

            {/* Previous Button */}
            <Button
              onClick={prevImage}
              className="absolute left-4 z-40 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3"
              size="icon"
              variant="ghost"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-8 w-8 text-white" />
            </Button>

            {/* Image */}
            <div className="relative w-full h-full flex items-center justify-center p-16">
              <img
                src={galleryImages[currentImage]?.image_url}
                alt={galleryImages[currentImage]?.alt_text}
                className="max-w-full max-h-full object-contain"
              />
              <div className="absolute bottom-8 left-0 right-0 text-center">
                <p className="text-white text-xl font-semibold drop-shadow-lg">
                  {galleryImages[currentImage]?.caption}
                </p>
                <p className="text-white/70 text-sm mt-1">
                  {currentImage + 1} / {galleryImages.length}
                </p>
              </div>
            </div>

            {/* Next Button */}
            <Button
              onClick={nextImage}
              className="absolute right-4 z-40 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3"
              size="icon"
              variant="ghost"
              aria-label="Next image"
            >
              <ChevronRight className="h-8 w-8 text-white" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Gallery;

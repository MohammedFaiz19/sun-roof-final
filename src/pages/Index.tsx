import { useState } from "react";
import HeroCarousel from "@/components/HeroCarousel";
import BookingModal from "@/components/BookingModal";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Gallery from "@/components/Gallery";
import GoogleReviews from "@/components/GoogleReviews";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FoodieBackground } from "@/components/FoodieBackground";

const Index = () => {
  const navigate = useNavigate();
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background relative">
      <FoodieBackground intensity="medium" />
      <div className="relative z-10">
        <Navigation />
      
      {/* Main Content */}
      <main id="main-content">
        {/* Home Section / Hero */}
        <div id="home">
          <HeroCarousel onBookClick={() => setBookingModalOpen(true)} />
        </div>

        {/* Quick Menu Preview */}
        <section className="container mx-auto px-4 py-20 text-center">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold gradient-text mb-6">
            Discover Our Delicious Menu
          </h2>
          <p className="font-inter text-lg text-foreground mb-8 max-w-2xl mx-auto">
            From flavorful starters to delightful desserts, explore our full collection of culinary creations
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/menu")}
            className="gradient-foodie hover:shadow-color text-lg font-semibold px-8 py-6 rounded-full text-white shadow-medium hover:scale-105 transition-all"
          >
            View Full Menu
          </Button>
        </section>

        {/* Booking Section */}
        <section id="booking" className="container mx-auto px-4 py-20 scroll-mt-20">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-5xl font-bold gradient-text mb-4">Book Your Table</h2>
            <p className="font-inter text-lg text-foreground">Reserve your spot for an unforgettable dining experience</p>
          </div>
          <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-gradient-card border-2 border-primary/30 shadow-medium text-center">
            <p className="font-inter text-foreground mb-6">Ready to dine with us?</p>
            <Button
              size="lg"
              onClick={() => setBookingModalOpen(true)}
              className="gradient-foodie hover:shadow-color text-lg font-semibold px-8 py-4 rounded-full text-white shadow-medium hover:scale-105 transition-all"
            >
              Make a Reservation
            </Button>
          </div>
        </section>

        {/* Google Reviews Section */}
        <GoogleReviews />

        {/* Gallery Section */}
        <section id="gallery" className="container mx-auto px-4 py-20 scroll-mt-20">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-5xl font-bold gradient-text mb-4">Gallery</h2>
            <p className="font-inter text-lg text-foreground">A visual feast of our beautiful space and delicious creations</p>
          </div>
          <Gallery />
        </section>

        {/* Event Section */}
        <section id="event" className="container mx-auto px-4 py-20 scroll-mt-20">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-5xl font-bold gradient-text mb-4">Events</h2>
            <p className="font-inter text-lg text-foreground">Join us for special occasions and celebrations</p>
          </div>
          <div className="p-8 rounded-3xl bg-gradient-card border-2 border-primary/30 shadow-medium">
            <p className="text-center font-inter text-foreground">Events information coming soon!</p>
          </div>
        </section>

        {/* About & Contact Section */}
        <section id="about" className="container mx-auto px-4 py-20 scroll-mt-20">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-5xl font-bold gradient-text mb-4">About & Contact</h2>
            <p className="font-inter text-lg text-foreground">Get to know us and reach out</p>
          </div>
          <div className="max-w-4xl mx-auto p-8 rounded-3xl bg-gradient-card border-2 border-primary/30 shadow-medium">
            <p className="text-center font-inter text-foreground mb-4">
              Welcome to Sunroof Cafe & Restaurant - where every meal is a celebration!
            </p>
            <div className="text-center font-inter text-foreground space-y-2">
              <p>📞 <a href="tel:8618686726" className="text-primary hover:text-accent transition-colors">8618686726</a></p>
              <p>📷 <a href="https://www.instagram.com/_sunroof_cafe_?igsh=cDZ0dnpoMGZkbXBv" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-accent transition-colors">@_sunroof_cafe_</a></p>
              <p>🕐 12:30 PM - 11:00 PM (Every Day)</p>
              <p>📍 <a href="https://maps.app.goo.gl/H1e9VTrBW1QVdoRA9" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-accent transition-colors">View on Google Maps</a></p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="container mx-auto px-4 py-20 scroll-mt-20">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-5xl font-bold gradient-text mb-4">FAQ</h2>
            <p className="font-inter text-lg text-foreground">Got questions? We have answers!</p>
          </div>
          <div className="max-w-3xl mx-auto p-8 rounded-3xl bg-gradient-card border-2 border-primary/30 shadow-medium text-center">
            <p className="font-inter text-foreground mb-6">
              Find answers to common questions about our menu, reservations, hours, and more.
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/faq")}
              className="gradient-foodie hover:shadow-color text-lg font-semibold px-8 py-4 rounded-full text-white shadow-medium hover:scale-105 transition-all"
            >
              View All FAQs
            </Button>
          </div>
        </section>
      </main>

        <Footer />
        <BookingModal open={bookingModalOpen} onOpenChange={setBookingModalOpen} />
      </div>
    </div>
  );
};

export default Index;

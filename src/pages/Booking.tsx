import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, Sparkles } from "lucide-react";

const Booking = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const features = [
    {
      icon: Calendar,
      title: "Easy Booking",
      description: "Book your table in seconds via WhatsApp",
    },
    {
      icon: Clock,
      title: "Flexible Hours",
      description: "Open daily 12:30 PM - 11:00 PM",
    },
    {
      icon: Users,
      title: "Group Friendly",
      description: "Accommodate up to 14 guests",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-24" id="main-content">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <Sparkles className="h-8 w-8 text-flat-yellow animate-wiggle" />
              <h1 className="font-playfair text-5xl font-bold gradient-text">Book Your Table</h1>
              <Sparkles className="h-8 w-8 text-flat-coral animate-wiggle" />
            </div>
            <p className="font-inter text-lg text-foreground max-w-2xl mx-auto">
              Reserve your spot for an unforgettable dining experience
            </p>
            <div className="mx-auto mt-6 h-1 w-32 gradient-foodie rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-gradient-card border-2 border-primary/30 shadow-medium hover:shadow-strong transition-all hover-lift"
              >
                <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-playfair text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="p-12 rounded-3xl bg-gradient-card border-2 border-primary/30 shadow-strong">
            <h2 className="font-playfair text-3xl font-bold mb-4 gradient-text">
              Ready to Dine With Us?
            </h2>
            <p className="font-inter text-foreground mb-8 max-w-xl mx-auto">
              Click below to reserve your table via WhatsApp
            </p>
            <Button
              size="lg"
              onClick={() => setModalOpen(true)}
              className="gradient-foodie hover:shadow-color text-white font-semibold text-xl px-12 py-8 rounded-full shadow-medium hover:scale-110 transition-all"
            >
              <Calendar className="mr-3 h-6 w-6" />
              Make a Reservation
            </Button>
          </div>
        </div>
      </main>

      <Footer />
      <BookingModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
};

export default Booking;
import { useState } from "react";
import { Helmet } from "react-helmet";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { FoodieBackground, IntensityLevel } from "@/components/FoodieBackground";
import { IntensityControl } from "@/components/IntensityControl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqData = [
  {
    question: "What are your opening hours?",
    answer: "We're open every day from 12:30 PM to 11:00 PM, including weekends and holidays. Come visit us anytime for a delicious meal!"
  },
  {
    question: "Do you take reservations?",
    answer: "Yes! We highly recommend making a reservation, especially during peak hours and weekends. You can book a table through our website or by calling us at +91 90664 66551."
  },
  {
    question: "Do you offer vegetarian and vegan options?",
    answer: "Absolutely! We have an extensive selection of vegetarian dishes. While we don't have a dedicated vegan menu, many of our vegetarian dishes can be customized to be vegan. Just let our staff know your dietary preferences."
  },
  {
    question: "Is there parking available?",
    answer: "Yes, we have parking facilities available for our customers. Please check our location on Google Maps for detailed parking information."
  },
  {
    question: "Do you offer delivery or takeaway?",
    answer: "Yes, we offer both dine-in and takeaway services. For delivery, please check with popular food delivery apps in your area or call us directly to inquire about our delivery options."
  },
  {
    question: "Are there options for people with food allergies?",
    answer: "We take food allergies very seriously. Please inform our staff about any allergies or dietary restrictions, and we'll do our best to accommodate your needs. Many of our dishes can be customized."
  },
  {
    question: "Do you have a kids menu?",
    answer: "While we don't have a separate kids menu, we offer many dishes that are perfect for children, including burgers, pizzas, pasta, fries, and milkshakes. Our staff can help recommend kid-friendly options."
  },
  {
    question: "Can I host a private event or party at your restaurant?",
    answer: "Yes! We welcome private events and parties. Please contact us in advance at +91 90664 66551 to discuss your requirements, group size, and menu options."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept cash, all major credit and debit cards, and digital payment methods including UPI, PayTm, Google Pay, and other popular payment apps."
  },
  {
    question: "Can I customize my order?",
    answer: "Yes! We're happy to accommodate customization requests where possible. Let our staff know your preferences, and we'll do our best to make your meal exactly how you like it."
  },
  {
    question: "How can I provide feedback about my experience?",
    answer: "We value your feedback! You can share your experience with us directly at the restaurant, call us, message us on Instagram @_sunroof_cafe_, or leave a review on Google Maps."
  }
];

const FAQ = () => {
  const [intensity, setIntensity] = useState<IntensityLevel>("medium");

  return (
    <>
      <Helmet>
        <title>FAQ - Sunroof Cafe</title>
        <meta name="description" content="Frequently asked questions about Sunroof Cafe - opening hours, reservations, menu, and more" />
      </Helmet>

      <div className="min-h-screen bg-background relative">
        <FoodieBackground intensity={intensity} />
        <IntensityControl intensity={intensity} onIntensityChange={setIntensity} />
        
        <div className="relative z-10">
          <Navigation />
          
          <main className="container mx-auto px-4 py-24">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h1 className="font-playfair text-5xl md:text-6xl font-bold gradient-text mb-4">
                Frequently Asked Questions
              </h1>
              <p className="font-inter text-lg text-muted-foreground max-w-2xl mx-auto">
                Find answers to common questions about Sunroof Cafe
              </p>
            </motion.div>

            {/* FAQ Accordion */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              <div className="backdrop-blur-content rounded-3xl border-2 border-primary/20 shadow-strong p-8">
                <Accordion type="single" collapsible className="w-full space-y-4">
                  {faqData.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`item-${index}`}
                      className="border border-border/50 rounded-2xl px-6 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors"
                    >
                      <AccordionTrigger className="text-left font-semibold hover:no-underline py-6">
                        <span className="flex items-start gap-3">
                          <span className="text-primary font-playfair text-xl flex-shrink-0">Q.</span>
                          <span className="font-inter">{faq.question}</span>
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-6 pl-9 font-inter leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

              {/* Contact Section */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-12 text-center backdrop-blur-content rounded-2xl p-8 border border-primary/20"
              >
                <h3 className="font-playfair text-2xl font-bold mb-4">Still have questions?</h3>
                <p className="text-muted-foreground mb-6 font-inter">
                  Can't find the answer you're looking for? Feel free to reach out to us!
                </p>
                <div className="flex flex-wrap justify-center gap-4 font-inter">
                  <a
                    href="tel:+919066466551"
                    className="text-primary hover:text-accent transition-colors font-semibold"
                  >
                    📞 Call us: +91 90664 66551
                  </a>
                  <span className="text-muted-foreground">|</span>
                  <a
                    href="https://www.instagram.com/_sunroof_cafe_?igsh=cDZ0dnpoMGZkbXBv"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-accent transition-colors font-semibold"
                  >
                    📷 Instagram: @_sunroof_cafe_
                  </a>
                </div>
              </motion.div>
            </motion.div>
          </main>

          <Footer />
        </div>
      </div>
    </>
  );
};

export default FAQ;

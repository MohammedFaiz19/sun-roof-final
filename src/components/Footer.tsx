import { Instagram, Phone, MapPin, Clock } from "lucide-react";

const Footer = () => {
  const phone = "8618686726";
  const whatsappUrl = `https://wa.me/918618686726?text=Hi!%20I'd%20like%20to%20know%20more%20about%20Sunroof%20Cafe%20%26%20Restaurant`;
  const instagram = "https://www.instagram.com/_sunroof_cafe_?igsh=cDZ0dnpoMGZkbXBv";
  const mapsUrl = "https://maps.app.goo.gl/H1e9VTrBW1QVdoRA9";
  const hours = "12:30 PM - 11:00 PM (Every Day)";

  return (
    <footer className="relative bg-primary text-primary-foreground mt-20">
      <div className="absolute inset-0 opacity-20 gradient-foodie" />
      
      <div className="relative container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-playfair text-3xl font-bold mb-4 text-white">
              Sunroof Cafe & Restaurant
            </h3>
            <p className="text-white/90 font-inter">
              Where every meal is a celebration!
            </p>
          </div>

          <div>
            <h4 className="font-inter text-xl font-bold mb-4 text-white">Contact</h4>
            <div className="space-y-3">
              <a href={`tel:${phone}`} className="flex items-center gap-3 text-white/90 hover:text-white group">
                <div className="bg-white/20 p-2 rounded-full group-hover:bg-white/30">
                  <Phone className="h-4 w-4" />
                </div>
                <span>{phone}</span>
              </a>
              
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/90 hover:text-white group">
                <div className="bg-white/20 p-2 rounded-full group-hover:bg-white/30">
                  <Phone className="h-4 w-4" />
                </div>
                <span>WhatsApp</span>
              </a>
              
              <a href={instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/90 hover:text-white group">
                <div className="bg-white/20 p-2 rounded-full group-hover:bg-white/30">
                  <Instagram className="h-4 w-4" />
                </div>
                <span>@_sunroof_cafe_</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-inter text-xl font-bold mb-4 text-white">Visit</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-white/90">
                <div className="bg-white/20 p-2 rounded-full">
                  <Clock className="h-4 w-4" />
                </div>
                <span>{hours}</span>
              </div>
              
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 text-white/90 hover:text-white group">
                <div className="bg-white/20 p-2 rounded-full group-hover:bg-white/30">
                  <MapPin className="h-4 w-4" />
                </div>
                <span>Google Maps</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 text-center">
          <p className="text-white/80">
            © {new Date().getFullYear()} Sunroof Cafe & Restaurant
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
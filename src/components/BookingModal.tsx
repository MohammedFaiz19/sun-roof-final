import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, MessageCircle, Phone } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Time slots from 12:30 PM to 11:00 PM
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 12; hour <= 23; hour++) {
    if (hour === 12) {
      slots.push("12:30 PM");
    } else if (hour < 12) {
      slots.push(`${hour}:00 AM`, `${hour}:30 AM`);
    } else if (hour === 12) {
      slots.push("12:00 PM", "12:30 PM");
    } else {
      const displayHour = hour > 12 ? hour - 12 : hour;
      slots.push(`${displayHour}:00 PM`);
      if (hour < 23) slots.push(`${displayHour}:30 PM`);
    }
  }
  return slots.filter((slot) => {
    const [time, period] = slot.split(" ");
    const [hours, minutes] = time.split(":").map(Number);
    const totalMinutes = (period === "PM" && hours !== 12 ? hours + 12 : hours) * 60 + minutes;
    return totalMinutes >= 12 * 60 + 30 && totalMinutes <= 23 * 60;
  });
};

const timeSlots = generateTimeSlots();

const BookingModal = ({ open, onOpenChange }: BookingModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: undefined as Date | undefined,
    time: "",
    guests: "2",
    specialDecoration: "",
    notes: "",
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.date || !formData.time) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const message = `Hi Sunroof Cafe & Restaurant — I would like to book a table for ${formData.guests} ${parseInt(formData.guests) === 1 ? 'person' : 'people'} on ${format(formData.date, "PPP")} at ${formData.time}.

Name: ${formData.name}
Contact: ${formData.phone}${formData.email ? `\nEmail: ${formData.email}` : ''}${formData.specialDecoration ? `\n\nSpecial Decoration: ${formData.specialDecoration}` : ''}${formData.notes ? `\n\nAdditional Notes: ${formData.notes}` : ''}

Looking forward to dining with you!`;

    const whatsappUrl = `https://wa.me/918618686726?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    
    toast({
      title: "Opening WhatsApp...",
      description: "Complete your booking on WhatsApp.",
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-playfair gradient-text">Book Your Table</DialogTitle>
          <DialogDescription className="text-base">
            Fill in your details and we'll open WhatsApp to confirm your reservation.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your full name"
              required
              className="border-2 focus:border-primary"
            />
          </div>

          {/* Phone & Email Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 XXXXX XXXXX"
                required
                className="border-2 focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                className="border-2 focus:border-primary"
              />
            </div>
          </div>

          {/* Date & Time Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border-2",
                      !formData.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? format(formData.date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => setFormData({ ...formData, date })}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time *</Label>
              <Select value={formData.time} onValueChange={(value) => setFormData({ ...formData, time: value })}>
                <SelectTrigger className="border-2">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Number of Guests */}
          <div className="space-y-2">
            <Label htmlFor="guests">Number of Guests (Max 14) *</Label>
            <Select value={formData.guests} onValueChange={(value) => setFormData({ ...formData, guests: value })}>
              <SelectTrigger className="border-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 14 }, (_, i) => i + 1).map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? 'Guest' : 'Guests'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Special Decoration */}
          <div className="space-y-2">
            <Label htmlFor="decoration">Special Decoration (Optional)</Label>
            <Input
              id="decoration"
              value={formData.specialDecoration}
              onChange={(e) => setFormData({ ...formData, specialDecoration: e.target.value })}
              placeholder="e.g., Birthday decoration, Anniversary setup"
              className="border-2 focus:border-primary"
            />
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any special requests or dietary requirements..."
              rows={3}
              className="border-2 focus:border-primary resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="submit"
              size="lg"
              className="flex-1 gradient-foodie hover:opacity-90 text-white font-semibold text-lg py-6 rounded-full shadow-medium hover:shadow-strong transition-all"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Confirm & Message on WhatsApp
            </Button>
            <Button
              type="button"
              size="lg"
              variant="outline"
              onClick={() => window.location.href = "tel:8618686726"}
              className="sm:w-auto border-2 border-primary text-primary hover:bg-primary hover:text-white py-6 rounded-full transition-all"
            >
              <Phone className="mr-2 h-4 w-4" />
              Call Instead
            </Button>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            We're open daily from 12:30 PM to 11:00 PM
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
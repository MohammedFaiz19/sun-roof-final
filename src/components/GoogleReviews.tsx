import { Star, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Review {
  name: string;
  rating: number;
  time: string;
  headline?: string;
  text: string;
  ratings?: {
    food: number;
    service: number;
    atmosphere: number;
  };
  extraInfo?: string[];
  photos?: string[];
}

const reviews: Review[] = [
  {
    name: "Umar Shariff",
    rating: 5,
    time: "4 months ago",
    headline: "A Must-Visit Gem!",
    text: "Visited Sunroof Café & Restaurant today and I'm truly impressed! The ambience is magical with romantic lighting and soothing music. Tried three types of momos (Schezwuan, BBQ, and Pan Fried) – each one a flavor bomb. The white sauce pasta was top-notch, creamy and authentic. Also had \"Drums of Heaven\" – juicy, perfectly spiced, and unforgettable. This place nails both vibe and taste. Highly recommended!",
    ratings: {
      food: 5,
      service: 5,
      atmosphere: 5
    },
    photos: ["photo1", "photo2", "photo3"]
  },
  {
    name: "Shaikh Hafizur Rahman",
    rating: 5,
    time: "1 month ago",
    text: "Food tastes authentic. One of the best Chinese food I've tasted in Mysore. Price is also reasonable. It's a hidden gem in Rajiv Nagar. Definitely visiting again.",
    ratings: {
      food: 5,
      service: 4,
      atmosphere: 4
    },
    extraInfo: ["Suitable for all group sizes", "No wait"]
  },
  {
    name: "Saran Raj",
    rating: 5,
    time: "1 month ago",
    text: "Friendly staff, the food was nice & lovely ambience. Drums of Heaven, creamy Alfredo pasta, momos, momo soup — must try. Best place to hang out with friends and family.",
    ratings: {
      food: 5,
      service: 5,
      atmosphere: 5
    }
  }
];

const RatingBar = ({ label, value }: { label: string; value: number }) => (
  <div className="flex items-center gap-2 text-sm">
    <span className="text-gray-400 w-24">{label}</span>
    <div className="flex-1 max-w-[120px] h-2 bg-gray-700 rounded-full overflow-hidden">
      <div 
        className="h-full bg-yellow-500 rounded-full"
        style={{ width: `${(value / 5) * 100}%` }}
      />
    </div>
  </div>
);

const GoogleReviews = () => {
  const googleReviewsUrl = "https://www.google.com/search?sca_esv=f5688d6b1e23e673&sxsrf=AE3TifPe-WppqIl0CcKU5WlTKGumfIcH-g:1764400926360&si=AMgyJEtREmoPL4P1I5IDCfuA8gybfVI2d5Uj7QMwYCZHKDZ-Ew5JCK277PnLvBuZGUT49feLAReWAZW2pJEMyPv6lVcnmrGyZlBhLLh_Vs-kjX97uXAgLdOpofit5VLwtcW862mFHJSL-LAW1RqAYjAmEB21Bq51PQ%3D%3D&q=Sunroof+Cafe+%26+Restaurant+Reviews&sa=X&ved=2ahUKEwjg29PT6ZaRAxXLyDgGHZ-MIdkQ0bkNegQIMxAD&biw=1536&bih=695&dpr=1.25";

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h2 className="font-playfair text-5xl font-bold gradient-text mb-4">
          What People Are Saying
        </h2>
      </div>

      {/* View More on Google Button */}
      <div className="flex justify-center mb-12">
        <Button
          onClick={() => window.open(googleReviewsUrl, '_blank')}
          variant="outline"
          className="bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 rounded-full px-6 py-3 text-base font-medium transition-all flex items-center gap-2"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          View More on Google
        </Button>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {reviews.map((review, index) => (
          <div
            key={index}
            className="bg-[#1e1e1e] rounded-2xl p-6 text-white shadow-xl border border-gray-800"
          >
            {/* Profile Header */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {getInitials(review.name)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base truncate">{review.name}</h3>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating ? 'fill-yellow-500 text-yellow-500' : 'fill-gray-600 text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-1">{review.time}</p>
              </div>
            </div>

            {/* Headline */}
            {review.headline && (
              <h4 className="font-bold text-base mb-2">{review.headline}</h4>
            )}

            {/* Review Text */}
            <p className="text-sm text-gray-300 leading-relaxed mb-4">
              {review.text}
            </p>

            {/* Rating Bars */}
            {review.ratings && (
              <div className="space-y-2 mb-4 py-3 border-t border-gray-700">
                <RatingBar label="Food" value={review.ratings.food} />
                <RatingBar label="Service" value={review.ratings.service} />
                <RatingBar label="Atmosphere" value={review.ratings.atmosphere} />
              </div>
            )}

            {/* Extra Info */}
            {review.extraInfo && (
              <div className="flex flex-wrap gap-2 mb-4">
                {review.extraInfo.map((info, i) => (
                  <span key={i} className="text-xs bg-gray-800 px-3 py-1 rounded-full text-gray-300">
                    {info}
                  </span>
                ))}
              </div>
            )}

            {/* Photos Placeholder */}
            {review.photos && (
              <div className="grid grid-cols-3 gap-2 mb-4">
                {review.photos.map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gray-800 rounded-lg flex items-center justify-center"
                  >
                    <span className="text-gray-600 text-xs">Photo {i + 1}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-4 pt-3 border-t border-gray-800">
              <button className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors">
                <Heart className="w-4 h-4" />
                <span className="text-xs">Helpful</span>
              </button>
              <button className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors">
                <Share2 className="w-4 h-4" />
                <span className="text-xs">Share</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GoogleReviews;
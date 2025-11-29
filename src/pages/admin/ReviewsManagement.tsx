import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';

const ReviewsManagement = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-playfair text-3xl font-bold mb-2">Reviews Management</h1>
        <p className="text-muted-foreground">Manage which reviews display on your website</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Current Reviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            The following Google reviews are currently displayed on your homepage. You can edit their display settings in the GoogleReviews component.
          </p>
          
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold">Umar Shariff</h3>
              <div className="flex text-yellow-400 my-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">Amazing ambience and delicious food. Loved the momos and pasta!</p>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold">Shaikh Hafizur Rahman</h3>
              <div className="flex text-yellow-400 my-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">Great Chinese food at a good price. Will visit again.</p>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold">Saran Raj</h3>
              <div className="flex text-yellow-400 my-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">Friendly staff and tasty dishes. Perfect for friends and family.</p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mt-6">
            To add, edit, or remove reviews, update the hardcoded reviews in the GoogleReviews component at src/components/GoogleReviews.tsx
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewsManagement;
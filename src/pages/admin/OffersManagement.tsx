import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit2, Trash2, Tag } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const OffersManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    coupon_code: '',
    discount_type: 'percentage' as 'percentage' | 'fixed',
    discount_value: '',
    valid_from: '',
    valid_until: '',
    terms: '',
    display_on_banner: false,
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: offers = [] } = useQuery({
    queryKey: ['admin-offers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const addOfferMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from('offers').insert([{
        ...data,
        discount_value: parseFloat(data.discount_value)
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-offers'] });
      toast({ title: 'Offer added successfully' });
      setIsDialogOpen(false);
      resetForm();
    },
  });

  const updateOfferMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { error } = await supabase
        .from('offers')
        .update({
          ...data,
          discount_value: parseFloat(data.discount_value)
        })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-offers'] });
      toast({ title: 'Offer updated successfully' });
      setEditingOffer(null);
      resetForm();
    },
  });

  const deleteOfferMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('offers')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-offers'] });
      toast({ title: 'Offer deleted successfully' });
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      coupon_code: '',
      discount_type: 'percentage',
      discount_value: '',
      valid_from: '',
      valid_until: '',
      terms: '',
      display_on_banner: false,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingOffer) {
      updateOfferMutation.mutate({ id: editingOffer.id, data: formData });
    } else {
      addOfferMutation.mutate(formData);
    }
  };

  const startEdit = (offer: any) => {
    setEditingOffer(offer);
    setFormData({
      title: offer.title,
      description: offer.description,
      coupon_code: offer.coupon_code || '',
      discount_type: offer.discount_type,
      discount_value: offer.discount_value?.toString() || '',
      valid_from: offer.valid_from || '',
      valid_until: offer.valid_until || '',
      terms: offer.terms || '',
      display_on_banner: offer.display_on_banner,
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-playfair text-3xl font-bold mb-2">Offers & Coupons</h1>
          <p className="text-muted-foreground">Create special offers and discount coupons</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingOffer(null);
            resetForm();
          }
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Offer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingOffer ? 'Edit Offer' : 'Add New Offer'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Offer Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Coupon Code (optional)</Label>
                <Input
                  value={formData.coupon_code}
                  onChange={(e) => setFormData({ ...formData, coupon_code: e.target.value.toUpperCase() })}
                  placeholder="WELCOME20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Discount Type</Label>
                  <Select
                    value={formData.discount_type}
                    onValueChange={(value: any) => setFormData({ ...formData, discount_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Discount Value</Label>
                  <Input
                    type="number"
                    value={formData.discount_value}
                    onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Valid From</Label>
                  <Input
                    type="date"
                    value={formData.valid_from}
                    onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Valid Until</Label>
                  <Input
                    type="date"
                    value={formData.valid_until}
                    onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Terms & Conditions</Label>
                <Textarea
                  value={formData.terms}
                  onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.display_on_banner}
                  onCheckedChange={(checked) => setFormData({ ...formData, display_on_banner: checked })}
                />
                <Label>Display on homepage banner</Label>
              </div>
              <Button type="submit" className="w-full">
                {editingOffer ? 'Update Offer' : 'Add Offer'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {offers.map((offer) => (
          <Card key={offer.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  {offer.title}
                </span>
                {offer.display_on_banner && (
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                    Banner
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{offer.description}</p>
              {offer.coupon_code && (
                <div className="bg-accent text-accent-foreground px-4 py-2 rounded font-mono text-sm mb-4">
                  {offer.coupon_code}
                </div>
              )}
              <p className="text-sm font-semibold mb-2">
                {offer.discount_type === 'percentage' ? `${offer.discount_value}% OFF` : `₹${offer.discount_value} OFF`}
              </p>
              {offer.valid_from && offer.valid_until && (
                <p className="text-xs text-muted-foreground mb-4">
                  Valid: {new Date(offer.valid_from).toLocaleDateString()} - {new Date(offer.valid_until).toLocaleDateString()}
                </p>
              )}
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => startEdit(offer)} className="flex-1">
                  <Edit2 className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => deleteOfferMutation.mutate(offer.id)}
                  className="flex-1"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OffersManagement;
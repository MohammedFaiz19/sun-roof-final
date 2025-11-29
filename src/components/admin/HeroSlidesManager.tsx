import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

const HeroSlidesManager = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<any>(null);
  const [formData, setFormData] = useState({
    image_url: '',
    alt_text: '',
    title: '',
    subtitle: '',
    cta_text: '',
    cta_link: '',
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: slides = [] } = useQuery({
    queryKey: ['admin-hero-slides'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .order('display_order');
      if (error) throw error;
      return data;
    },
  });

  const addSlideMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from('hero_slides').insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-hero-slides'] });
      toast({ title: 'Hero slide added successfully' });
      setIsDialogOpen(false);
      resetForm();
    },
  });

  const updateSlideMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<typeof formData> }) => {
      const { error } = await supabase
        .from('hero_slides')
        .update(data)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-hero-slides'] });
      toast({ title: 'Hero slide updated successfully' });
      setEditingSlide(null);
      resetForm();
    },
  });

  const deleteSlideMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('hero_slides')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-hero-slides'] });
      toast({ title: 'Hero slide deleted successfully' });
    },
  });

  const moveSlide = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = slides.findIndex((s: any) => s.id === id);
    if (currentIndex === -1) return;
    if (direction === 'up' && currentIndex === 0) return;
    if (direction === 'down' && currentIndex === slides.length - 1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const currentSlide = slides[currentIndex];
    const swapSlide = slides[newIndex];

    await supabase
      .from('hero_slides')
      .update({ display_order: swapSlide.display_order })
      .eq('id', currentSlide.id);

    await supabase
      .from('hero_slides')
      .update({ display_order: currentSlide.display_order })
      .eq('id', swapSlide.id);

    queryClient.invalidateQueries({ queryKey: ['admin-hero-slides'] });
  };

  const resetForm = () => {
    setFormData({
      image_url: '',
      alt_text: '',
      title: '',
      subtitle: '',
      cta_text: '',
      cta_link: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSlide) {
      updateSlideMutation.mutate({ id: editingSlide.id, data: formData });
    } else {
      addSlideMutation.mutate(formData);
    }
  };

  const startEdit = (slide: any) => {
    setEditingSlide(slide);
    setFormData({
      image_url: slide.image_url,
      alt_text: slide.alt_text,
      title: slide.title || '',
      subtitle: slide.subtitle || '',
      cta_text: slide.cta_text || '',
      cta_link: slide.cta_link || '',
    });
    setIsDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Hero Slides</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingSlide(null);
            resetForm();
          }
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Slide
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingSlide ? 'Edit Hero Slide' : 'Add New Hero Slide'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Image URL</Label>
                <Input
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Alt Text</Label>
                <Input
                  value={formData.alt_text}
                  onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Overlay Title (optional)</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Welcome to Sunroof"
                />
              </div>
              <div>
                <Label>Overlay Subtitle (optional)</Label>
                <Input
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Experience Fine Dining"
                />
              </div>
              <div>
                <Label>CTA Button Text (optional)</Label>
                <Input
                  value={formData.cta_text}
                  onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                  placeholder="View Menu"
                />
              </div>
              <div>
                <Label>CTA Link (optional)</Label>
                <Input
                  value={formData.cta_link}
                  onChange={(e) => setFormData({ ...formData, cta_link: e.target.value })}
                  placeholder="/menu"
                />
              </div>
              <Button type="submit" className="w-full">
                {editingSlide ? 'Update Slide' : 'Add Slide'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {slides.map((slide: any) => (
            <div key={slide.id} className="flex items-center gap-4 p-4 border rounded-lg">
              <img
                src={slide.image_url}
                alt={slide.alt_text}
                className="h-24 w-40 object-cover rounded"
              />
              <div className="flex-1">
                <p className="font-semibold">{slide.alt_text}</p>
                {slide.title && <p className="text-sm text-muted-foreground">Title: {slide.title}</p>}
                {slide.subtitle && <p className="text-sm text-muted-foreground">Subtitle: {slide.subtitle}</p>}
                {slide.cta_text && <p className="text-sm text-muted-foreground">CTA: {slide.cta_text}</p>}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => moveSlide(slide.id, 'up')}>
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => moveSlide(slide.id, 'down')}>
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => startEdit(slide)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => deleteSlideMutation.mutate(slide.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default HeroSlidesManager;
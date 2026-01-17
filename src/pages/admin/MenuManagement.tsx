import { useState, useRef } from 'react';
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
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import { BatchImageGenerator } from '@/components/admin/BatchImageGenerator';

const MenuManagement = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    veg_nonveg: 'veg' as 'veg' | 'non-veg' | 'egg',
    description: '',
    display_order: 0,
  });
  
  // Ref to track scroll position
  const scrollPositionRef = useRef<number>(0);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: menuItems = [] } = useQuery({
    queryKey: ['admin-menu-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('category', { ascending: true })
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  // Save scroll position before mutation
  const saveScrollPosition = () => {
    scrollPositionRef.current = window.scrollY;
  };

  // Restore scroll position after mutation
  const restoreScrollPosition = () => {
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollPositionRef.current);
    });
  };

  const addItemMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from('menu_items').insert([data]);
      if (error) throw error;
    },
    onMutate: saveScrollPosition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-menu-items'] });
      toast({ title: 'Menu item added successfully' });
      setIsAddDialogOpen(false);
      resetForm();
      restoreScrollPosition();
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<typeof formData> }) => {
      const { error } = await supabase
        .from('menu_items')
        .update(data)
        .eq('id', id);
      if (error) throw error;
    },
    onMutate: saveScrollPosition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-menu-items'] });
      toast({ title: 'Menu item updated successfully' });
      setEditingItem(null);
      resetForm();
      restoreScrollPosition();
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onMutate: saveScrollPosition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-menu-items'] });
      toast({ title: 'Menu item deleted successfully' });
      restoreScrollPosition();
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      price: '',
      veg_nonveg: 'veg',
      description: '',
      display_order: 0,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateItemMutation.mutate({ id: editingItem.id, data: formData });
    } else {
      addItemMutation.mutate(formData);
    }
  };

  const startEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price,
      veg_nonveg: item.veg_nonveg,
      description: item.description,
      display_order: item.display_order,
    });
  };

  // Filter items based on search query
  const filteredItems = menuItems.filter((item) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      item.name.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query)
    );
  });

  // Group filtered items by category, maintaining display_order
  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, any[]>);

  // Sort categories alphabetically and items within by display_order
  const sortedCategories = Object.keys(groupedItems).sort();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-playfair text-3xl font-bold mb-2">Menu Management</h1>
          <p className="text-muted-foreground">Add, edit, and organize menu items</p>
        </div>
        <Dialog open={isAddDialogOpen || !!editingItem} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) {
            setEditingItem(null);
            resetForm();
          }
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Menu Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Item Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Category</Label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Price</Label>
                  <Input
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Type</Label>
                  <Select
                    value={formData.veg_nonveg}
                    onValueChange={(value: any) => setFormData({ ...formData, veg_nonveg: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="veg">Vegetarian</SelectItem>
                      <SelectItem value="non-veg">Non-Vegetarian</SelectItem>
                      <SelectItem value="egg">Contains Egg</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                <Label>Display Order</Label>
                <Input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                />
              </div>
              <Button type="submit" className="w-full">
                {editingItem ? 'Update Item' : 'Add Item'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search menu items by name, category, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="text-sm text-muted-foreground mt-2">
              Found {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} matching "{searchQuery}"
            </p>
          )}
        </CardContent>
      </Card>

      <BatchImageGenerator />

      {sortedCategories.map((category) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{category}</span>
              <span className="text-sm font-normal text-muted-foreground">
                {groupedItems[category].length} items
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {groupedItems[category].map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">#{item.display_order}</span>
                      <h3 className="font-semibold">{item.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${
                        item.veg_nonveg === 'veg' ? 'bg-green-100 text-green-800' : 
                        item.veg_nonveg === 'egg' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.veg_nonveg}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.description || <span className="italic">No description</span>}</p>
                    <p className="text-sm font-semibold mt-1">₹{item.price}</p>
                  </div>
                  {(item.image_url || item.generated_image_url) && (
                    <img
                      src={item.image_url || item.generated_image_url}
                      alt={item.name}
                      className="h-16 w-16 object-cover rounded ml-4"
                    />
                  )}
                  <div className="flex gap-2 ml-4">
                    <Button size="sm" variant="outline" onClick={() => startEdit(item)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteItemMutation.mutate(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {sortedCategories.length === 0 && searchQuery && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No menu items found matching "{searchQuery}"
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MenuManagement;
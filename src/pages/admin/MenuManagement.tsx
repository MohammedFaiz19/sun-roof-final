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
import { Plus, Edit2, Trash2, Search, X, Undo2 } from 'lucide-react';
import { BatchImageGenerator } from '@/components/admin/BatchImageGenerator';

interface UndoableAction {
  type: 'delete' | 'update';
  item: any;
  previousData?: any; // For updates, stores the data before modification
  timeoutId: ReturnType<typeof setTimeout>;
}

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
  // Track undoable actions (delete or update)
  const [undoableAction, setUndoableAction] = useState<UndoableAction | null>(null);
  
  const { toast, dismiss } = useToast();
  const queryClient = useQueryClient();

  const { data: menuItems = [] } = useQuery({
    queryKey: ['admin-menu-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        // Match the website: preserve the exact ordering via display_order
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  // Save scroll position before mutation
  const saveScrollPosition = () => {
    scrollPositionRef.current = window.scrollY;
  };

  // Restore scroll position after mutation with multiple attempts to ensure it works after re-render
  const restoreScrollPosition = () => {
    const savedPosition = scrollPositionRef.current;
    // Immediate restore
    window.scrollTo(0, savedPosition);
    // After React re-render
    requestAnimationFrame(() => {
      window.scrollTo(0, savedPosition);
    });
    // After query refetch and DOM update
    setTimeout(() => {
      window.scrollTo(0, savedPosition);
    }, 50);
    setTimeout(() => {
      window.scrollTo(0, savedPosition);
    }, 150);
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
      setEditingItem(null);
      resetForm();
      restoreScrollPosition();
    },
    onError: (error: any) => {
      toast({ 
        title: 'Failed to update menu item', 
        description: error.message || 'You may not have admin permissions. Please sign in with an admin account.',
        variant: 'destructive' 
      });
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
      restoreScrollPosition();
    },
  });

  const restoreItemMutation = useMutation({
    mutationFn: async (item: any) => {
      // Remove id to let Supabase generate a new one, but keep all other data
      const { id, created_at, updated_at, ...itemData } = item;
      const { error } = await supabase.from('menu_items').insert([itemData]);
      if (error) throw error;
    },
    onMutate: saveScrollPosition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-menu-items'] });
      toast({ title: 'Menu item restored successfully' });
      restoreScrollPosition();
    },
    onError: () => {
      toast({ title: 'Failed to restore item', variant: 'destructive' });
      restoreScrollPosition();
    },
  });

  const handleDeleteWithUndo = (item: any) => {
    // Clear any existing undo timeout
    if (undoableAction) {
      clearTimeout(undoableAction.timeoutId);
    }

    // Store the item for potential undo
    const timeoutId = setTimeout(() => {
      setUndoableAction(null);
    }, 10000); // 10 seconds to undo

    setUndoableAction({ type: 'delete', item, timeoutId });

    // Delete the item
    deleteItemMutation.mutate(item.id);

    // Show toast with undo button
    toast({
      title: 'Menu item deleted',
      description: (
        <div className="flex items-center justify-between w-full">
          <span>"{item.name}" was deleted</span>
          <Button
            size="sm"
            variant="outline"
            className="ml-4"
            onClick={() => {
              handleUndoDelete(item);
              dismiss();
            }}
          >
            <Undo2 className="h-4 w-4 mr-1" />
            Undo
          </Button>
        </div>
      ),
      duration: 10000,
    });
  };

  const handleUpdateWithUndo = (item: any, newData: typeof formData) => {
    // Clear any existing undo timeout
    if (undoableAction) {
      clearTimeout(undoableAction.timeoutId);
    }

    // Store the previous data for potential undo
    const previousData = {
      name: item.name,
      category: item.category,
      price: item.price,
      veg_nonveg: item.veg_nonveg,
      description: item.description,
      display_order: item.display_order,
    };

    const timeoutId = setTimeout(() => {
      setUndoableAction(null);
    }, 10000); // 10 seconds to undo

    setUndoableAction({ type: 'update', item, previousData, timeoutId });

    // Update the item
    updateItemMutation.mutate({ id: item.id, data: newData });

    // Show toast with undo button
    toast({
      title: 'Menu item updated',
      description: (
        <div className="flex items-center justify-between w-full">
          <span>"{newData.name}" was updated</span>
          <Button
            size="sm"
            variant="outline"
            className="ml-4"
            onClick={() => {
              handleUndoUpdate(item.id, previousData, newData.name);
              dismiss();
            }}
          >
            <Undo2 className="h-4 w-4 mr-1" />
            Undo
          </Button>
        </div>
      ),
      duration: 10000,
    });
  };

  const handleUndoDelete = (item: any) => {
    if (undoableAction) {
      clearTimeout(undoableAction.timeoutId);
      setUndoableAction(null);
    }
    restoreItemMutation.mutate(item);
  };

  const handleUndoUpdate = (itemId: string, previousData: typeof formData, itemName: string) => {
    if (undoableAction) {
      clearTimeout(undoableAction.timeoutId);
      setUndoableAction(null);
    }
    
    // Restore the previous data
    updateItemMutation.mutate({ id: itemId, data: previousData }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin-menu-items'] });
        toast({ title: `"${itemName}" reverted to previous state` });
        restoreScrollPosition();
      }
    });
  };

  const resetForm = (category?: string) => {
    setFormData({
      name: '',
      category: category || '',
      price: '',
      veg_nonveg: 'veg',
      description: '',
      display_order: 0,
    });
  };

  const startAddInCategory = (category: string) => {
    saveScrollPosition();
    resetForm(category);
    setEditingItem(null);
    setIsAddDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      handleUpdateWithUndo(editingItem, formData);
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

  // Group filtered items by category, maintaining the item order coming from display_order
  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, any[]>);

  // Match the website's category order (same order as Menu.tsx menuHierarchy subcategories)
  const normalizeCategory = (value: string) =>
    value
      .toUpperCase()
      .trim()
      .replace(/[—–−]/g, '-') // normalize long dashes
      .replace(/\s+/g, ' ');

  const websiteCategoryOrder = [
    'SOUP',
    'CHINESE VEG STARTER',
    'CHINESE NON-VEG STARTER',
    'MOMOS',
    'SHARINGS',
    'MAIN DISH CHINESE',
    'SIDE DISH - CHINESE',
    'PASTA',
    'PIZZA',
    'BURGER',
    'SANDWICHES',
    'SALAD',
    'JUICES',
    'DESSERTS',
    'MOJITOS',
    'MILKSHAKES',
  ].map(normalizeCategory);

  const getCategorySortIndex = (category: string) => {
    const idx = websiteCategoryOrder.indexOf(normalizeCategory(category));
    return idx === -1 ? Number.MAX_SAFE_INTEGER : idx;
  };

  const sortedCategories = Object.keys(groupedItems).sort((a, b) => {
    const diff = getCategorySortIndex(a) - getCategorySortIndex(b);
    return diff !== 0 ? diff : a.localeCompare(b);
  });

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
          <DialogContent
            className="max-w-2xl"
            onCloseAutoFocus={(e) => {
              // Prevent Radix from focusing the trigger button (at top of page), which causes scroll-to-top
              e.preventDefault();
              restoreScrollPosition();
            }}
          >
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
              <div className="flex items-center gap-3">
                <span className="text-sm font-normal text-muted-foreground">
                  {groupedItems[category].length} items
                </span>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => startAddInCategory(category)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Item
                </Button>
              </div>
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
                      onClick={() => handleDeleteWithUndo(item)}
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
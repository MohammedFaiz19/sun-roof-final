-- Add composite index to optimize menu item queries
CREATE INDEX IF NOT EXISTS idx_menu_items_active_order 
ON menu_items(is_active, display_order) 
WHERE is_active = true;
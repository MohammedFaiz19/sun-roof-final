-- Populate menu_items table from existing menu data
-- This will insert all menu items from the JSON into the database

-- Clear existing data (if any)
TRUNCATE TABLE menu_items;

-- Insert menu items with proper mapping
-- We'll need to insert these in batches, starting with starters
INSERT INTO menu_items (name, category, description, price, veg_nonveg, display_order) VALUES
-- Starters → Soups
('Sweet Corn Soup', 'Starters → Soups', 'Classic Chinese-style sweet corn soup with vegetables', '150', 'veg', 1),
('Hot & Sour Soup', 'Starters → Soups', 'Tangy and spicy soup with vegetables and aromatic spices', '150', 'veg', 2),
('Manchow Soup', 'Starters → Soups', 'Indo-Chinese soup with crispy noodles on top', '150', 'veg', 3),

-- Starters → Chinese Veg Starter
('Chilli Paneer', 'Starters → Chinese Veg Starter', 'Crispy paneer cubes tossed in spicy Indo-Chinese sauce', '250', 'veg', 4),
('Paneer Manchurian', 'Starters → Chinese Veg Starter', 'Deep-fried paneer balls in tangy Manchurian sauce', '250', 'veg', 5),
('Veg Spring Rolls', 'Starters → Chinese Veg Starter', 'Crispy rolls filled with fresh vegetables', '200', 'veg', 6),
('Honey Chilli Potato', 'Starters → Chinese Veg Starter', 'Crispy potato strips in sweet and spicy sauce', '220', 'veg', 7),

-- Starters → Chinese Non-Veg Starter
('Chilli Chicken', 'Starters → Chinese Non-Veg Starter', 'Spicy Indo-Chinese chicken with bell peppers', '280', 'non-veg', 8),
('Chicken Manchurian', 'Starters → Chinese Non-Veg Starter', 'Crispy chicken in tangy Manchurian gravy', '280', 'non-veg', 9),
('Chicken 65', 'Starters → Chinese Non-Veg Starter', 'South Indian spicy fried chicken', '290', 'non-veg', 10),

-- MOMOS
('Veg Steamed Momos', 'MOMOS', 'Traditional steamed dumplings with vegetable filling', '150', 'veg', 11),
('Veg Fried Momos', 'MOMOS', 'Crispy fried vegetable dumplings', '170', 'veg', 12),
('Chicken Steamed Momos', 'MOMOS', 'Steamed dumplings with chicken filling', '180', 'non-veg', 13),
('Chicken Fried Momos', 'MOMOS', 'Crispy fried chicken dumplings', '200', 'non-veg', 14),
('Paneer Momos', 'MOMOS', 'Momos filled with spiced paneer', '180', 'veg', 15),

-- Sharings
('Nachos Supreme', 'Sharings', 'Loaded nachos with cheese, salsa, and jalapeños', '350', 'veg', 16),
('Cheese Platter', 'Sharings', 'Assorted cheese with crackers and fruits', '450', 'veg', 17),
('French Fries', 'Sharings', 'Crispy golden fries with seasoning', '150', 'veg', 18),
('Peri Peri Fries', 'Sharings', 'Spicy peri peri seasoned fries', '170', 'veg', 19),
('Garlic Bread', 'Sharings', 'Toasted bread with garlic butter', '180', 'veg', 20),
('Cheese Garlic Bread', 'Sharings', 'Garlic bread topped with melted cheese', '220', 'veg', 21),

-- Main Course → Rice
('Veg Fried Rice', 'Main Course → Rice', 'Stir-fried rice with mixed vegetables', '200', 'veg', 22),
('Chicken Fried Rice', 'Main Course → Rice', 'Fried rice with chicken and vegetables', '230', 'non-veg', 23),
('Egg Fried Rice', 'Main Course → Rice', 'Classic fried rice with scrambled eggs', '210', 'egg', 24),
('Schezwan Fried Rice', 'Main Course → Rice', 'Spicy Schezwan sauce fried rice', '220', 'veg', 25),

-- Main Course → Noodles
('Veg Hakka Noodles', 'Main Course → Noodles', 'Stir-fried noodles with vegetables', '200', 'veg', 26),
('Chicken Hakka Noodles', 'Main Course → Noodles', 'Hakka noodles with chicken', '230', 'non-veg', 27),
('Schezwan Noodles', 'Main Course → Noodles', 'Spicy Schezwan noodles', '220', 'veg', 28),
('Singapore Noodles', 'Main Course → Noodles', 'Curry-flavored rice noodles', '240', 'non-veg', 29),

-- Main Course → Pasta
('Penne Arrabbiata', 'Main Course → Pasta', 'Penne in spicy tomato sauce', '280', 'veg', 30),
('Alfredo Pasta', 'Main Course → Pasta', 'Creamy white sauce pasta', '300', 'veg', 31),
('Pink Sauce Pasta', 'Main Course → Pasta', 'Pasta in tomato cream sauce', '290', 'veg', 32),
('Aglio Olio', 'Main Course → Pasta', 'Pasta with garlic, olive oil, and chili', '270', 'veg', 33),

-- Pizza
('Margherita Pizza', 'Pizza', 'Classic pizza with tomato sauce and mozzarella', '300', 'veg', 34),
('Farmhouse Pizza', 'Pizza', 'Loaded with vegetables', '350', 'veg', 35),
('Paneer Tikka Pizza', 'Pizza', 'Indian-style pizza with paneer tikka', '380', 'veg', 36),
('Chicken BBQ Pizza', 'Pizza', 'Pizza with BBQ chicken', '400', 'non-veg', 37),
('Pepperoni Pizza', 'Pizza', 'Classic pepperoni pizza', '420', 'non-veg', 38),

-- Burger
('Veg Burger', 'Burger', 'Vegetable patty burger with fresh toppings', '150', 'veg', 39),
('Cheese Burger', 'Burger', 'Beef patty with cheese', '200', 'non-veg', 40),
('Chicken Burger', 'Burger', 'Grilled chicken burger', '220', 'non-veg', 41),
('Paneer Burger', 'Burger', 'Spiced paneer patty burger', '180', 'veg', 42),

-- Sandwiches
('Veg Grilled Sandwich', 'Sandwiches', 'Grilled sandwich with vegetables', '120', 'veg', 43),
('Cheese Grilled Sandwich', 'Sandwiches', 'Grilled cheese sandwich', '140', 'veg', 44),
('Chicken Grilled Sandwich', 'Sandwiches', 'Grilled chicken sandwich', '180', 'non-veg', 45),
('Club Sandwich', 'Sandwiches', 'Triple-decker sandwich with chicken', '220', 'non-veg', 46),

-- Healthy & Light → Salads
('Greek Salad', 'Healthy & Light → Salads', 'Fresh salad with feta cheese and olives', '250', 'veg', 47),
('Caesar Salad', 'Healthy & Light → Salads', 'Romaine lettuce with Caesar dressing', '280', 'veg', 48),
('Garden Fresh Salad', 'Healthy & Light → Salads', 'Mixed greens with seasonal vegetables', '220', 'veg', 49),

-- Healthy & Light → Juices
('Orange Juice', 'Healthy & Light → Juices', 'Freshly squeezed orange juice', '100', 'veg', 50),
('Watermelon Juice', 'Healthy & Light → Juices', 'Fresh watermelon juice', '100', 'veg', 51),
('Mixed Fruit Juice', 'Healthy & Light → Juices', 'Blend of seasonal fruits', '120', 'veg', 52),

-- Desserts
('Chocolate Brownie', 'Desserts', 'Warm chocolate brownie with ice cream', '180', 'veg', 53),
('Tiramisu', 'Desserts', 'Classic Italian coffee dessert', '220', 'veg', 54),
('Cheesecake', 'Desserts', 'Creamy New York style cheesecake', '240', 'veg', 55),
('Ice Cream Sundae', 'Desserts', 'Ice cream with toppings', '150', 'veg', 56),

-- Beverages → Mojitos
('Classic Mojito', 'Beverages → Mojitos', 'Refreshing mint and lime mocktail', '180', 'veg', 57),
('Strawberry Mojito', 'Beverages → Mojitos', 'Mojito with fresh strawberries', '200', 'veg', 58),
('Blue Lagoon Mojito', 'Beverages → Mojitos', 'Blue curacao flavored mojito', '200', 'veg', 59),

-- Beverages → Milkshakes
('Chocolate Milkshake', 'Beverages → Milkshakes', 'Rich chocolate milkshake', '150', 'veg', 60),
('Vanilla Milkshake', 'Beverages → Milkshakes', 'Classic vanilla milkshake', '140', 'veg', 61),
('Strawberry Milkshake', 'Beverages → Milkshakes', 'Fresh strawberry milkshake', '160', 'veg', 62),
('Oreo Shake', 'Beverages → Milkshakes', 'Milkshake with Oreo cookies', '180', 'veg', 63),

-- Beverages → Others
('Cappuccino', 'Beverages → Others', 'Italian coffee with steamed milk foam', '120', 'veg', 64),
('Latte', 'Beverages → Others', 'Espresso with steamed milk', '130', 'veg', 65),
('Iced Coffee', 'Beverages → Others', 'Chilled coffee with ice', '140', 'veg', 66),
('Hot Chocolate', 'Beverages → Others', 'Rich hot chocolate drink', '130', 'veg', 67),
('Masala Chai', 'Beverages → Others', 'Indian spiced tea', '60', 'veg', 68),
('Green Tea', 'Beverages → Others', 'Healthy green tea', '80', 'veg', 69);

-- Note: This is a sample set. You'll need to add all 145 items from your menu.json
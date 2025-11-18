export interface MenuItem {
  name: string;
  price: string | { veg?: string; chicken?: string; nonVeg?: string };
  description?: string;
  type?: "veg" | "non-veg";
}

export interface MenuCategory {
  id: string;
  title: string;
  items: MenuItem[];
}

export const menuData: MenuCategory[] = [
  {
    id: "soup",
    title: "Soup",
    items: [
      { name: "Lung Fung Soup", price: "114", description: "Rich and flavorful soup with mushrooms, vegetables, blended egg white, garlic & soy sauce" },
      { name: "Chicken Wonton Soup", price: "144", description: "Tender wontons filled with chicken, simmered in a comforting broth with garlic & ginger" },
      { name: "Manchow Soup", price: { veg: "114", chicken: "134" }, description: "Spicy soup with mushroom, veggies, fried noodles, garlic & ginger" },
      { name: "Sweet Corn Soup", price: { veg: "104", chicken: "114" }, description: "Creamy corn soup with tender kernels & vegetables" },
      { name: "Hot n Sour Soup", price: { veg: "104", chicken: "114" }, description: "Tangy & spicy soup with vinegar, soy, chili & vegetables" },
    ],
  },
  {
    id: "chinese-veg",
    title: "Chinese Veg Starter",
    items: [
      { name: "Gobi Manchurian", price: "94" },
      { name: "Honey Chilli Potato", price: "104" },
      { name: "Crispy Chili Babycorn", price: "164" },
      { name: "BBQ Paneer Stick", price: "174" },
      { name: "Dragon Paneer", price: "194" },
      { name: "Crispy Chili Mushroom", price: "194" },
    ],
  },
  {
    id: "chinese-nonveg",
    title: "Chinese Non-Veg Starter",
    items: [
      { name: "Chicken 65", price: "124" },
      { name: "Hot Wings", price: "166" },
      { name: "Crispy Wings", price: "166" },
      { name: "Glazed Chicken Wings", price: "172" },
      { name: "Chicken Lollypop", price: "172" },
      { name: "Drums of Heaven", price: "158" },
      { name: "Fish Salt & Pepper", price: "176" },
      { name: "Chilli Chicken with Bone", price: "190" },
      { name: "Dragon Chicken", price: "158" },
      { name: "Lemon Basil Chicken", price: "196" },
      { name: "Golden Fried Prawn", price: "286" },
      { name: "Chicken Popcorn", price: "99/149" },
    ],
  },
  {
    id: "momos",
    title: "Momos",
    items: [
      { name: "Chicken Steamed", price: "94" },
      { name: "Chicken Fried", price: "124" },
      { name: "Chicken Pan Fried", price: "124" },
      { name: "Chicken BBQ", price: "149" },
      { name: "Chicken Szechuan", price: "169" },
      { name: "Chicken Chilli", price: "169" },
    ],
  },
  {
    id: "sharings",
    title: "Sharings",
    items: [
      { name: "French Fries", price: "99" },
      { name: "Piri Piri Fries", price: "110" },
      { name: "Cheese Garlic Bread", price: "125" },
      { name: "Jalapeno Toast", price: "125" },
      { name: "American Corn", price: "142" },
      { name: "Mexican Nachos Non-Veg", price: "148" },
      { name: "Cheesy French Fries", price: "149" },
      { name: "Mexican Nachos with Salsa", price: "172" },
      { name: "Prawn Tempura", price: "284" },
      { name: "Loaded Fries", price: "229" },
    ],
  },
  {
    id: "rice",
    title: "Rice",
    items: [
      { name: "Fried Rice", price: { veg: "124", chicken: "154" } },
      { name: "Burnt Garlic Rice", price: { veg: "134", chicken: "164" } },
      { name: "Chili Garlic Rice", price: { veg: "134", chicken: "164" } },
      { name: "Schezuan Rice", price: { veg: "144", chicken: "174" } },
      { name: "Hongkong Rice", price: { veg: "144", chicken: "179" } },
      { name: "Singapore Rice", price: { veg: "154", chicken: "184" } },
    ],
  },
  {
    id: "noodles",
    title: "Noodles",
    items: [
      { name: "Hakka Noodles", price: { veg: "124", chicken: "154" } },
      { name: "Burnt Garlic Noodles", price: { veg: "134", chicken: "164" } },
      { name: "Chili Garlic Noodles", price: { veg: "134", chicken: "164" } },
      { name: "Schezuan Noodles", price: { veg: "144", chicken: "174" } },
      { name: "Hongkong Noodles", price: { veg: "144", chicken: "179" } },
      { name: "Singapore Noodles", price: { veg: "154", chicken: "184" } },
    ],
  },
  {
    id: "side-dish",
    title: "Side Dish Chinese",
    items: [
      { name: "Chili Mushroom", price: "169" },
      { name: "Chili Paneer", price: "179" },
      { name: "Mushroom Babycorn", price: "199" },
      { name: "Chili Chicken Boneless", price: "149" },
      { name: "Chicken Manchurian", price: "149" },
      { name: "Garlic Chicken", price: "179" },
      { name: "Hot Garlic Chicken", price: "149" },
      { name: "Chicken in Wine & Chili", price: "179" },
      { name: "Sweet & Sour Chicken", price: "149" },
      { name: "Kung Pao Chicken", price: "199" },
      { name: "Chili Fish", price: "150" },
      { name: "Fish Manchurian", price: "179" },
      { name: "Lemon Pepper Fish", price: "150" },
      { name: "Fish in Wine & Chili", price: "209" },
      { name: "Prawn Chili", price: "264" },
      { name: "Schezhuan Prawn", price: "269" },
      { name: "Lemon Chili Prawn", price: "279" },
      { name: "Prawn in Oyster Sauce", price: "309" },
    ],
  },
  {
    id: "pasta",
    title: "Pasta",
    items: [
      { name: "Creamy Alfredo Pasta", price: { veg: "229", nonVeg: "238" } },
      { name: "Penne Pungi Pasta", price: { veg: "226", nonVeg: "246" } },
      { name: "Arrabbiata Pasta", price: { veg: "229", nonVeg: "279" } },
      { name: "Alfrose Pasta", price: { veg: "229", nonVeg: "279" } },
      { name: "Cilantro Mushroom Pasta", price: { veg: "209", nonVeg: "239" } },
      { name: "Creamy Pesto Pasta", price: { veg: "219", nonVeg: "249" } },
    ],
  },
  {
    id: "pizza",
    title: "Pizza",
    items: [
      { name: "Pesto Pizza", price: "289" },
      { name: "Paneer Delight Pizza", price: "249" },
      { name: "Mushroom Farm Pizza", price: "239" },
      { name: "BBQ Chicken Pizza", price: "239" },
      { name: "Piri Piri Chicken Pizza", price: "269" },
    ],
  },
  {
    id: "burger",
    title: "Burger",
    items: [
      { name: "Aloo Tikki Burger", price: "109" },
      { name: "Classic Veg Burger", price: "124" },
      { name: "Classic Chicken Burger", price: "148" },
      { name: "Veg Double Patty Burger", price: "159" },
      { name: "Angry Bird Chicken Burger", price: "169" },
    ],
  },
  {
    id: "sandwiches",
    title: "Sandwiches",
    items: [
      { name: "Veg Classic Grilled Sandwich", price: "117" },
      { name: "Corn Cheese Grilled Sandwich", price: "124" },
      { name: "Tangy Paneer Sandwich", price: "174" },
      { name: "Classic Grilled Chicken", price: "129" },
      { name: "Piri Piri Chicken Sandwich", price: "159" },
      { name: "BBQ Chicken Sandwich", price: "172" },
    ],
  },
  {
    id: "salad",
    title: "Salad",
    items: [
      { name: "Watermelon Feta Salad", price: "99" },
      { name: "Pineapple Mint Salad", price: "129" },
      { name: "Caesar Salad", price: "129" },
    ],
  },
  {
    id: "juices",
    title: "Juices",
    items: [
      { name: "Watermelon", price: "59" },
      { name: "Pineapple", price: "79" },
      { name: "Seasonal Fruit", price: "75" },
      { name: "Perky Pineapple", price: "109" },
    ],
  },
  {
    id: "dessert",
    title: "Desserts",
    items: [
      { name: "Chocolate Walnut Brownie", price: "89" },
      { name: "Brownie with Icecream", price: "119" },
      { name: "Brownie with Hot Chocolate", price: "149" },
      { name: "Brownie Sizzler", price: "149" },
      { name: "Vanilla Ice Cream", price: "49" },
      { name: "Strawberry Ice Cream", price: "59" },
      { name: "Chocolate Ice Cream", price: "49" },
      { name: "Butterscotch Ice Cream", price: "65" },
      { name: "3 in 1 Ice Cream", price: "89" },
    ],
  },
  {
    id: "mojitos",
    title: "Mojitos",
    items: [
      { name: "Blue Curacao", price: "89" },
      { name: "Lemon Mojito", price: "89" },
      { name: "Kiwi Mojito", price: "89" },
      { name: "Pineapple Mojito", price: "109" },
      { name: "Watermelon Mojito", price: "89" },
      { name: "Blueberry Mojito", price: "89" },
      { name: "Green Apple", price: "89" },
      { name: "Minty Lime Fizz", price: "89" },
    ],
  },
  {
    id: "milkshakes",
    title: "Milkshakes",
    items: [
      { name: "Vanilla", price: "79" },
      { name: "Chocolate", price: "89" },
      { name: "Banana", price: "89" },
      { name: "Chocolate Banana", price: "89" },
      { name: "Ice Coffee", price: "110" },
      { name: "Sweet Lassi", price: "79" },
      { name: "Papaya Punch", price: "99" },
      { name: "Pina Colada Freeze", price: "119" },
      { name: "Oreo Milkshake", price: "119" },
    ],
  },
];

export const menuSections = [
  { id: "starters", title: "Starters", categories: ["soup", "chinese-veg", "chinese-nonveg", "momos", "sharings"] },
  { id: "main-course", title: "Main Course", categories: ["rice", "noodles", "side-dish", "pasta", "pizza", "burger", "sandwiches"] },
  { id: "healthy", title: "Healthy & Light", categories: ["salad", "juices"] },
  { id: "desserts", title: "Desserts", categories: ["dessert"] },
  { id: "beverages", title: "Beverages", categories: ["mojitos", "milkshakes"] },
];

import chineseChickenImg from "@/assets/food/chinese-chicken.jpg";
import saladImg from "@/assets/food/salad.jpg";
import soupImg from "@/assets/food/soup.jpg";
import pizzaImg from "@/assets/food/pizza.jpg";
import pastaImg from "@/assets/food/pasta.jpg";
import burgerImg from "@/assets/food/burger.jpg";
import momosImg from "@/assets/food/momos.jpg";
import dessertImg from "@/assets/food/dessert.jpg";
import mojitoImg from "@/assets/food/mojito.jpg";
import milkshakeImg from "@/assets/food/milkshake.jpg";
import riceImg from "@/assets/food/rice.jpg";
import noodlesImg from "@/assets/food/noodles.jpg";
import mojitosCoverImg from "@/assets/menu-covers/mojitos-cover.jpg";
import milkshakesCoverImg from "@/assets/menu-covers/milkshakes-cover.jpg";
import saladJuicesCoverImg from "@/assets/menu-covers/salad-juices-cover.jpg";

export const categoryImages: Record<string, string> = {
  soup: soupImg,
  "chinese-veg": chineseChickenImg,
  "chinese-nonveg": chineseChickenImg,
  momos: momosImg,
  sharings: burgerImg,
  rice: riceImg,
  noodles: noodlesImg,
  "side-dish": chineseChickenImg,
  pasta: pastaImg,
  pizza: pizzaImg,
  burger: burgerImg,
  sandwiches: burgerImg,
  salad: saladJuicesCoverImg,
  juices: saladJuicesCoverImg,
  dessert: dessertImg,
  mojitos: mojitosCoverImg,
  milkshakes: milkshakesCoverImg,
};

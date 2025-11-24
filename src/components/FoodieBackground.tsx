import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import burgerSticker from "@/assets/food-stickers/burger-sticker.png";
import pizzaSticker from "@/assets/food-stickers/pizza-sticker.png";
import friesSticker from "@/assets/food-stickers/fries-sticker.png";
import coffeeSticker from "@/assets/food-stickers/coffee-sticker.png";
import icecreamSticker from "@/assets/food-stickers/icecream-sticker.png";
import noodlesSticker from "@/assets/food-stickers/noodles-sticker.png";
import cupcakeSticker from "@/assets/food-stickers/cupcake-sticker.png";
import donutSticker from "@/assets/food-stickers/donut-sticker.png";
import tacoSticker from "@/assets/food-stickers/taco-sticker.png";
import sushiSticker from "@/assets/food-stickers/sushi-sticker.png";

export type IntensityLevel = "light" | "medium" | "heavy";

interface FoodieBackgroundProps {
  intensity?: IntensityLevel;
}

const foodStickers = [
  { src: burgerSticker, name: "burger" },
  { src: pizzaSticker, name: "pizza" },
  { src: friesSticker, name: "fries" },
  { src: coffeeSticker, name: "coffee" },
  { src: icecreamSticker, name: "icecream" },
  { src: noodlesSticker, name: "noodles" },
  { src: cupcakeSticker, name: "cupcake" },
  { src: donutSticker, name: "donut" },
  { src: tacoSticker, name: "taco" },
  { src: sushiSticker, name: "sushi" },
];

const intensityConfig = {
  light: { count: 8, maxSize: 80, minSize: 40 },
  medium: { count: 15, maxSize: 100, minSize: 50 },
  heavy: { count: 25, maxSize: 120, minSize: 60 },
};

// Generate random positions and animations
const generateStickerProps = (index: number, intensity: IntensityLevel) => {
  const config = intensityConfig[intensity];
  const sticker = foodStickers[index % foodStickers.length];
  
  return {
    sticker,
    size: Math.random() * (config.maxSize - config.minSize) + config.minSize,
    x: Math.random() * 100,
    y: Math.random() * 100,
    rotation: Math.random() * 360,
    duration: 15 + Math.random() * 15, // 15-30 seconds
    delay: Math.random() * 5,
    xOffset: (Math.random() - 0.5) * 30,
    yOffset: (Math.random() - 0.5) * 30,
    rotationOffset: (Math.random() - 0.5) * 45,
  };
};

export const FoodieBackground = ({ intensity = "medium" }: FoodieBackgroundProps) => {
  const [stickers, setStickers] = useState<ReturnType<typeof generateStickerProps>[]>([]);

  useEffect(() => {
    const config = intensityConfig[intensity];
    const newStickers = Array.from({ length: config.count }, (_, i) => 
      generateStickerProps(i, intensity)
    );
    setStickers(newStickers);
  }, [intensity]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/90 to-background/95" />
      
      {stickers.map((props, index) => (
        <motion.div
          key={`${props.sticker.name}-${index}`}
          className="absolute"
          style={{
            left: `${props.x}%`,
            top: `${props.y}%`,
            width: `${props.size}px`,
            height: `${props.size}px`,
          }}
          initial={{
            x: 0,
            y: 0,
            rotate: props.rotation,
            opacity: 0.6,
          }}
          animate={{
            x: [0, props.xOffset, -props.xOffset, 0],
            y: [0, props.yOffset, -props.yOffset, 0],
            rotate: [
              props.rotation,
              props.rotation + props.rotationOffset,
              props.rotation - props.rotationOffset,
              props.rotation,
            ],
            opacity: [0.4, 0.7, 0.5, 0.4],
          }}
          transition={{
            duration: props.duration,
            delay: props.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <img
            src={props.sticker.src}
            alt=""
            className="w-full h-full object-contain drop-shadow-lg"
            loading="lazy"
          />
        </motion.div>
      ))}
    </div>
  );
};

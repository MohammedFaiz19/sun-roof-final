import { motion } from "framer-motion";
import cornSoupCartoon from "@/assets/soup-animations/corn-soup-cartoon.png";
import hotSourCartoon from "@/assets/soup-animations/hot-sour-cartoon.png";
import mushroomSoupCartoon from "@/assets/soup-animations/mushroom-soup-cartoon.png";
import wontonSoupCartoon from "@/assets/soup-animations/wonton-soup-cartoon.png";
import manchowSoupCartoon from "@/assets/soup-animations/manchow-soup-cartoon.png";
import cornSoupRealistic from "@/assets/soup-animations/corn-soup-realistic.png";
import hotSourRealistic from "@/assets/soup-animations/hot-sour-realistic.png";
import steamMinimal from "@/assets/soup-animations/steam-minimal.png";

export type AnimationStyle = "cartoon" | "realistic" | "minimal" | "sticker";

interface SoupAnimationProps {
  soupName: string;
  style?: AnimationStyle;
  className?: string;
}

const soupImageMap = {
  cartoon: {
    "sweet corn soup": cornSoupCartoon,
    "hot & sour soup": hotSourCartoon,
    "hot n sour soup": hotSourCartoon,
    "lung fung soup": mushroomSoupCartoon,
    "chicken wonton soup": wontonSoupCartoon,
    "manchow soup": manchowSoupCartoon,
  },
  realistic: {
    "sweet corn soup": cornSoupRealistic,
    "hot & sour soup": hotSourRealistic,
    "hot n sour soup": hotSourRealistic,
  },
  minimal: {
    default: steamMinimal,
  },
  sticker: {
    "sweet corn soup": cornSoupCartoon,
    "hot & sour soup": hotSourCartoon,
    "hot n sour soup": hotSourCartoon,
    "lung fung soup": mushroomSoupCartoon,
    "chicken wonton soup": wontonSoupCartoon,
    "manchow soup": manchowSoupCartoon,
  }
};

const getSoupImage = (soupName: string, style: AnimationStyle = "cartoon"): string | null => {
  const normalizedName = soupName.toLowerCase();
  const styleMap = soupImageMap[style];
  
  // Try to find exact match
  if (styleMap[normalizedName as keyof typeof styleMap]) {
    return styleMap[normalizedName as keyof typeof styleMap];
  }
  
  // Try partial match
  for (const [key, value] of Object.entries(styleMap)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return value;
    }
  }
  
  // Return default for minimal style
  if (style === "minimal" && "default" in styleMap) {
    return styleMap.default;
  }
  
  return null;
};

export const SoupAnimation = ({ 
  soupName, 
  style = "cartoon",
  className = "" 
}: SoupAnimationProps) => {
  const imageSrc = getSoupImage(soupName, style);
  
  if (!imageSrc) return null;

  // Animation variants based on style
  const animationVariants = {
    cartoon: {
      animate: {
        y: [0, -8, 0],
        rotate: [0, 2, -2, 0],
      },
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut" as const,
      }
    },
    realistic: {
      animate: {
        scale: [1, 1.02, 1],
        opacity: [0.9, 1, 0.9],
      },
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut" as const,
      }
    },
    minimal: {
      animate: {
        y: [0, -12, 0],
        opacity: [0.6, 1, 0.6],
      },
      transition: {
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut" as const,
      }
    },
    sticker: {
      animate: {
        y: [0, -6, 0],
        scale: [1, 1.05, 1],
      },
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut" as const,
      }
    }
  };

  const animation = animationVariants[style];

  return (
    <motion.div
      className={`soup-animation ${className}`}
      animate={animation.animate}
      transition={animation.transition}
      style={{
        willChange: "transform",
      }}
    >
      <img 
        src={imageSrc} 
        alt={`${soupName} animation`}
        className="w-full h-full object-contain"
        loading="lazy"
        style={{
          filter: style === "realistic" ? "drop-shadow(0 4px 12px rgba(0,0,0,0.2))" : "none",
        }}
      />
      
      {/* Additional steam effect for realistic style */}
      {style === "realistic" && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-full h-full bg-gradient-to-t from-transparent via-white/10 to-transparent" />
        </motion.div>
      )}
    </motion.div>
  );
};

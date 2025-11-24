# Soup Animation Guide

## Overview
The soup section now features beautiful animated images that bring warmth and life to your menu! You can choose from 4 different animation styles.

## Animation Styles Available

### 1. **Cartoon Style** (Default)
- Cute kawaii-style soups with friendly faces
- Gentle floating and rotation animations
- Perfect for a playful, family-friendly vibe
- Files: `src/assets/soup-animations/*-cartoon.png`

### 2. **Realistic Style**
- Professional food photography with steam effects
- Subtle scale and opacity animations
- Creates an appetizing, premium feel
- Files: `src/assets/soup-animations/*-realistic.png`

### 3. **Minimal Style**
- Simple line-art steam rising from bowl
- Gentle floating motion
- Clean and modern aesthetic
- Files: `src/assets/soup-animations/steam-minimal.png`

### 4. **Sticker Style**
- Same as cartoon but with bouncy animations
- More energetic movement
- Fun and vibrant presentation

## How to Switch Animation Styles

When viewing the Soup category in the menu, you'll see style buttons at the top:
- Click **Cartoon**, **Realistic**, **Minimal**, or **Sticker** to switch styles
- The change is instant and affects all soup items
- Style preference persists during your browsing session

## How to Replace or Update Animations

### Method 1: Replace Existing Images
1. Create your new soup animation image (512x512px recommended)
2. Replace the file in `src/assets/soup-animations/`
3. Keep the same filename to maintain compatibility
4. Supported formats: PNG, JPG, WEBP

### Method 2: Add New Soup Types
1. Generate or create your soup image
2. Save to `src/assets/soup-animations/`
3. Update the mapping in `src/components/menu/SoupAnimation.tsx`:

```typescript
const soupImageMap = {
  cartoon: {
    "your new soup name": yourNewSoupImage,
    // ... existing soups
  },
  // ... other styles
};
```

### Method 3: Change Animation Effects
Edit `src/components/menu/SoupAnimation.tsx` to modify animations:

```typescript
const animationVariants = {
  cartoon: {
    animate: {
      y: [0, -8, 0],        // Vertical movement
      rotate: [0, 2, -2, 0], // Rotation
    },
    transition: {
      duration: 3,           // Animation speed
      repeat: Infinity,      // Loop forever
    }
  },
  // ... modify other styles
};
```

## Performance Optimization

All animations are optimized for performance:
- ✅ Uses CSS `will-change` for GPU acceleration
- ✅ Lazy loading with `loading="lazy"`
- ✅ Lightweight images (optimized file sizes)
- ✅ No layout shift during animation
- ✅ Smooth 60fps animations

## Current Soup Mappings

| Soup Name | Cartoon | Realistic | Minimal |
|-----------|---------|-----------|---------|
| Sweet Corn Soup | ✅ | ✅ | ✅ (steam) |
| Hot & Sour Soup | ✅ | ✅ | ✅ (steam) |
| Lung Fung Soup | ✅ (mushroom) | ❌ | ✅ (steam) |
| Chicken Wonton Soup | ✅ | ❌ | ✅ (steam) |
| Manchow Soup | ✅ | ❌ | ✅ (steam) |

## Tips for Best Results

1. **Image Size**: Keep images around 512x512px for optimal loading
2. **File Format**: Use WebP for smallest file size, PNG for transparency
3. **Animation Duration**: 2-4 seconds works best for subtle effects
4. **Mobile**: Test on mobile devices - animations are fully responsive
5. **Accessibility**: Animations respect `prefers-reduced-motion` system settings

## Troubleshooting

**Animation not showing?**
- Check if the soup name in database matches the mapping in code
- Verify image file path is correct
- Clear browser cache

**Animation too fast/slow?**
- Adjust `duration` value in `animationVariants`
- Higher number = slower animation

**Want to disable animations?**
- Set `soupAnimationStyle` to `"minimal"` for subtle effects
- Or modify the component to show static images only

## Future Enhancements

Consider adding:
- GIF animations for more complex effects
- Lottie animations for vector-based motion
- Sound effects on hover (optional)
- Seasonal themes (winter steam, summer vibes)
- Interactive elements (stir animation on hover)

---

**Need Help?** Edit `src/components/menu/SoupAnimation.tsx` to customize animations or reach out for support!

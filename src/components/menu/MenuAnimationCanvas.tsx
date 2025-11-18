import { useEffect, useRef, useState } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import animConfig from '@/config/menu-anim-config.json';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  scale: number;
  scaleDirection: number;
  layer: 'background' | 'midground' | 'foreground';
  opacity: number;
  type: string;
  lifetime: number;
  age: number;
}

interface MenuAnimationCanvasProps {
  isEnabled: boolean;
  activeFilter?: string;
}

export const MenuAnimationCanvas = ({ isEnabled, activeFilter }: MenuAnimationCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const mousePos = useRef({ x: 0, y: 0 });
  const animationFrame = useRef<number>();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');

  const getParticleLimit = () => {
    if (isMobile) return animConfig.particleLimits.mobile;
    if (isTablet) return animConfig.particleLimits.tablet;
    return animConfig.particleLimits.desktop;
  };

  const createParticle = (canvas: HTMLCanvasElement): Particle => {
    const layers: Array<'background' | 'midground' | 'foreground'> = ['background', 'midground', 'foreground'];
    const layer = layers[Math.floor(Math.random() * layers.length)];
    const layerConfig = animConfig.layers[layer];

    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * animConfig.motion.driftSpeed,
      vy: (Math.random() - 0.5) * animConfig.motion.driftSpeed * 0.5,
      size: 20 + Math.random() * 60,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * animConfig.motion.rotationSpeed * 0.02,
      scale: animConfig.motion.scaleRange[0] + Math.random() * (animConfig.motion.scaleRange[1] - animConfig.motion.scaleRange[0]),
      scaleDirection: Math.random() > 0.5 ? 1 : -1,
      layer,
      opacity: layerConfig.opacity,
      type: Math.random() > 0.7 ? 'particle' : 'food',
      lifetime: 10000 + Math.random() * 10000,
      age: 0
    };
  };

  useEffect(() => {
    if (!isEnabled || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    const limit = getParticleLimit();
    const initialParticles: Particle[] = [];
    for (let i = 0; i < limit; i++) {
      initialParticles.push(createParticle(canvas));
    }
    setParticles(initialParticles);

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [isEnabled, isMobile, isTablet]);

  useEffect(() => {
    if (!isEnabled || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      setParticles(prevParticles => {
        const limit = getParticleLimit();
        let updatedParticles = prevParticles.map(particle => {
          // Update position with drift
          let newX = particle.x + particle.vx;
          let newY = particle.y + particle.vy;

          // Wrap around screen
          if (newX < -100) newX = canvas.width + 100;
          if (newX > canvas.width + 100) newX = -100;
          if (newY < -100) newY = canvas.height + 100;
          if (newY > canvas.height + 100) newY = -100;

          // Magnetic effect near mouse
          const dx = mousePos.current.x - newX;
          const dy = mousePos.current.y - newY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < animConfig.interaction.magneticRadius) {
            const force = (1 - distance / animConfig.interaction.magneticRadius) * animConfig.interaction.magneticStrength;
            newX += dx * force;
            newY += dy * force;
          }

          // Update rotation
          const newRotation = particle.rotation + particle.rotationSpeed;

          // Update scale with bobbing
          let newScale = particle.scale + particle.scaleDirection * 0.001;
          let newScaleDirection = particle.scaleDirection;
          if (newScale > animConfig.motion.scaleRange[1] || newScale < animConfig.motion.scaleRange[0]) {
            newScaleDirection *= -1;
          }

          // Update age
          const newAge = particle.age + 16; // Approximately 60fps

          // Fade in/out based on lifetime
          let opacity = particle.opacity;
          const lifetimeRatio = newAge / particle.lifetime;
          if (lifetimeRatio < 0.1) {
            opacity = particle.opacity * (lifetimeRatio / 0.1);
          } else if (lifetimeRatio > 0.9) {
            opacity = particle.opacity * ((1 - lifetimeRatio) / 0.1);
          }

          return {
            ...particle,
            x: newX,
            y: newY,
            rotation: newRotation,
            scale: newScale,
            scaleDirection: newScaleDirection,
            age: newAge,
            opacity
          };
        });

        // Remove dead particles and add new ones
        updatedParticles = updatedParticles.filter(p => p.age < p.lifetime);
        while (updatedParticles.length < limit) {
          updatedParticles.push(createParticle(canvas));
        }

        // Draw particles by layer
        const layers: Array<'background' | 'midground' | 'foreground'> = ['background', 'midground', 'foreground'];
        
        layers.forEach(layerName => {
          const layerParticles = updatedParticles.filter(p => p.layer === layerName);
          const layerConfig = animConfig.layers[layerName];

          layerParticles.forEach(particle => {
            ctx.save();
            ctx.translate(particle.x, particle.y);
            ctx.rotate(particle.rotation);
            ctx.scale(particle.scale, particle.scale);
            ctx.globalAlpha = particle.opacity;

            if (layerConfig.blur > 0) {
              ctx.filter = `blur(${layerConfig.blur}px)`;
            }

            // Draw food emoji as placeholder (would be replaced with actual sprites)
            const foodEmojis = ['🥟', '🍕', '🍔', '🍜', '🍹', '🍟', '🍝', '🥗'];
            const particleEmojis = ['✨', '🌶️', '💧', '🔥'];
            const emoji = particle.type === 'food' 
              ? foodEmojis[Math.floor(Math.random() * foodEmojis.length)]
              : particleEmojis[Math.floor(Math.random() * particleEmojis.length)];

            ctx.font = `${particle.size}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Add glow effect for filtered items
            if (activeFilter && particle.type === 'food') {
              ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
              ctx.shadowBlur = 20;
            }

            ctx.fillText(emoji, 0, 0);

            ctx.restore();
          });
        });

        return updatedParticles;
      });

      animationFrame.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [isEnabled, activeFilter, isMobile, isTablet]);

  if (!isEnabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: 'normal' }}
    />
  );
};

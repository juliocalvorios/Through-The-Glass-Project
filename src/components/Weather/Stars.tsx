'use client'

import { memo, useMemo } from 'react'
import { motion } from 'framer-motion'

interface StarsProps {
  count?: number
  showMoon?: boolean
}

interface Star {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  twinkleDelay: number
  twinkleDuration: number
  type: 'point' | 'cross' | 'diamond'
}

function StarsComponent({ count = 50, showMoon = true }: StarsProps) {
  // Generar estrellas con diferentes tipos y propiedades
  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: count }, (_, i) => {
      const rand = Math.random()
      let type: Star['type'] = 'point'
      if (rand > 0.92) type = 'diamond'
      else if (rand > 0.8) type = 'cross'

      return {
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 70, // Solo en la parte superior
        size: type === 'point' ? 1 + Math.random() * 2 : 4 + Math.random() * 5,
        opacity: 0.4 + Math.random() * 0.6,
        twinkleDelay: Math.random() * 5,
        twinkleDuration: 2 + Math.random() * 3,
        type,
      }
    })
  }, [count])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Vía láctea sutil */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 120% 40% at 30% 20%, rgba(200, 210, 255, 0.03) 0%, transparent 50%),
            radial-gradient(ellipse 100% 30% at 70% 35%, rgba(200, 200, 255, 0.02) 0%, transparent 50%)
          `,
        }}
      />

      {/* Estrellas */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
          }}
          animate={{
            opacity: [star.opacity * 0.5, star.opacity, star.opacity * 0.5],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: star.twinkleDuration,
            delay: star.twinkleDelay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <StarShape type={star.type} size={star.size} id={star.id} />
        </motion.div>
      ))}

      {/* Estrellas fugaces ocasionales */}
      <ShootingStar delay={3} startX={15} startY={10} />
      <ShootingStar delay={12} startX={60} startY={15} />
      <ShootingStar delay={25} startX={35} startY={5} />

      {/* Luna */}
      {showMoon && <Moon />}
    </div>
  )
}

// Forma de estrella según tipo
function StarShape({ type, size, id }: { type: Star['type']; size: number; id: number }) {
  if (type === 'point') {
    return (
      <div
        className="rounded-full"
        style={{
          width: size,
          height: size,
          background: 'radial-gradient(circle, #fff 0%, rgba(200,220,255,0.8) 50%, transparent 100%)',
          boxShadow: `0 0 ${size * 2}px rgba(255,255,255,0.5)`,
        }}
      />
    )
  }

  if (type === 'cross') {
    return (
      <svg width={size} height={size} viewBox="0 0 10 10">
        <defs>
          <radialGradient id={`starGlow-cross-${id}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="50%" stopColor="#ddf" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ddf" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Cruz de 4 puntas */}
        <path
          d="M5 0 L5.4 4 L10 5 L5.4 6 L5 10 L4.6 6 L0 5 L4.6 4 Z"
          fill={`url(#starGlow-cross-${id})`}
        />
        {/* Brillo central */}
        <circle cx="5" cy="5" r="1.2" fill="#fff" />
      </svg>
    )
  }

  // Diamond (estrella brillante de 4 puntas más definida)
  return (
    <svg width={size} height={size} viewBox="0 0 12 12">
      <defs>
        <filter id={`starBlur-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="0.3" />
        </filter>
        <radialGradient id={`starGlow-diamond-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="40%" stopColor="#eef" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ddf" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Rayos largos */}
      <path
        d="M6 0 L6.25 5 L12 6 L6.25 7 L6 12 L5.75 7 L0 6 L5.75 5 Z"
        fill={`url(#starGlow-diamond-${id})`}
        filter={`url(#starBlur-${id})`}
      />
      {/* Rayos cortos diagonales */}
      <path
        d="M6 3 L6.6 5.4 L9 6 L6.6 6.6 L6 9 L5.4 6.6 L3 6 L5.4 5.4 Z"
        fill="#fff"
        opacity="0.7"
      />
      {/* Centro brillante */}
      <circle cx="6" cy="6" r="1.3" fill="#fff" />
      <circle cx="6" cy="6" r="0.7" fill="#ffffee" />
    </svg>
  )
}

// Estrella fugaz
function ShootingStar({ delay, startX, startY }: { delay: number; startX: number; startY: number }) {
  return (
    <motion.div
      className="absolute"
      style={{
        left: `${startX}%`,
        top: `${startY}%`,
      }}
      initial={{ opacity: 0, x: 0, y: 0 }}
      animate={{
        opacity: [0, 0, 1, 1, 0],
        x: [0, 0, 80, 150, 180],
        y: [0, 0, 60, 120, 150],
      }}
      transition={{
        duration: 1.2,
        delay: delay,
        repeat: Infinity,
        repeatDelay: 15 + Math.random() * 15,
        times: [0, 0.05, 0.15, 0.7, 1],
        ease: 'easeOut',
      }}
    >
      {/* Cabeza de la estrella */}
      <div
        className="absolute w-2 h-2 rounded-full"
        style={{
          background: 'radial-gradient(circle, #fff 0%, #aaf 50%, transparent 100%)',
          boxShadow: '0 0 6px #fff, 0 0 12px rgba(170,170,255,0.8)',
        }}
      />
      {/* Estela */}
      <div
        className="absolute"
        style={{
          width: '50px',
          height: '2px',
          right: '100%',
          top: '50%',
          transform: 'translateY(-50%) rotate(37deg)',
          transformOrigin: 'right center',
          background: 'linear-gradient(90deg, transparent 0%, rgba(170,170,255,0.3) 40%, rgba(255,255,255,0.8) 100%)',
          borderRadius: '1px',
        }}
      />
    </motion.div>
  )
}

// Luna
function Moon() {
  return (
    <motion.div
      className="absolute"
      style={{
        top: '8%',
        right: '12%',
        width: '45px',
        height: '45px',
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 2, delay: 0.5 }}
    >
      {/* Halo exterior */}
      <div
        className="absolute -inset-6 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,230,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Cuerpo de la luna */}
      <div
        className="relative w-full h-full rounded-full"
        style={{
          background: `
            radial-gradient(circle at 35% 35%, #FFFEF5 0%, #F8F4E0 30%, #EBE5C8 60%, #DED8B0 100%)
          `,
          boxShadow: `
            0 0 15px rgba(255, 255, 240, 0.4),
            0 0 30px rgba(255, 255, 220, 0.25),
            0 0 50px rgba(255, 255, 200, 0.15),
            inset -6px -3px 12px rgba(180, 170, 130, 0.4)
          `,
        }}
      >
        {/* Cráteres sutiles */}
        <div
          className="absolute rounded-full"
          style={{
            width: '7px',
            height: '7px',
            top: '22%',
            left: '28%',
            background: 'radial-gradient(circle, rgba(160,150,120,0.35) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: '10px',
            height: '10px',
            top: '48%',
            left: '50%',
            background: 'radial-gradient(circle, rgba(160,150,120,0.3) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: '5px',
            height: '5px',
            top: '68%',
            left: '30%',
            background: 'radial-gradient(circle, rgba(160,150,120,0.25) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: '4px',
            height: '4px',
            top: '35%',
            left: '65%',
            background: 'radial-gradient(circle, rgba(160,150,120,0.2) 0%, transparent 70%)',
          }}
        />
      </div>
    </motion.div>
  )
}

export const Stars = memo(StarsComponent)

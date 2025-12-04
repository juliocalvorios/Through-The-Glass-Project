'use client'

import { memo, useMemo, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface RainProps {
  intensity?: 'light' | 'moderate' | 'heavy'
  isStorm?: boolean
}

interface RainDrop {
  id: number
  x: number
  delay: number
  duration: number
  length: number
  opacity: number
  layer: 'front' | 'middle' | 'back'
  angle: number
}

interface GlassDrop {
  id: number
  x: number
  y: number
  size: number
  delay: number
  speed: number
}

function RainComponent({ intensity = 'moderate', isStorm = false }: RainProps) {
  const dropCounts = {
    light: { front: 15, middle: 25, back: 20 },
    moderate: { front: 25, middle: 45, back: 35 },
    heavy: { front: 40, middle: 70, back: 50 },
  }

  const counts = dropCounts[intensity]
  const windAngle = isStorm ? 15 : 5

  // Gotas de lluvia con capas de profundidad
  const rainDrops = useMemo<RainDrop[]>(() => {
    const drops: RainDrop[] = []

    // Capa trasera (pequeñas, lentas, borrosas)
    for (let i = 0; i < counts.back; i++) {
      drops.push({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 1.2 + Math.random() * 0.8,
        length: 8 + Math.random() * 12,
        opacity: 0.15 + Math.random() * 0.15,
        layer: 'back',
        angle: windAngle + (Math.random() - 0.5) * 5,
      })
    }

    // Capa media
    for (let i = 0; i < counts.middle; i++) {
      drops.push({
        id: counts.back + i,
        x: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 0.7 + Math.random() * 0.5,
        length: 15 + Math.random() * 20,
        opacity: 0.3 + Math.random() * 0.2,
        layer: 'middle',
        angle: windAngle + (Math.random() - 0.5) * 3,
      })
    }

    // Capa frontal (grandes, rápidas, nítidas)
    for (let i = 0; i < counts.front; i++) {
      drops.push({
        id: counts.back + counts.middle + i,
        x: Math.random() * 100,
        delay: Math.random() * 1.5,
        duration: 0.4 + Math.random() * 0.3,
        length: 25 + Math.random() * 30,
        opacity: 0.5 + Math.random() * 0.3,
        layer: 'front',
        angle: windAngle + (Math.random() - 0.5) * 2,
      })
    }

    return drops
  }, [counts, windAngle])

  // Gotas en el cristal
  const glassDrops = useMemo<GlassDrop[]>(() => {
    const dropCount = intensity === 'heavy' ? 25 : intensity === 'moderate' ? 18 : 12
    return Array.from({ length: dropCount }, (_, i) => ({
      id: i,
      x: 5 + Math.random() * 90,
      y: Math.random() * 60,
      size: 3 + Math.random() * 6,
      delay: Math.random() * 8,
      speed: 4 + Math.random() * 6,
    }))
  }, [intensity])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Capa de fondo oscuro para lluvia */}
      <div
        className="absolute inset-0"
        style={{
          background: isStorm
            ? 'linear-gradient(180deg, rgba(20,25,35,0.3) 0%, rgba(30,35,45,0.2) 100%)'
            : 'linear-gradient(180deg, rgba(40,50,60,0.15) 0%, rgba(50,60,70,0.1) 100%)',
        }}
      />

      {/* Gotas de lluvia por capas */}
      {rainDrops.map((drop) => (
        <RainDropElement key={drop.id} drop={drop} isStorm={isStorm} />
      ))}

      {/* Gotas corriendo por el cristal */}
      <div className="absolute inset-0">
        {glassDrops.map((drop) => (
          <GlassDropElement key={drop.id} drop={drop} />
        ))}
      </div>

      {/* Streaks de agua en el cristal */}
      <WaterStreaks intensity={intensity} />

      {/* Salpicaduras en la base */}
      <Splashes intensity={intensity} />

      {/* Efecto de niebla/vapor por la lluvia */}
      <motion.div
        className="absolute inset-0"
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          background: 'linear-gradient(0deg, rgba(150,170,190,0.15) 0%, transparent 30%)',
        }}
      />
    </div>
  )
}

// Elemento de gota de lluvia
function RainDropElement({ drop, isStorm }: { drop: RainDrop; isStorm: boolean }) {
  const layerStyles = {
    back: {
      width: 1,
      filter: 'blur(1px)',
      zIndex: 1,
    },
    middle: {
      width: 1.5,
      filter: 'blur(0.5px)',
      zIndex: 2,
    },
    front: {
      width: 2,
      filter: 'none',
      zIndex: 3,
    },
  }

  const style = layerStyles[drop.layer]

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${drop.x}%`,
        width: style.width,
        height: drop.length,
        filter: style.filter,
        zIndex: style.zIndex,
        transform: `rotate(${drop.angle}deg)`,
        transformOrigin: 'top center',
      }}
      initial={{ y: '-10%', opacity: 0 }}
      animate={{
        y: '110%',
        opacity: [0, drop.opacity, drop.opacity, 0],
      }}
      transition={{
        duration: drop.duration,
        delay: drop.delay,
        repeat: Infinity,
        ease: 'linear',
        times: [0, 0.1, 0.9, 1],
      }}
    >
      <svg width="100%" height="100%" viewBox={`0 0 2 ${drop.length}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id={`rainGrad-${drop.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(180,200,220,0)" />
            <stop offset="20%" stopColor={`rgba(180,200,220,${drop.opacity * 0.5})`} />
            <stop offset="80%" stopColor={`rgba(200,220,240,${drop.opacity})`} />
            <stop offset="100%" stopColor={`rgba(220,235,255,${drop.opacity * 0.8})`} />
          </linearGradient>
        </defs>
        <rect
          x="0"
          y="0"
          width="2"
          height={drop.length}
          fill={`url(#rainGrad-${drop.id})`}
          rx="1"
        />
      </svg>
    </motion.div>
  )
}

// Gota en el cristal
function GlassDropElement({ drop }: { drop: GlassDrop }) {
  return (
    <motion.div
      className="absolute"
      style={{
        left: `${drop.x}%`,
        top: `${drop.y}%`,
      }}
      initial={{ opacity: 0, y: 0 }}
      animate={{
        opacity: [0, 0.7, 0.7, 0],
        y: [0, 150, 200],
        scaleY: [1, 1.5, 2],
        scaleX: [1, 0.8, 0.6],
      }}
      transition={{
        duration: drop.speed,
        delay: drop.delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 5,
        times: [0, 0.1, 0.8, 1],
      }}
    >
      {/* Gota principal */}
      <div
        style={{
          width: drop.size,
          height: drop.size * 1.3,
          background: `
            radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.6) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(180,200,220,0.4) 0%, rgba(160,180,200,0.2) 70%, transparent 100%)
          `,
          borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%',
          boxShadow: `
            inset 0 -2px 4px rgba(255,255,255,0.3),
            0 2px 4px rgba(0,0,0,0.1)
          `,
        }}
      />
      {/* Estela de la gota */}
      <div
        style={{
          position: 'absolute',
          top: -20,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 1,
          height: 25,
          background: 'linear-gradient(180deg, transparent 0%, rgba(180,200,220,0.3) 100%)',
        }}
      />
    </motion.div>
  )
}

// Streaks de agua corriendo
function WaterStreaks({ intensity }: { intensity: string }) {
  const streakCount = intensity === 'heavy' ? 8 : intensity === 'moderate' ? 5 : 3

  return (
    <div className="absolute inset-0 pointer-events-none">
      {Array.from({ length: streakCount }, (_, i) => {
        const x = 10 + (i * 80) / streakCount + Math.random() * 10
        const width = 1 + Math.random()

        return (
          <motion.div
            key={`streak-${i}`}
            className="absolute top-0"
            style={{
              left: `${x}%`,
              width: width,
              height: '100%',
            }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.2, 0.3, 0.2, 0],
              scaleY: [0, 0.3, 0.6, 0.8, 1],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              delay: Math.random() * 10,
              repeat: Infinity,
              repeatDelay: 5 + Math.random() * 10,
            }}
          >
            <svg width="100%" height="100%" preserveAspectRatio="none">
              <defs>
                <linearGradient id={`streakGrad-${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(200,220,240,0)" />
                  <stop offset="30%" stopColor="rgba(200,220,240,0.2)" />
                  <stop offset="70%" stopColor="rgba(200,220,240,0.15)" />
                  <stop offset="100%" stopColor="rgba(200,220,240,0)" />
                </linearGradient>
              </defs>
              <rect width="100%" height="100%" fill={`url(#streakGrad-${i})`} />
            </svg>
          </motion.div>
        )
      })}
    </div>
  )
}

// Salpicaduras en la base
function Splashes({ intensity }: { intensity: string }) {
  const splashCount = intensity === 'heavy' ? 15 : intensity === 'moderate' ? 10 : 6

  return (
    <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none">
      {Array.from({ length: splashCount }, (_, i) => (
        <motion.div
          key={`splash-${i}`}
          className="absolute bottom-2"
          style={{
            left: `${5 + Math.random() * 90}%`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1.2, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 0.4,
            delay: Math.random() * 3,
            repeat: Infinity,
            repeatDelay: 0.5 + Math.random() * 2,
          }}
        >
          {/* Círculo de salpicadura */}
          <div
            className="rounded-full"
            style={{
              width: 8 + Math.random() * 6,
              height: 3,
              background: 'radial-gradient(ellipse, rgba(200,220,240,0.5) 0%, transparent 70%)',
            }}
          />
          {/* Gotitas que salen */}
          {[...Array(3)].map((_, j) => (
            <motion.div
              key={j}
              className="absolute w-1 h-1 rounded-full bg-blue-200/50"
              style={{
                bottom: 0,
                left: '50%',
              }}
              animate={{
                x: [(j - 1) * 3, (j - 1) * 8],
                y: [0, -10 - Math.random() * 10, 5],
                opacity: [0.6, 0.4, 0],
              }}
              transition={{
                duration: 0.3,
                ease: 'easeOut',
              }}
            />
          ))}
        </motion.div>
      ))}
    </div>
  )
}

export const Rain = memo(RainComponent)

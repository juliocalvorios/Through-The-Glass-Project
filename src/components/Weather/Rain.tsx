'use client'

import { useEffect, useRef, memo } from 'react'
import { motion } from 'framer-motion'

interface RainProps {
  intensity?: 'light' | 'moderate' | 'heavy'
  isStorm?: boolean
}

function RainComponent({ intensity = 'moderate', isStorm = false }: RainProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const dropCounts = {
    light: 30,
    moderate: 60,
    heavy: 100,
  }
  
  const dropCount = dropCounts[intensity]

  // Generar gotas con posiciones aleatorias
  const drops = Array.from({ length: dropCount }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 0.5 + Math.random() * 0.5,
    height: 15 + Math.random() * 20,
    opacity: 0.3 + Math.random() * 0.4,
  }))

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      {drops.map((drop) => (
        <motion.div
          key={drop.id}
          className="absolute w-0.5 rounded-full bg-gradient-to-b from-transparent via-blue-300/50 to-blue-400/70"
          style={{
            left: `${drop.left}%`,
            height: drop.height,
            opacity: drop.opacity,
          }}
          initial={{ y: '-10%' }}
          animate={{ y: '110vh' }}
          transition={{
            duration: drop.duration,
            delay: drop.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}

      {/* Gotas en el cristal (condensación) */}
      <div className="absolute inset-0">
        {Array.from({ length: 15 }, (_, i) => (
          <motion.div
            key={`condensation-${i}`}
            className="absolute w-2 h-3 rounded-full bg-white/20 backdrop-blur-sm"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
            }}
            animate={{
              y: [0, 50 + Math.random() * 100],
              opacity: [0.6, 0],
              scaleY: [1, 2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: Math.random() * 5,
              repeat: Infinity,
              repeatDelay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Efecto de salpicaduras en el alféizar */}
      <div className="absolute bottom-0 left-0 right-0 h-8">
        {Array.from({ length: 10 }, (_, i) => (
          <motion.div
            key={`splash-${i}`}
            className="absolute bottom-0 w-1 h-1 rounded-full bg-blue-300/50"
            style={{
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1.5, 0],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 0.3,
              delay: Math.random() * 2,
              repeat: Infinity,
              repeatDelay: 0.5 + Math.random() * 1.5,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export const Rain = memo(RainComponent)

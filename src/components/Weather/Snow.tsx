'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'

interface SnowProps {
  intensity?: 'light' | 'moderate' | 'heavy'
}

function SnowComponent({ intensity = 'moderate' }: SnowProps) {
  const flakeCounts = {
    light: 30,
    moderate: 60,
    heavy: 100,
  }
  
  const flakeCount = flakeCounts[intensity]

  const snowflakes = Array.from({ length: flakeCount }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 5 + Math.random() * 10,
    size: 4 + Math.random() * 8,
    opacity: 0.4 + Math.random() * 0.6,
    drift: (Math.random() - 0.5) * 100, // Horizontal drift
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {snowflakes.map((flake) => (
        <motion.div
          key={flake.id}
          className="absolute text-white select-none"
          style={{
            left: `${flake.left}%`,
            fontSize: flake.size,
            opacity: flake.opacity,
            textShadow: '0 0 5px rgba(255,255,255,0.8)',
          }}
          initial={{ y: '-5%', x: 0, rotate: 0 }}
          animate={{ 
            y: '105vh', 
            x: flake.drift,
            rotate: 360,
          }}
          transition={{
            duration: flake.duration,
            delay: flake.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          ❄
        </motion.div>
      ))}

      {/* Acumulación de nieve en el alféizar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white/90 to-white/50"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 2 }}
        style={{ 
          transformOrigin: 'bottom',
          borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
        }}
      />

      {/* Escarcha en las esquinas del cristal */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Esquina superior izquierda */}
        <div 
          className="absolute top-0 left-0 w-24 h-24"
          style={{
            background: 'radial-gradient(ellipse at top left, rgba(255,255,255,0.4) 0%, transparent 70%)',
          }}
        />
        {/* Esquina superior derecha */}
        <div 
          className="absolute top-0 right-0 w-24 h-24"
          style={{
            background: 'radial-gradient(ellipse at top right, rgba(255,255,255,0.4) 0%, transparent 70%)',
          }}
        />
        {/* Esquina inferior izquierda */}
        <div 
          className="absolute bottom-0 left-0 w-20 h-20"
          style={{
            background: 'radial-gradient(ellipse at bottom left, rgba(255,255,255,0.5) 0%, transparent 70%)',
          }}
        />
        {/* Esquina inferior derecha */}
        <div 
          className="absolute bottom-0 right-0 w-20 h-20"
          style={{
            background: 'radial-gradient(ellipse at bottom right, rgba(255,255,255,0.5) 0%, transparent 70%)',
          }}
        />
      </div>
    </div>
  )
}

export const Snow = memo(SnowComponent)

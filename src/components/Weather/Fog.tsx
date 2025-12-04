'use client'

import { memo, useMemo } from 'react'
import { motion } from 'framer-motion'

interface FogProps {
  intensity?: 'light' | 'moderate' | 'heavy'
}

interface FogLayer {
  id: number
  y: number
  opacity: number
  speed: number
  blur: number
  scale: number
}

function FogComponent({ intensity = 'moderate' }: FogProps) {
  const config = {
    light: { layers: 3, baseOpacity: 0.2, blur: 20 },
    moderate: { layers: 5, baseOpacity: 0.35, blur: 30 },
    heavy: { layers: 7, baseOpacity: 0.5, blur: 40 },
  }[intensity]

  // Generate fog layers with different depths
  const fogLayers = useMemo<FogLayer[]>(() => {
    return Array.from({ length: config.layers }, (_, i) => ({
      id: i,
      y: 20 + (i * 60) / config.layers + Math.random() * 20,
      opacity: config.baseOpacity * (0.5 + Math.random() * 0.5),
      speed: 15 + Math.random() * 25,
      blur: config.blur * (0.5 + (i / config.layers) * 0.5),
      scale: 0.8 + Math.random() * 0.4,
    }))
  }, [config])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Base fog overlay */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        style={{
          background: `linear-gradient(
            180deg,
            rgba(180, 190, 200, 0.1) 0%,
            rgba(160, 175, 190, ${config.baseOpacity * 0.6}) 30%,
            rgba(150, 165, 180, ${config.baseOpacity * 0.8}) 60%,
            rgba(140, 155, 170, ${config.baseOpacity}) 100%
          )`,
        }}
      />

      {/* Animated fog layers */}
      {fogLayers.map((layer) => (
        <motion.div
          key={layer.id}
          className="absolute w-[200%] h-40"
          style={{
            top: `${layer.y}%`,
            filter: `blur(${layer.blur}px)`,
            transform: `scaleY(${layer.scale})`,
          }}
          initial={{ x: '-50%', opacity: 0 }}
          animate={{
            x: ['0%', '-50%'],
            opacity: [layer.opacity * 0.7, layer.opacity, layer.opacity * 0.7],
          }}
          transition={{
            x: {
              duration: layer.speed,
              repeat: Infinity,
              ease: 'linear',
            },
            opacity: {
              duration: layer.speed / 2,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            },
          }}
        >
          {/* SVG fog cloud shape */}
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1200 200"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id={`fogGrad-${layer.id}`} x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="rgba(200, 210, 220, 0)" />
                <stop offset="20%" stopColor={`rgba(200, 210, 220, ${layer.opacity})`} />
                <stop offset="50%" stopColor={`rgba(190, 200, 210, ${layer.opacity * 1.2})`} />
                <stop offset="80%" stopColor={`rgba(200, 210, 220, ${layer.opacity})`} />
                <stop offset="100%" stopColor="rgba(200, 210, 220, 0)" />
              </linearGradient>
            </defs>
            <ellipse
              cx="600"
              cy="100"
              rx="550"
              ry="80"
              fill={`url(#fogGrad-${layer.id})`}
            />
          </svg>
        </motion.div>
      ))}

      {/* Ground fog - denser at the bottom */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1/3"
        animate={{
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          background: `linear-gradient(
            0deg,
            rgba(180, 190, 200, ${config.baseOpacity * 1.2}) 0%,
            rgba(180, 190, 200, ${config.baseOpacity * 0.6}) 50%,
            transparent 100%
          )`,
          filter: `blur(${config.blur * 0.5}px)`,
        }}
      />

      {/* Floating mist particles */}
      {Array.from({ length: 15 }, (_, i) => (
        <motion.div
          key={`mist-${i}`}
          className="absolute rounded-full"
          style={{
            width: 40 + Math.random() * 60,
            height: 20 + Math.random() * 30,
            left: `${Math.random() * 100}%`,
            top: `${30 + Math.random() * 50}%`,
            background: `radial-gradient(ellipse, rgba(200, 210, 220, ${0.2 + Math.random() * 0.2}) 0%, transparent 70%)`,
            filter: `blur(${10 + Math.random() * 15}px)`,
          }}
          animate={{
            x: [0, 30 + Math.random() * 40, 0],
            y: [0, -10 + Math.random() * 20, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: Math.random() * 5,
          }}
        />
      ))}

      {/* Subtle vignette for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(150, 160, 170, 0.15) 100%)',
        }}
      />
    </div>
  )
}

export const Fog = memo(FogComponent)

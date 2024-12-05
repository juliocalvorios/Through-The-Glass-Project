'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'

interface ThreeFogProps {
  intensity?: 'light' | 'moderate' | 'heavy'
  isNight?: boolean
}

function ThreeFogComponent({ intensity = 'moderate', isNight = false }: ThreeFogProps) {
  const config = {
    light: { baseOpacity: 0.4 },
    moderate: { baseOpacity: 0.55 },
    heavy: { baseOpacity: 0.7 },
  }[intensity]

  const fogColorBase = isNight ? '50, 55, 70' : '200, 200, 210'

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Main fog overlay - very visible */}
      <div
        className="absolute inset-0"
        style={{
          background: `rgba(${fogColorBase}, ${config.baseOpacity})`,
        }}
      />

      {/* Fog density gradient - thicker at bottom */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(0deg,
            rgba(${fogColorBase}, ${config.baseOpacity * 0.8}) 0%,
            rgba(${fogColorBase}, ${config.baseOpacity * 0.4}) 50%,
            rgba(${fogColorBase}, ${config.baseOpacity * 0.2}) 100%
          )`,
        }}
      />

      {/* Moving fog wisps */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 150% 100% at 50% 80%,
            rgba(${fogColorBase}, ${config.baseOpacity * 0.5}) 0%,
            transparent 60%
          )`,
        }}
        animate={{
          x: ['-10%', '10%', '-10%'],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 120% 80% at 30% 60%,
            rgba(${fogColorBase}, ${config.baseOpacity * 0.4}) 0%,
            transparent 50%
          )`,
        }}
        animate={{
          x: ['5%', '-15%', '5%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 100% 60% at 70% 40%,
            rgba(${fogColorBase}, ${config.baseOpacity * 0.3}) 0%,
            transparent 40%
          )`,
        }}
        animate={{
          x: ['-5%', '10%', '-5%'],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Visibility reduction vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center,
            transparent 20%,
            rgba(${fogColorBase}, ${config.baseOpacity * 0.3}) 80%
          )`,
        }}
      />
    </div>
  )
}

export const ThreeFog = memo(ThreeFogComponent)

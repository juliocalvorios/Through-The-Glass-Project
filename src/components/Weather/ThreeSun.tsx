'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'

interface ThreeSunProps {
  intensity?: 'soft' | 'bright' | 'intense'
}

// Simple CSS/Framer Motion sun - cleaner than Three.js
function ThreeSunComponent({ intensity = 'bright' }: ThreeSunProps) {
  const config = {
    soft: { size: 60, glowSize: 150, opacity: 0.6 },
    bright: { size: 70, glowSize: 180, opacity: 0.8 },
    intense: { size: 80, glowSize: 220, opacity: 1 },
  }[intensity]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Warm light wash on scene */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 70% 20%, rgba(255, 245, 200, 0.15) 0%, transparent 50%)',
        }}
      />

      {/* Sun positioned in upper right */}
      <div
        className="absolute"
        style={{
          top: '8%',
          right: '15%',
        }}
      >
        {/* Outer glow */}
        <motion.div
          className="absolute"
          style={{
            width: config.glowSize,
            height: config.glowSize,
            left: -(config.glowSize - config.size) / 2,
            top: -(config.glowSize - config.size) / 2,
            background: 'radial-gradient(circle, rgba(255,220,100,0.4) 0%, rgba(255,200,50,0.2) 40%, transparent 70%)',
            borderRadius: '50%',
          }}
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Middle glow */}
        <motion.div
          className="absolute"
          style={{
            width: config.size * 1.5,
            height: config.size * 1.5,
            left: -(config.size * 1.5 - config.size) / 2,
            top: -(config.size * 1.5 - config.size) / 2,
            background: 'radial-gradient(circle, rgba(255,240,180,0.6) 0%, rgba(255,220,100,0.3) 50%, transparent 70%)',
            borderRadius: '50%',
          }}
          animate={{
            scale: [1, 1.03, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Sun core */}
        <div
          style={{
            width: config.size,
            height: config.size,
            background: 'radial-gradient(circle, #fffef5 0%, #fff8e0 40%, #ffdd80 100%)',
            borderRadius: '50%',
            boxShadow: '0 0 30px rgba(255, 220, 100, 0.5), 0 0 60px rgba(255, 200, 50, 0.3)',
            opacity: config.opacity,
          }}
        />
      </div>

      {/* Light rays - subtle beams */}
      <div
        className="absolute"
        style={{
          top: '5%',
          right: '10%',
          width: 300,
          height: 300,
          opacity: 0.15,
        }}
      >
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <motion.div
            key={angle}
            className="absolute"
            style={{
              top: '50%',
              left: '50%',
              width: 3,
              height: 150,
              background: 'linear-gradient(180deg, rgba(255,240,180,0.8) 0%, transparent 100%)',
              transformOrigin: 'top center',
              transform: `rotate(${angle}deg)`,
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3 + (angle % 3),
              repeat: Infinity,
              ease: 'easeInOut',
              delay: angle / 100,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export const ThreeSun = memo(ThreeSunComponent)

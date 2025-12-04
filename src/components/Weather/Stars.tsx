'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'

interface StarsProps {
  count?: number
}

function StarsComponent({ count = 50 }: StarsProps) {
  const stars = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 70, // Solo en la parte superior
    size: 1 + Math.random() * 2,
    delay: Math.random() * 3,
    duration: 2 + Math.random() * 3,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: star.size,
            height: star.size,
          }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Luna */}
      <motion.div
        className="absolute top-[10%] right-[15%] w-16 h-16"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        <div 
          className="w-full h-full rounded-full bg-gray-100"
          style={{
            boxShadow: '0 0 40px rgba(255,255,255,0.4), 0 0 80px rgba(255,255,255,0.2)',
          }}
        >
          {/* Cráteres de la luna */}
          <div 
            className="absolute w-4 h-4 rounded-full bg-gray-200/50"
            style={{ top: '20%', left: '25%' }}
          />
          <div 
            className="absolute w-3 h-3 rounded-full bg-gray-200/50"
            style={{ top: '50%', left: '60%' }}
          />
          <div 
            className="absolute w-2 h-2 rounded-full bg-gray-200/50"
            style={{ top: '70%', left: '35%' }}
          />
        </div>
      </motion.div>
    </div>
  )
}

export const Stars = memo(StarsComponent)

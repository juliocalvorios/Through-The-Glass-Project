'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'

function SunComponent() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* El sol */}
      <motion.div
        className="absolute top-[10%] right-[20%] w-20 h-20"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Rayos de sol */}
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 w-1 h-8 bg-gradient-to-t from-yellow-400/60 to-transparent"
              style={{
                transform: `translate(-50%, -100%) rotate(${i * 30}deg)`,
                transformOrigin: 'center bottom',
              }}
            />
          ))}
        </motion.div>

        {/* Disco solar */}
        <div 
          className="absolute inset-2 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500"
          style={{
            boxShadow: '0 0 60px rgba(255,200,0,0.6), 0 0 120px rgba(255,200,0,0.3)',
          }}
        />
      </motion.div>

      {/* Luz solar entrando por la ventana */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,200,0.15) 0%, transparent 50%)',
        }}
      />

      {/* Partículas de polvo en la luz */}
      {Array.from({ length: 20 }, (_, i) => (
        <motion.div
          key={`dust-${i}`}
          className="absolute w-1 h-1 rounded-full bg-yellow-200/40"
          style={{
            left: `${20 + Math.random() * 40}%`,
            top: `${20 + Math.random() * 60}%`,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            delay: Math.random() * 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

export const Sun = memo(SunComponent)

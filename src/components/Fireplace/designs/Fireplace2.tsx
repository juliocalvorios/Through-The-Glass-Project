'use client'

// DISEÑO 2: Modern Minimalist - Chimenea moderna empotrada en la pared, líneas limpias

import { useId, useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TimeOfDay, WeatherCondition } from '@/types'

interface FireplaceProps {
  timeOfDay: TimeOfDay
  condition: WeatherCondition
  onFireChange?: (isLit: boolean) => void
}

export function Fireplace2({ timeOfDay, condition, onFireChange }: FireplaceProps) {
  const id = useId()
  const [isLit, setIsLit] = useState(true)
  const isNight = timeOfDay === 'night' || timeOfDay === 'dusk'

  const fireIntensity = useMemo(() => {
    if (!isLit) return 0
    return condition === 'snow' || condition === 'storm' ? 1.3 : 1.0
  }, [isLit, condition])

  useEffect(() => {
    onFireChange?.(isLit)
  }, [isLit, onFireChange])

  const colors = {
    frame: isNight ? '#1a1a1a' : '#2a2a2a',
    frameLight: isNight ? '#2a2a2a' : '#3a3a3a',
    glass: isNight ? 'rgba(20,30,40,0.3)' : 'rgba(40,50,60,0.2)',
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative cursor-pointer"
      onClick={() => setIsLit(!isLit)}
      style={{ width: '220px', height: '180px' }}
    >
      {/* Glow moderno */}
      {isLit && (
        <motion.div
          className="absolute pointer-events-none"
          style={{
            width: '280px', height: '200px', left: '-30px', bottom: '-30px',
            background: 'radial-gradient(ellipse at 50% 80%, rgba(255,120,50,0.35) 0%, transparent 55%)',
            filter: 'blur(20px)',
          }}
          animate={{ opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      <svg width="220" height="180" viewBox="0 0 220 180" className="absolute inset-0">
        {/* Marco exterior negro mate */}
        <rect x="0" y="20" width="220" height="160" rx="4" fill={colors.frame} />

        {/* Borde interior metálico */}
        <rect x="8" y="28" width="204" height="144" rx="2" fill="none" stroke={colors.frameLight} strokeWidth="2" />

        {/* Área del fuego - profundidad */}
        <rect x="15" y="35" width="190" height="130" rx="2" fill="#0a0505" />

        {/* Cristal protector (efecto) */}
        <rect x="15" y="35" width="190" height="130" rx="2" fill={colors.glass} />

        {/* Línea LED superior */}
        {isLit && (
          <rect x="20" y="40" width="180" height="2" fill="#FF6B35" opacity="0.6">
            <animate attributeName="opacity" values="0.4;0.7;0.4" dur="2s" repeatCount="indefinite" />
          </rect>
        )}

        {/* Base de piedras decorativas */}
        <ellipse cx="110" cy="155" rx="85" ry="8" fill="#1a1a1a" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <circle
            key={i}
            cx={35 + i * 22}
            cy={155}
            r={6 + (i % 3) * 2}
            fill={isNight ? '#2a2a2a' : '#3a3a3a'}
          />
        ))}
      </svg>

      {/* Sistema de fuego horizontal moderno */}
      <AnimatePresence>
        {isLit && (
          <div className="absolute pointer-events-none" style={{ bottom: '35px', left: '25px', width: '170px', height: '100px' }}>
            {/* Fila de llamas bajas y anchas */}
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                style={{
                  position: 'absolute',
                  width: '35px',
                  height: '70px',
                  left: `${i * 35}px`,
                  bottom: '10px',
                  background: `linear-gradient(0deg,
                    rgba(255,50,0,0.9) 0%,
                    #FF4500 15%,
                    #FF8C00 40%,
                    #FFD700 70%,
                    rgba(255,255,240,0.8) 100%)`,
                  borderRadius: '50% 50% 40% 40% / 60% 60% 40% 40%',
                  filter: 'blur(1.5px)',
                }}
                animate={{
                  scaleY: [0.7 * fireIntensity, 1.1 * fireIntensity, 0.65 * fireIntensity, 0.95 * fireIntensity],
                  scaleX: [1, 0.9, 1.1, 1],
                  y: [0, -3, 0, -2, 0],
                }}
                transition={{
                  duration: 0.4 + i * 0.05,
                  repeat: Infinity,
                  delay: i * 0.08,
                }}
              />
            ))}

            {/* Núcleos brillantes */}
            {[1, 2, 3].map((i) => (
              <motion.div
                key={`core-${i}`}
                style={{
                  position: 'absolute',
                  width: '20px',
                  height: '30px',
                  left: `${25 + i * 35}px`,
                  bottom: '15px',
                  background: 'radial-gradient(ellipse, rgba(255,255,255,0.9) 0%, #FFE4B5 50%, transparent 100%)',
                  filter: 'blur(3px)',
                }}
                animate={{
                  opacity: [0.6, 1, 0.6],
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 0.3, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

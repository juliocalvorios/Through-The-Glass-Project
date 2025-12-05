'use client'

// DISEÑO 1: Classic Stone - Chimenea clásica de piedra gris con arco elegante

import { useId, useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TimeOfDay, WeatherCondition } from '@/types'

interface FireplaceProps {
  timeOfDay: TimeOfDay
  condition: WeatherCondition
  onFireChange?: (isLit: boolean) => void
}

export function Fireplace1({ timeOfDay, condition, onFireChange }: FireplaceProps) {
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

  const stone = {
    base: isNight ? '#4a4845' : '#A5A2A0',
    light: isNight ? '#5a5855' : '#B8B5B2',
    dark: isNight ? '#35332f' : '#858280',
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative cursor-pointer"
      onClick={() => setIsLit(!isLit)}
      style={{ width: '200px', height: '260px' }}
    >
      {/* Glow */}
      {isLit && (
        <motion.div
          className="absolute pointer-events-none"
          style={{
            width: '300px', height: '250px', left: '-50px', bottom: '-20px',
            background: 'radial-gradient(ellipse at 50% 90%, rgba(255,100,30,0.4) 0%, transparent 60%)',
            filter: 'blur(25px)',
          }}
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      <svg width="200" height="260" viewBox="0 0 200 260" className="absolute inset-0">
        <defs>
          <linearGradient id={`${id}-sg`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={stone.light} />
            <stop offset="100%" stopColor={stone.dark} />
          </linearGradient>
        </defs>

        {/* Estructura de piedra con arco clásico */}
        <rect x="0" y="50" width="25" height="210" rx="2" fill={`url(#${id}-sg)`} />
        <rect x="175" y="50" width="25" height="210" rx="2" fill={`url(#${id}-sg)`} />

        {/* Arco superior elegante */}
        <path d="M 25 60 Q 100 10 175 60" fill="none" stroke={stone.dark} strokeWidth="30" />
        <path d="M 25 60 Q 100 15 175 60" fill="none" stroke={stone.base} strokeWidth="24" />
        <path d="M 25 58 Q 100 18 175 58" fill="none" stroke={stone.light} strokeWidth="3" opacity="0.5" />

        {/* Keystone central */}
        <path d="M 90 35 L 95 20 L 105 20 L 110 35 Z" fill={stone.light} stroke={stone.dark} strokeWidth="1" />

        {/* Repisa superior */}
        <rect x="-5" y="30" width="210" height="16" rx="2" fill={stone.base} />
        <rect x="-5" y="30" width="210" height="4" fill={stone.light} opacity="0.6" />

        {/* Interior */}
        <path d="M 28 65 Q 100 50 172 65 L 172 255 L 28 255 Z" fill={isLit ? '#1a0a05' : '#0a0808'} />

        {/* Base */}
        <rect x="0" y="252" width="200" height="8" rx="2" fill={stone.dark} />
      </svg>

      {/* Fuego */}
      <AnimatePresence>
        {isLit && (
          <div className="absolute pointer-events-none" style={{ bottom: '30px', left: '50%', transform: 'translateX(-50%)' }}>
            {/* Llama central */}
            <motion.div
              style={{
                width: '45px', height: '80px',
                background: 'linear-gradient(0deg, #CC2200 0%, #FF4500 20%, #FF8C00 45%, #FFD700 70%, #FFFEF0 100%)',
                borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                filter: 'blur(2px)',
                position: 'absolute', left: '50%', bottom: 0, transform: 'translateX(-50%)',
              }}
              animate={{
                scaleY: [1 * fireIntensity, 1.15 * fireIntensity, 0.9 * fireIntensity, 1.1 * fireIntensity],
                scaleX: [1, 0.95, 1.05, 1],
              }}
              transition={{ duration: 0.35, repeat: Infinity }}
            />
            {/* Llamas laterales */}
            {[-25, 25].map((x, i) => (
              <motion.div
                key={i}
                style={{
                  width: '28px', height: '55px',
                  background: 'linear-gradient(0deg, #FF4500 0%, #FF8C00 50%, #FFD700 100%)',
                  borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                  filter: 'blur(1.5px)',
                  position: 'absolute', left: `calc(50% + ${x}px)`, bottom: 0, transform: 'translateX(-50%)',
                }}
                animate={{
                  scaleY: [0.8, 1.1, 0.75, 1] as number[],
                  rotate: [x > 0 ? 3 : -3, x > 0 ? -2 : 2, 0],
                }}
                transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

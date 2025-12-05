'use client'

// DISEÑO 4: Victorian Ornate - Chimenea victoriana ornamentada con molduras y detalles

import { useId, useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TimeOfDay, WeatherCondition } from '@/types'

interface FireplaceProps {
  timeOfDay: TimeOfDay
  condition: WeatherCondition
  onFireChange?: (isLit: boolean) => void
}

export function Fireplace4({ timeOfDay, condition, onFireChange }: FireplaceProps) {
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
    marble: isNight ? '#3a3835' : '#E8E4E0',
    marbleDark: isNight ? '#2a2825' : '#C8C4C0',
    marbleVein: isNight ? '#4a4845' : '#D8D4D0',
    gold: isNight ? '#8B7355' : '#D4AF37',
    goldDark: isNight ? '#6B5335' : '#B8960F',
    iron: isNight ? '#2a2a2a' : '#3a3a3a',
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative cursor-pointer"
      onClick={() => setIsLit(!isLit)}
      style={{ width: '220px', height: '280px' }}
    >
      {/* Glow elegante */}
      {isLit && (
        <motion.div
          className="absolute pointer-events-none"
          style={{
            width: '300px', height: '260px', left: '-40px', bottom: '-10px',
            background: 'radial-gradient(ellipse at 50% 85%, rgba(255,150,80,0.3) 0%, transparent 55%)',
            filter: 'blur(25px)',
          }}
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      <svg width="220" height="280" viewBox="0 0 220 280" className="absolute inset-0">
        <defs>
          <linearGradient id={`${id}-marble`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.marble} />
            <stop offset="30%" stopColor={colors.marbleVein} />
            <stop offset="70%" stopColor={colors.marble} />
            <stop offset="100%" stopColor={colors.marbleDark} />
          </linearGradient>
          <linearGradient id={`${id}-gold`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.gold} />
            <stop offset="50%" stopColor={colors.goldDark} />
            <stop offset="100%" stopColor={colors.gold} />
          </linearGradient>
        </defs>

        {/* Columnas ornamentadas */}
        {[0, 180].map((x) => (
          <g key={x}>
            {/* Base de columna */}
            <rect x={x} y="230" width="40" height="20" fill={`url(#${id}-marble)`} />
            <rect x={x + 3} y="225" width="34" height="8" fill={colors.marble} />

            {/* Columna principal */}
            <rect x={x + 8} y="70" width="24" height="160" fill={`url(#${id}-marble)`} />

            {/* Estrías de la columna */}
            {[0, 1, 2].map((i) => (
              <rect key={i} x={x + 11 + i * 6} y="75" width="2" height="150" fill={colors.marbleDark} opacity="0.3" />
            ))}

            {/* Capitel ornamentado */}
            <rect x={x + 3} y="60" width="34" height="14" fill={colors.marble} />
            <path
              d={`M ${x + 5} 60 Q ${x + 20} 50 ${x + 35} 60`}
              fill={colors.marble}
            />

            {/* Detalles dorados */}
            <rect x={x + 5} y="72" width="30" height="3" fill={`url(#${id}-gold)`} />
            <rect x={x + 5} y="225" width="30" height="3" fill={`url(#${id}-gold)`} />
          </g>
        ))}

        {/* Dintel superior ornamentado */}
        <rect x="30" y="40" width="160" height="25" fill={`url(#${id}-marble)`} />
        <rect x="25" y="35" width="170" height="10" fill={colors.marble} />

        {/* Moldura decorativa central */}
        <ellipse cx="110" cy="45" rx="30" ry="12" fill={colors.marble} stroke={colors.gold} strokeWidth="2" />
        <ellipse cx="110" cy="45" rx="18" ry="7" fill={colors.marbleDark} />

        {/* Guirnaldas doradas */}
        <path
          d="M 50 50 Q 80 60 110 50 Q 140 60 170 50"
          fill="none"
          stroke={`url(#${id}-gold)`}
          strokeWidth="3"
        />

        {/* Repisa superior */}
        <rect x="20" y="25" width="180" height="12" fill={colors.marble} />
        <rect x="20" y="25" width="180" height="3" fill={colors.marbleVein} />

        {/* Interior con arco */}
        <path
          d="M 42 70 Q 110 55 178 70 L 178 250 L 42 250 Z"
          fill="#0a0505"
        />

        {/* Marco interior dorado */}
        <path
          d="M 42 70 Q 110 55 178 70"
          fill="none"
          stroke={`url(#${id}-gold)`}
          strokeWidth="4"
        />
        <line x1="42" y1="70" x2="42" y2="250" stroke={`url(#${id}-gold)`} strokeWidth="3" />
        <line x1="178" y1="70" x2="178" y2="250" stroke={`url(#${id}-gold)`} strokeWidth="3" />

        {/* Rejilla victoriana */}
        <rect x="50" y="242" width="120" height="10" rx="2" fill={colors.iron} />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <g key={i}>
            <rect x={55 + i * 16} y="243" width="3" height="8" fill="#4a4a4a" />
            <circle cx={56.5 + i * 16} y="247" r="2" fill={colors.gold} opacity="0.6" />
          </g>
        ))}

        {/* Base inferior */}
        <rect x="0" y="250" width="220" height="15" fill={`url(#${id}-marble)`} />
        <rect x="0" y="262" width="220" height="5" fill={colors.marbleDark} />

        {/* Patas decorativas */}
        {[10, 200].map((x) => (
          <path
            key={x}
            d={`M ${x} 265 Q ${x + 5} 275 ${x + 10} 265`}
            fill={colors.marble}
            stroke={colors.gold}
            strokeWidth="1"
          />
        ))}
      </svg>

      {/* Fuego elegante */}
      <AnimatePresence>
        {isLit && (
          <div className="absolute pointer-events-none" style={{ bottom: '45px', left: '50%', transform: 'translateX(-50%)' }}>
            {/* Llama central alta */}
            <motion.div
              style={{
                position: 'absolute',
                width: '50px',
                height: '90px',
                left: '50%',
                bottom: 0,
                transform: 'translateX(-50%)',
                background: 'linear-gradient(0deg, #8B0000 0%, #CC2200 15%, #FF4500 30%, #FF8C00 50%, #FFD700 75%, #FFFEF0 95%)',
                borderRadius: '50% 50% 45% 45% / 65% 65% 35% 35%',
                filter: 'blur(2px)',
                boxShadow: '0 0 40px rgba(255,150,50,0.4)',
              }}
              animate={{
                scaleY: [1 * fireIntensity, 1.2 * fireIntensity, 0.9 * fireIntensity, 1.15 * fireIntensity],
                scaleX: [1, 0.92, 1.08, 0.96, 1],
              }}
              transition={{ duration: 0.4, repeat: Infinity }}
            />

            {/* Llamas laterales elegantes */}
            {[-30, 30].map((x, i) => (
              <motion.div
                key={i}
                style={{
                  position: 'absolute',
                  width: '32px',
                  height: '65px',
                  left: `calc(50% + ${x}px)`,
                  bottom: 0,
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(0deg, #CC2200 0%, #FF4500 30%, #FF8C00 60%, #FFD700 90%, transparent 100%)',
                  borderRadius: '50% 50% 45% 45% / 60% 60% 40% 40%',
                  filter: 'blur(1.5px)',
                }}
                animate={{
                  scaleY: [0.8, 1.15, 0.75, 1.05] as number[],
                  rotate: [x > 0 ? 4 : -4, x > 0 ? -3 : 3, 0],
                }}
                transition={{ duration: 0.45, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}

            {/* Núcleo dorado */}
            <motion.div
              style={{
                position: 'absolute',
                width: '25px',
                height: '40px',
                left: '50%',
                bottom: '20px',
                transform: 'translateX(-50%)',
                background: 'radial-gradient(ellipse, rgba(255,255,255,0.95) 0%, #FFE4B5 40%, transparent 100%)',
                filter: 'blur(4px)',
              }}
              animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.15, 1] }}
              transition={{ duration: 0.3, repeat: Infinity }}
            />
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

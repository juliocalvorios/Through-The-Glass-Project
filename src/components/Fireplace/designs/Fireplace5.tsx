'use client'

// DISEÑO 5: Scandinavian Hygge - Chimenea escandinava blanca y minimalista con madera clara

import { useId, useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TimeOfDay, WeatherCondition } from '@/types'

interface FireplaceProps {
  timeOfDay: TimeOfDay
  condition: WeatherCondition
  onFireChange?: (isLit: boolean) => void
}

export function Fireplace5({ timeOfDay, condition, onFireChange }: FireplaceProps) {
  const id = useId()
  const [isLit, setIsLit] = useState(true)
  const isNight = timeOfDay === 'night' || timeOfDay === 'dusk'

  const fireIntensity = useMemo(() => {
    if (!isLit) return 0
    return condition === 'snow' || condition === 'storm' ? 1.4 : 1.0
  }, [isLit, condition])

  useEffect(() => {
    onFireChange?.(isLit)
  }, [isLit, onFireChange])

  const colors = {
    white: isNight ? '#d0ccc8' : '#FAFAF8',
    whiteShadow: isNight ? '#b0aca8' : '#E8E6E4',
    wood: isNight ? '#8a7a6a' : '#C4B4A4',
    woodDark: isNight ? '#6a5a4a' : '#A49484',
    woodLight: isNight ? '#9a8a7a' : '#D4C4B4',
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative cursor-pointer"
      onClick={() => setIsLit(!isLit)}
      style={{ width: '200px', height: '240px' }}
    >
      {/* Glow suave y cálido */}
      {isLit && (
        <motion.div
          className="absolute pointer-events-none"
          style={{
            width: '280px', height: '220px', left: '-40px', bottom: '-10px',
            background: 'radial-gradient(ellipse at 50% 85%, rgba(255,180,120,0.25) 0%, transparent 55%)',
            filter: 'blur(25px)',
          }}
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
      )}

      <svg width="200" height="240" viewBox="0 0 200 240" className="absolute inset-0">
        <defs>
          <linearGradient id={`${id}-wood`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.woodLight} />
            <stop offset="50%" stopColor={colors.wood} />
            <stop offset="100%" stopColor={colors.woodDark} />
          </linearGradient>
        </defs>

        {/* Estructura blanca principal - forma suave y redondeada */}
        <rect x="10" y="45" width="180" height="195" rx="8" fill={colors.white} />

        {/* Sombra interior suave */}
        <rect x="15" y="50" width="170" height="185" rx="6" fill={colors.whiteShadow} opacity="0.3" />

        {/* Columnas laterales redondeadas */}
        <rect x="10" y="45" width="30" height="195" rx="4" fill={colors.white} />
        <rect x="160" y="45" width="30" height="195" rx="4" fill={colors.white} />

        {/* Bordes de sombra en columnas */}
        <rect x="38" y="50" width="2" height="185" fill={colors.whiteShadow} opacity="0.4" />
        <rect x="160" y="50" width="2" height="185" fill={colors.whiteShadow} opacity="0.4" />

        {/* Repisa de madera clara */}
        <rect x="5" y="30" width="190" height="18" rx="3" fill={`url(#${id}-wood)`} />
        <rect x="5" y="30" width="190" height="4" fill={colors.woodLight} opacity="0.6" />
        <rect x="5" y="44" width="190" height="3" fill={colors.woodDark} opacity="0.3" />

        {/* Patrón de vetas de madera sutil */}
        <path d="M 20 38 Q 60 36 100 38 T 180 38" stroke={colors.woodDark} strokeWidth="0.5" fill="none" opacity="0.3" />
        <path d="M 20 42 Q 70 40 120 42 T 180 42" stroke={colors.woodDark} strokeWidth="0.5" fill="none" opacity="0.2" />

        {/* Abertura del fuego - forma ovalada suave */}
        <ellipse cx="100" cy="160" rx="55" ry="70" fill="#0a0808" />

        {/* Borde interior suave */}
        <ellipse cx="100" cy="160" rx="55" ry="70" fill="none" stroke={colors.whiteShadow} strokeWidth="3" />

        {/* Base de piedras blancas decorativas */}
        <ellipse cx="100" cy="225" rx="50" ry="8" fill={colors.whiteShadow} />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <ellipse
            key={i}
            cx={55 + i * 14}
            cy={225}
            rx={5 + (i % 2) * 2}
            ry={4 + (i % 2)}
            fill={colors.white}
            stroke={colors.whiteShadow}
            strokeWidth="0.5"
          />
        ))}

        {/* Detalles minimalistas - líneas finas */}
        <line x1="20" y1="70" x2="20" y2="200" stroke={colors.whiteShadow} strokeWidth="1" opacity="0.3" />
        <line x1="180" y1="70" x2="180" y2="200" stroke={colors.whiteShadow} strokeWidth="1" opacity="0.3" />
      </svg>

      {/* Leños de abedul */}
      <div className="absolute" style={{ bottom: '30px', left: '60px', width: '80px' }}>
        {[
          { w: 55, h: 14, rot: -12, x: 0, y: 0, bark: true },
          { w: 55, h: 14, rot: 12, x: 25, y: 0, bark: true },
          { w: 40, h: 10, rot: 0, x: 20, y: -10, bark: false },
        ].map((log, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              width: log.w,
              height: log.h,
              left: log.x,
              bottom: log.y,
              transform: `rotate(${log.rot}deg)`,
              background: log.bark
                ? `linear-gradient(180deg, #F5F0E8 0%, #E8E0D8 30%, #D8D0C8 70%, #C8C0B8 100%)`
                : `linear-gradient(180deg, #E8E0D8 0%, #D0C8C0 100%)`,
              borderRadius: log.h / 2,
              boxShadow: isLit ? '0 0 12px rgba(255,150,100,0.3)' : 'none',
            }}
          >
            {/* Marcas de corteza de abedul */}
            {log.bark && [...Array(4)].map((_, j) => (
              <div
                key={j}
                className="absolute"
                style={{
                  width: '8px',
                  height: '2px',
                  left: `${15 + j * 20}%`,
                  top: '40%',
                  background: '#8a8078',
                  borderRadius: '1px',
                }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Fuego suave y acogedor */}
      <AnimatePresence>
        {isLit && (
          <div className="absolute pointer-events-none" style={{ bottom: '55px', left: '50%', transform: 'translateX(-50%)' }}>
            {/* Llamas suaves */}
            {[-18, 0, 18].map((x, i) => (
              <motion.div
                key={i}
                style={{
                  position: 'absolute',
                  width: i === 1 ? '35px' : '25px',
                  height: i === 1 ? '65px' : '50px',
                  left: `calc(50% + ${x}px)`,
                  bottom: 0,
                  transform: 'translateX(-50%)',
                  background: `linear-gradient(0deg,
                    rgba(200,80,20,0.8) 0%,
                    #FF6B35 20%,
                    #FF8C00 45%,
                    #FFB347 70%,
                    #FFE4B5 90%,
                    rgba(255,255,250,0.9) 100%)`,
                  borderRadius: '50% 50% 45% 45% / 65% 65% 35% 35%',
                  filter: 'blur(2px)',
                }}
                animate={{
                  scaleY: [0.9 * fireIntensity, 1.15 * fireIntensity, 0.85 * fireIntensity, 1.1 * fireIntensity],
                  scaleX: [1, 0.95, 1.05, 1],
                }}
                transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}

            {/* Núcleo cálido */}
            <motion.div
              style={{
                position: 'absolute',
                width: '20px',
                height: '30px',
                left: '50%',
                bottom: '15px',
                transform: 'translateX(-50%)',
                background: 'radial-gradient(ellipse, rgba(255,255,250,0.95) 0%, #FFE4B5 50%, transparent 100%)',
                filter: 'blur(4px)',
              }}
              animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.15, 1] }}
              transition={{ duration: 0.35, repeat: Infinity }}
            />
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

'use client'

// DISEÑO 3: Rustic Cabin - Chimenea rústica de ladrillo rojo con leños gruesos

import { useId, useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TimeOfDay, WeatherCondition } from '@/types'

interface FireplaceProps {
  timeOfDay: TimeOfDay
  condition: WeatherCondition
  onFireChange?: (isLit: boolean) => void
}

export function Fireplace3({ timeOfDay, condition, onFireChange }: FireplaceProps) {
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

  const brick = {
    base: isNight ? '#4a2a20' : '#8B4A3A',
    light: isNight ? '#5a3a30' : '#A05A4A',
    dark: isNight ? '#3a1a10' : '#6B3A2A',
    mortar: isNight ? '#2a2020' : '#5A4A45',
  }

  // Generar patrón de ladrillos
  const bricks = useMemo(() => {
    const result = []
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 5; col++) {
        const offset = row % 2 === 0 ? 0 : 18
        const x = col * 36 + offset
        if (x < 180) {
          result.push({ x, y: 45 + row * 22, w: 32, h: 18 })
        }
      }
    }
    return result
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative cursor-pointer"
      onClick={() => setIsLit(!isLit)}
      style={{ width: '200px', height: '280px' }}
    >
      {/* Glow cálido */}
      {isLit && (
        <motion.div
          className="absolute pointer-events-none"
          style={{
            width: '320px', height: '280px', left: '-60px', bottom: '-20px',
            background: 'radial-gradient(ellipse at 50% 85%, rgba(255,80,20,0.5) 0%, transparent 55%)',
            filter: 'blur(30px)',
          }}
          animate={{ opacity: [0.35, 0.55, 0.35] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
      )}

      <svg width="200" height="280" viewBox="0 0 200 280" className="absolute inset-0">
        <defs>
          <pattern id={`${id}-mortar`} patternUnits="userSpaceOnUse" width="36" height="22">
            <rect width="36" height="22" fill={brick.mortar} />
          </pattern>
        </defs>

        {/* Fondo de mortero */}
        <rect x="5" y="40" width="190" height="180" fill={`url(#${id}-mortar)`} />

        {/* Ladrillos */}
        {bricks.map((b, i) => (
          <rect
            key={i}
            x={b.x + 5}
            y={b.y}
            width={b.w}
            height={b.h}
            rx="1"
            fill={i % 3 === 0 ? brick.light : i % 3 === 1 ? brick.base : brick.dark}
          />
        ))}

        {/* Arco rústico de ladrillos */}
        <path
          d="M 20 65 Q 100 25 180 65"
          fill="none"
          stroke={brick.mortar}
          strokeWidth="28"
        />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => {
          const angle = -80 + i * 26
          const rad = (angle * Math.PI) / 180
          const x = 100 + Math.cos(rad) * 70
          const y = 55 - Math.sin(rad) * 25
          return (
            <rect
              key={i}
              x={x - 12}
              y={y - 8}
              width="24"
              height="16"
              rx="1"
              fill={i % 2 === 0 ? brick.base : brick.light}
              transform={`rotate(${angle + 90}, ${x}, ${y})`}
            />
          )
        })}

        {/* Repisa de madera gruesa */}
        <rect x="-8" y="20" width="216" height="22" rx="3" fill={isNight ? '#3a2515' : '#6B4A35'} />
        <rect x="-8" y="20" width="216" height="5" fill={isNight ? '#4a3520' : '#7B5A45'} opacity="0.7" />

        {/* Interior oscuro */}
        <rect x="30" y="70" width="140" height="150" fill="#0a0505" />

        {/* Base de ceniza */}
        <ellipse cx="100" cy="218" rx="65" ry="6" fill={isNight ? '#2a2520' : '#4a4540'} />

        {/* Rejilla de hierro */}
        <rect x="40" y="215" width="120" height="6" rx="2" fill="#1a1a1a" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x={48 + i * 20} y="216" width="4" height="4" rx="1" fill="#3a3a3a" />
        ))}
      </svg>

      {/* Leños gruesos */}
      <div className="absolute" style={{ bottom: '65px', left: '45px', width: '110px' }}>
        {[
          { w: 85, h: 20, rot: -15, x: 0, y: 0 },
          { w: 85, h: 20, rot: 15, x: 25, y: 0 },
          { w: 60, h: 16, rot: 0, x: 25, y: -15 },
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
              background: `linear-gradient(180deg, ${isNight ? '#5a4535' : '#7A6555'} 0%, ${isNight ? '#3a2515' : '#5A4535'} 100%)`,
              borderRadius: log.h / 2,
              boxShadow: isLit ? '0 0 15px rgba(255,100,30,0.4)' : 'none',
            }}
          />
        ))}
      </div>

      {/* Fuego rústico */}
      <AnimatePresence>
        {isLit && (
          <div className="absolute pointer-events-none" style={{ bottom: '85px', left: '50%', transform: 'translateX(-50%)' }}>
            {/* Llamas */}
            {[-20, 0, 20].map((x, i) => (
              <motion.div
                key={i}
                style={{
                  position: 'absolute',
                  width: i === 1 ? '40px' : '30px',
                  height: i === 1 ? '75px' : '55px',
                  left: `calc(50% + ${x}px)`,
                  bottom: 0,
                  transform: 'translateX(-50%)',
                  background: `linear-gradient(0deg, #8B0000 0%, #FF4500 25%, #FF8C00 50%, #FFD700 80%, #FFFEF0 100%)`,
                  borderRadius: '50% 50% 45% 45% / 60% 60% 40% 40%',
                  filter: 'blur(2px)',
                }}
                animate={{
                  scaleY: [0.85 * fireIntensity, 1.2 * fireIntensity, 0.8 * fireIntensity, 1.1 * fireIntensity],
                  scaleX: [1, 0.9, 1.1, 1],
                  rotate: [x > 0 ? 2 : x < 0 ? -2 : 0, x > 0 ? -3 : x < 0 ? 3 : 0, 0],
                }}
                transition={{ duration: 0.35 + i * 0.05, repeat: Infinity }}
              />
            ))}

            {/* Brasas */}
            <div className="absolute" style={{ bottom: '-5px', left: '-30px', width: '60px' }}>
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: 4 + Math.random() * 4,
                    height: 4 + Math.random() * 4,
                    left: i * 7,
                    background: 'radial-gradient(circle, #FF6B35 0%, #8B0000 100%)',
                  }}
                  animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
            </div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

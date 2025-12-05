'use client'

// DISEÑO 6: Mountain Lodge - Chimenea de cabaña de montaña con piedra oscura y madera gruesa

import { useId, useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TimeOfDay, WeatherCondition } from '@/types'

interface FireplaceProps {
  timeOfDay: TimeOfDay
  condition: WeatherCondition
  onFireChange?: (isLit: boolean) => void
}

export function Fireplace6({ timeOfDay, condition, onFireChange }: FireplaceProps) {
  const id = useId()
  const [isLit, setIsLit] = useState(true)
  const isNight = timeOfDay === 'night' || timeOfDay === 'dusk'

  const fireIntensity = useMemo(() => {
    if (!isLit) return 0
    return condition === 'snow' || condition === 'storm' ? 1.5 : 1.1
  }, [isLit, condition])

  useEffect(() => {
    onFireChange?.(isLit)
  }, [isLit, onFireChange])

  const colors = {
    stone: isNight ? '#2a2826' : '#4A4845',
    stoneLight: isNight ? '#3a3836' : '#5A5855',
    stoneDark: isNight ? '#1a1816' : '#3A3835',
    wood: isNight ? '#4a3525' : '#7A5A45',
    woodLight: isNight ? '#5a4535' : '#8A6A55',
    woodDark: isNight ? '#3a2515' : '#6A4A35',
    copper: isNight ? '#8B5A3A' : '#B87333',
    copperDark: isNight ? '#6B4A2A' : '#986020',
  }

  // Piedras irregulares
  const stones = useMemo(() => [
    // Columna izquierda
    { x: 0, y: 50, w: 35, h: 40, rx: 4 },
    { x: 3, y: 92, w: 32, h: 45, rx: 5 },
    { x: 0, y: 140, w: 38, h: 42, rx: 4 },
    { x: 2, y: 185, w: 34, h: 48, rx: 5 },
    { x: 0, y: 235, w: 36, h: 35, rx: 4 },
    // Columna derecha
    { x: 175, y: 52, w: 35, h: 42, rx: 5 },
    { x: 172, y: 96, w: 38, h: 44, rx: 4 },
    { x: 175, y: 142, w: 35, h: 46, rx: 5 },
    { x: 173, y: 190, w: 37, h: 45, rx: 4 },
    { x: 175, y: 237, w: 35, h: 33, rx: 4 },
  ], [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative cursor-pointer"
      onClick={() => setIsLit(!isLit)}
      style={{ width: '210px', height: '290px' }}
    >
      {/* Glow intenso de montaña */}
      {isLit && (
        <motion.div
          className="absolute pointer-events-none"
          style={{
            width: '350px', height: '300px', left: '-70px', bottom: '-20px',
            background: 'radial-gradient(ellipse at 50% 85%, rgba(255,80,20,0.5) 0%, rgba(255,50,0,0.2) 40%, transparent 60%)',
            filter: 'blur(30px)',
          }}
          animate={{ opacity: [0.4, 0.65, 0.4] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
      )}

      <svg width="210" height="290" viewBox="0 0 210 290" className="absolute inset-0">
        <defs>
          <linearGradient id={`${id}-stone`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.stoneLight} />
            <stop offset="50%" stopColor={colors.stone} />
            <stop offset="100%" stopColor={colors.stoneDark} />
          </linearGradient>
          <linearGradient id={`${id}-wood`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.woodLight} />
            <stop offset="50%" stopColor={colors.wood} />
            <stop offset="100%" stopColor={colors.woodDark} />
          </linearGradient>
          <linearGradient id={`${id}-copper`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.copperDark} />
            <stop offset="50%" stopColor={colors.copper} />
            <stop offset="100%" stopColor={colors.copperDark} />
          </linearGradient>
        </defs>

        {/* Piedras individuales */}
        {stones.map((s, i) => (
          <rect
            key={i}
            x={s.x}
            y={s.y}
            width={s.w}
            height={s.h}
            rx={s.rx}
            fill={i % 3 === 0 ? colors.stoneLight : i % 3 === 1 ? colors.stone : colors.stoneDark}
            stroke={colors.stoneDark}
            strokeWidth="1"
          />
        ))}

        {/* Viga de madera gruesa (dintel) */}
        <rect x="-5" y="30" width="220" height="28" rx="3" fill={`url(#${id}-wood)`} />

        {/* Textura de vetas */}
        <path d="M 10 44 Q 60 42 110 44 T 200 44" stroke={colors.woodDark} strokeWidth="1" fill="none" opacity="0.4" />
        <path d="M 10 48 Q 70 46 130 48 T 200 48" stroke={colors.woodDark} strokeWidth="0.7" fill="none" opacity="0.3" />
        <path d="M 10 52 Q 50 50 100 52 T 200 52" stroke={colors.woodDark} strokeWidth="0.5" fill="none" opacity="0.2" />

        {/* Clavos de cobre decorativos */}
        {[20, 60, 100, 140, 180].map((x) => (
          <g key={x}>
            <circle cx={x} cy="44" r="4" fill={`url(#${id}-copper)`} />
            <circle cx={x} cy="43" r="2" fill={colors.copper} opacity="0.5" />
          </g>
        ))}

        {/* Arco de piedras */}
        <path
          d="M 35 60 Q 105 20 175 60"
          fill="none"
          stroke={colors.stoneDark}
          strokeWidth="32"
          strokeLinecap="round"
        />
        <path
          d="M 35 60 Q 105 25 175 60"
          fill="none"
          stroke={colors.stone}
          strokeWidth="26"
          strokeLinecap="round"
        />

        {/* Piedras del arco */}
        {[0, 1, 2, 3, 4].map((i) => {
          const angle = -70 + i * 35
          const rad = (angle * Math.PI) / 180
          const x = 105 + Math.cos(rad) * 60
          const y = 50 - Math.sin(rad) * 22
          return (
            <ellipse
              key={i}
              cx={x}
              cy={y}
              rx={18}
              ry={12}
              fill={i % 2 === 0 ? colors.stoneLight : colors.stone}
              stroke={colors.stoneDark}
              strokeWidth="1"
              transform={`rotate(${angle + 90}, ${x}, ${y})`}
            />
          )
        })}

        {/* Interior profundo */}
        <path
          d="M 38 65 Q 105 50 172 65 L 172 268 L 38 268 Z"
          fill="#050303"
        />

        {/* Sombra interior */}
        <path
          d="M 38 65 Q 105 50 172 65 L 172 100 Q 105 85 38 100 Z"
          fill="rgba(0,0,0,0.6)"
        />

        {/* Base de piedra */}
        <rect x="0" y="270" width="210" height="20" rx="3" fill={colors.stoneDark} />
        <rect x="5" y="272" width="200" height="5" fill={colors.stone} opacity="0.4" />

        {/* Herramientas de chimenea (atizador) */}
        <g transform="translate(185, 120)">
          <rect x="0" y="0" width="4" height="100" rx="1" fill={colors.copperDark} />
          <circle cx="2" cy="0" r="5" fill={colors.copper} />
          <path d="M -3 100 L 2 110 L 7 100" fill={colors.copper} />
        </g>
      </svg>

      {/* Leños grandes de montaña */}
      <div className="absolute" style={{ bottom: '35px', left: '50px', width: '110px' }}>
        {[
          { w: 90, h: 22, rot: -18, x: 0, y: 5 },
          { w: 90, h: 22, rot: 18, x: 20, y: 5 },
          { w: 70, h: 18, rot: 0, x: 20, y: -12 },
          { w: 50, h: 14, rot: 5, x: 30, y: -22 },
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
              background: `linear-gradient(180deg,
                ${isNight ? '#5a4a3a' : '#7A6A5A'} 0%,
                ${isNight ? '#3a2a1a' : '#5A4A3A'} 50%,
                ${isNight ? '#2a1a0a' : '#4A3A2A'} 100%)`,
              borderRadius: log.h / 2,
              boxShadow: isLit ? '0 0 18px rgba(255,80,20,0.5)' : 'none',
            }}
          />
        ))}
      </div>

      {/* Fuego intenso de lodge */}
      <AnimatePresence>
        {isLit && (
          <div className="absolute pointer-events-none" style={{ bottom: '60px', left: '50%', transform: 'translateX(-50%)' }}>
            {/* Llama central masiva */}
            <motion.div
              style={{
                position: 'absolute',
                width: '55px',
                height: '100px',
                left: '50%',
                bottom: 0,
                transform: 'translateX(-50%)',
                background: `linear-gradient(0deg,
                  #660000 0%,
                  #8B0000 10%,
                  #CC2200 25%,
                  #FF4500 40%,
                  #FF6B00 55%,
                  #FF8C00 70%,
                  #FFD700 85%,
                  #FFFEF0 95%,
                  rgba(255,255,255,0.95) 100%)`,
                borderRadius: '50% 50% 45% 45% / 65% 65% 35% 35%',
                filter: 'blur(2px)',
                boxShadow: '0 0 50px rgba(255,100,30,0.6), 0 0 100px rgba(255,50,0,0.3)',
              }}
              animate={{
                scaleY: [1 * fireIntensity, 1.25 * fireIntensity, 0.9 * fireIntensity, 1.2 * fireIntensity],
                scaleX: [1, 0.9, 1.1, 0.95, 1],
                y: [0, -3, 0, -2, 0],
              }}
              transition={{ duration: 0.3, repeat: Infinity }}
            />

            {/* Llamas laterales */}
            {[-35, 35].map((x, i) => (
              <motion.div
                key={i}
                style={{
                  position: 'absolute',
                  width: '38px',
                  height: '75px',
                  left: `calc(50% + ${x}px)`,
                  bottom: 0,
                  transform: 'translateX(-50%)',
                  background: `linear-gradient(0deg,
                    #8B0000 0%,
                    #CC2200 20%,
                    #FF4500 40%,
                    #FF8C00 65%,
                    #FFD700 85%,
                    transparent 100%)`,
                  borderRadius: '50% 50% 45% 45% / 60% 60% 40% 40%',
                  filter: 'blur(1.5px)',
                }}
                animate={{
                  scaleY: [0.85, 1.2, 0.8, 1.15] as number[],
                  rotate: [x > 0 ? 5 : -5, x > 0 ? -4 : 4, x > 0 ? 3 : -3, 0],
                }}
                transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}

            {/* Llamas extra */}
            {[-55, -20, 20, 55].map((x, i) => (
              <motion.div
                key={`extra-${i}`}
                style={{
                  position: 'absolute',
                  width: '22px',
                  height: '50px',
                  left: `calc(50% + ${x}px)`,
                  bottom: 0,
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(0deg, #FF4500 0%, #FF8C00 50%, #FFD700 90%, transparent 100%)',
                  borderRadius: '50% 50% 45% 45% / 60% 60% 40% 40%',
                  filter: 'blur(1.5px)',
                }}
                animate={{
                  scaleY: [0.5, 1, 0.4, 0.9] as number[],
                  opacity: [0.5, 1, 0.4, 0.8],
                }}
                transition={{ duration: 0.45, repeat: Infinity, delay: i * 0.08 }}
              />
            ))}

            {/* Brasas intensas */}
            <div className="absolute" style={{ bottom: '-10px', left: '-45px', width: '90px' }}>
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: 5 + Math.random() * 5,
                    height: 5 + Math.random() * 5,
                    left: `${i * 8}%`,
                    background: 'radial-gradient(circle, #FF6B35 0%, #CC2200 50%, #660000 100%)',
                    boxShadow: '0 0 6px #FF4500',
                  }}
                  animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.3 + i * 0.03, repeat: Infinity, delay: i * 0.05 }}
                />
              ))}
            </div>

            {/* Chispas */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={`spark-${i}`}
                className="absolute rounded-full"
                style={{
                  width: '4px',
                  height: '4px',
                  left: `calc(50% + ${-20 + i * 15}px)`,
                  bottom: '80px',
                  background: '#FFD700',
                  boxShadow: '0 0 8px #FF8C00',
                }}
                animate={{
                  y: [-50 - i * 10],
                  x: [(i - 1.5) * 10],
                  opacity: [0, 1, 1, 0],
                  scale: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

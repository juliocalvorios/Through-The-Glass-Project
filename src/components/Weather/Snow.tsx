'use client'

import { memo, useMemo } from 'react'
import { motion } from 'framer-motion'

interface SnowProps {
  intensity?: 'light' | 'moderate' | 'heavy'
}

interface Snowflake {
  id: number
  x: number
  delay: number
  duration: number
  size: number
  opacity: number
  drift: number
  type: 'simple' | 'crystal' | 'dot'
  rotationSpeed: number
}

function SnowComponent({ intensity = 'moderate' }: SnowProps) {
  const flakeCounts = {
    light: 40,
    moderate: 80,
    heavy: 140,
  }

  const flakeCount = flakeCounts[intensity]

  // Generar copos con variedad
  const snowflakes = useMemo<Snowflake[]>(() => {
    return Array.from({ length: flakeCount }, (_, i) => {
      const rand = Math.random()
      let type: Snowflake['type'] = 'dot'
      if (rand > 0.85) type = 'crystal'
      else if (rand > 0.5) type = 'simple'

      return {
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 6 + Math.random() * 12,
        size: type === 'dot' ? 2 + Math.random() * 3 : 6 + Math.random() * 10,
        opacity: 0.5 + Math.random() * 0.5,
        drift: (Math.random() - 0.5) * 80,
        type,
        rotationSpeed: 180 + Math.random() * 360,
      }
    })
  }, [flakeCount])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Copos de nieve */}
      {snowflakes.map((flake) => (
        <motion.div
          key={flake.id}
          className="absolute"
          style={{
            left: `${flake.x}%`,
            opacity: flake.opacity,
          }}
          initial={{ y: '-5%', x: 0, rotate: 0 }}
          animate={{
            y: '105%',
            x: [0, flake.drift * 0.5, flake.drift, flake.drift * 0.7, flake.drift],
            rotate: flake.rotationSpeed,
          }}
          transition={{
            duration: flake.duration,
            delay: flake.delay,
            repeat: Infinity,
            ease: 'linear',
            x: {
              duration: flake.duration,
              ease: 'easeInOut',
            },
          }}
        >
          <SnowflakeShape type={flake.type} size={flake.size} id={flake.id} />
        </motion.div>
      ))}

      {/* Partículas de nieve más pequeñas en el fondo (profundidad) */}
      <div className="absolute inset-0" style={{ opacity: 0.4 }}>
        {Array.from({ length: 30 }, (_, i) => (
          <motion.div
            key={`bg-${i}`}
            className="absolute w-1 h-1 rounded-full bg-white/60"
            style={{
              left: `${Math.random() * 100}%`,
              filter: 'blur(1px)',
            }}
            initial={{ y: '-5%' }}
            animate={{ y: '105%' }}
            transition={{
              duration: 15 + Math.random() * 10,
              delay: Math.random() * 10,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Acumulación de nieve mejorada */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        {/* Capa base */}
        <motion.div
          className="absolute bottom-0 left-0 right-0"
          initial={{ height: 0 }}
          animate={{ height: 16 }}
          transition={{ duration: 5, ease: 'easeOut' }}
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(240,245,255,0.98) 50%, rgba(230,235,250,1) 100%)',
            borderRadius: '60% 60% 0 0 / 100% 100% 0 0',
            boxShadow: '0 -4px 20px rgba(255,255,255,0.5)',
          }}
        />

        {/* Montículos de nieve */}
        <motion.div
          className="absolute bottom-0 left-[15%]"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 4, delay: 2 }}
          style={{
            width: '60px',
            height: '20px',
            background: 'radial-gradient(ellipse at bottom, rgba(255,255,255,0.95) 0%, transparent 70%)',
            borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
          }}
        />
        <motion.div
          className="absolute bottom-0 right-[20%]"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 4, delay: 3 }}
          style={{
            width: '50px',
            height: '18px',
            background: 'radial-gradient(ellipse at bottom, rgba(255,255,255,0.9) 0%, transparent 70%)',
            borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
          }}
        />
      </div>

      {/* Escarcha en las esquinas del cristal - mejorada */}
      <FrostCorners />
    </div>
  )
}

// Forma del copo de nieve según tipo
function SnowflakeShape({ type, size, id }: { type: Snowflake['type']; size: number; id: number }) {
  if (type === 'dot') {
    return (
      <div
        className="rounded-full"
        style={{
          width: size,
          height: size,
          background: 'radial-gradient(circle, #fff 0%, rgba(220,230,255,0.8) 50%, transparent 100%)',
          boxShadow: `0 0 ${size}px rgba(255,255,255,0.6)`,
        }}
      />
    )
  }

  if (type === 'simple') {
    // Copo simple de 6 puntas
    return (
      <svg width={size} height={size} viewBox="0 0 20 20">
        <defs>
          <linearGradient id={`snowGrad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="100%" stopColor="#e0e8ff" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        {/* 6 líneas radiales */}
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <line
            key={angle}
            x1="10"
            y1="10"
            x2={10 + Math.cos((angle * Math.PI) / 180) * 8}
            y2={10 + Math.sin((angle * Math.PI) / 180) * 8}
            stroke={`url(#snowGrad-${id})`}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        ))}
        {/* Centro */}
        <circle cx="10" cy="10" r="2" fill="#fff" />
      </svg>
    )
  }

  // Crystal - copo detallado
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <defs>
        <linearGradient id={`crystalGrad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="50%" stopColor="#e8f0ff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#d0e0ff" stopOpacity="0.7" />
        </linearGradient>
        <filter id={`snowGlow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="0.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g filter={`url(#snowGlow-${id})`}>
        {/* 6 brazos principales */}
        {[0, 60, 120, 180, 240, 300].map((angle) => {
          const rad = (angle * Math.PI) / 180
          const endX = 12 + Math.cos(rad) * 10
          const endY = 12 + Math.sin(rad) * 10
          const midX = 12 + Math.cos(rad) * 5
          const midY = 12 + Math.sin(rad) * 5

          // Ángulos perpendiculares para las ramas
          const perpRad1 = ((angle + 45) * Math.PI) / 180
          const perpRad2 = ((angle - 45) * Math.PI) / 180

          return (
            <g key={angle}>
              {/* Brazo principal */}
              <line
                x1="12"
                y1="12"
                x2={endX}
                y2={endY}
                stroke={`url(#crystalGrad-${id})`}
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              {/* Ramas laterales */}
              <line
                x1={midX}
                y1={midY}
                x2={midX + Math.cos(perpRad1) * 3}
                y2={midY + Math.sin(perpRad1) * 3}
                stroke={`url(#crystalGrad-${id})`}
                strokeWidth="0.8"
                strokeLinecap="round"
              />
              <line
                x1={midX}
                y1={midY}
                x2={midX + Math.cos(perpRad2) * 3}
                y2={midY + Math.sin(perpRad2) * 3}
                stroke={`url(#crystalGrad-${id})`}
                strokeWidth="0.8"
                strokeLinecap="round"
              />
            </g>
          )
        })}

        {/* Centro hexagonal */}
        <polygon
          points="12,9 14.6,10.5 14.6,13.5 12,15 9.4,13.5 9.4,10.5"
          fill="#fff"
          opacity="0.9"
        />
        <circle cx="12" cy="12" r="1.5" fill="#fff" />
      </g>
    </svg>
  )
}

// Escarcha en las esquinas
function FrostCorners() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Esquinas con escarcha mejorada */}
      {[
        { pos: 'top-0 left-0', origin: 'top left' },
        { pos: 'top-0 right-0', origin: 'top right' },
        { pos: 'bottom-0 left-0', origin: 'bottom left' },
        { pos: 'bottom-0 right-0', origin: 'bottom right' },
      ].map(({ pos, origin }, i) => (
        <motion.div
          key={i}
          className={`absolute ${pos} w-32 h-32`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 3, delay: i * 0.5 }}
          style={{
            background: `radial-gradient(ellipse at ${origin}, rgba(255,255,255,0.5) 0%, rgba(240,248,255,0.3) 30%, transparent 60%)`,
            filter: 'blur(2px)',
          }}
        />
      ))}

      {/* Cristales de hielo SVG en las esquinas */}
      <svg className="absolute top-0 left-0 w-20 h-20 opacity-50">
        {[...Array(8)].map((_, i) => {
          const angle = Math.random() * 60
          const length = 15 + Math.random() * 25
          return (
            <line
              key={i}
              x1="0"
              y1="0"
              x2={Math.cos((angle * Math.PI) / 180) * length}
              y2={Math.sin((angle * Math.PI) / 180) * length}
              stroke="white"
              strokeWidth="0.5"
              opacity={0.3 + Math.random() * 0.4}
            />
          )
        })}
      </svg>

      <svg className="absolute top-0 right-0 w-20 h-20 opacity-50" style={{ transform: 'scaleX(-1)' }}>
        {[...Array(8)].map((_, i) => {
          const angle = Math.random() * 60
          const length = 15 + Math.random() * 25
          return (
            <line
              key={i}
              x1="0"
              y1="0"
              x2={Math.cos((angle * Math.PI) / 180) * length}
              y2={Math.sin((angle * Math.PI) / 180) * length}
              stroke="white"
              strokeWidth="0.5"
              opacity={0.3 + Math.random() * 0.4}
            />
          )
        })}
      </svg>
    </div>
  )
}

export const Snow = memo(SnowComponent)

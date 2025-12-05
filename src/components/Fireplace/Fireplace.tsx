'use client'

import { useId, useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TimeOfDay, WeatherCondition } from '@/types'

interface FireplaceProps {
  timeOfDay: TimeOfDay
  condition: WeatherCondition
  onFireChange?: (isLit: boolean) => void
}

interface Spark {
  id: number
  x: number
  delay: number
  size: number
  duration: number
}

interface Ember {
  id: number
  x: number
  y: number
  size: number
  delay: number
  brightness: number
}

export function Fireplace({ timeOfDay, condition, onFireChange }: FireplaceProps) {
  const id = useId()
  const [isLit, setIsLit] = useState(true)
  const [sparks, setSparks] = useState<Spark[]>([])
  const isNight = timeOfDay === 'night' || timeOfDay === 'dusk'

  // Intensidad del fuego según el clima
  const fireIntensity = useMemo(() => {
    if (!isLit) return 0
    switch (condition) {
      case 'snow':
      case 'storm':
        return 1.4
      case 'rain':
        return 1.2
      case 'fog':
      case 'cloudy':
        return 1.0
      case 'clear':
        return isNight ? 1.1 : 0.85
      default:
        return 1.0
    }
  }, [isLit, condition, isNight])

  // Generar brasas estáticas
  const embers = useMemo<Ember[]>(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: 15 + Math.random() * 70,
      y: Math.random() * 15,
      size: 3 + Math.random() * 5,
      delay: Math.random() * 2,
      brightness: 0.5 + Math.random() * 0.5,
    }))
  }, [])

  // Generar chispas periódicamente
  useEffect(() => {
    if (!isLit) {
      setSparks([])
      return
    }

    const interval = setInterval(() => {
      const count = Math.floor(2 + Math.random() * 3)
      const newSparks: Spark[] = Array.from({ length: count }, () => ({
        id: Date.now() + Math.random(),
        x: 30 + Math.random() * 40,
        delay: Math.random() * 0.2,
        size: 2 + Math.random() * 3,
        duration: 1 + Math.random() * 0.8,
      }))
      setSparks(prev => [...prev.slice(-12), ...newSparks])
    }, 400)

    return () => clearInterval(interval)
  }, [isLit])

  // Notificar cambios de estado
  useEffect(() => {
    onFireChange?.(isLit)
  }, [isLit, onFireChange])

  // Paleta de colores nórdica rústica
  const colors = {
    // Piedra natural escandinava - grises cálidos
    stone: {
      base: isNight ? '#3d3a38' : '#A8A5A0',
      light: isNight ? '#4a4745' : '#B8B5B0',
      dark: isNight ? '#2a2826' : '#8A8580',
      highlight: isNight ? '#555250' : '#C5C2BC',
      shadow: isNight ? '#1a1918' : '#6A6560',
    },
    // Ladrillo interior - tonos más cálidos
    brick: {
      base: isNight ? '#3a3230' : '#8B7B75',
      dark: isNight ? '#2a2220' : '#6B5B55',
    },
    // Madera de la repisa
    wood: {
      base: isNight ? '#3d2020' : '#8B4A4A',
      light: isNight ? '#4a2828' : '#A05858',
      dark: isNight ? '#2a1515' : '#6B3636',
    },
    // Interior
    interior: '#0a0808',
    // Fuego - gradientes realistas
    fire: {
      core: '#FFFEF0',
      inner: '#FFE4B5',
      yellow: '#FFD700',
      orange: '#FF8C00',
      red: '#FF4500',
      dark: '#CC2200',
    },
    // Brasas
    ember: {
      hot: '#FF6B35',
      warm: '#E63E00',
      cool: '#8B0000',
    },
    // Metal (herrajes)
    metal: isNight ? '#2a2a2a' : '#3a3a3a',
    metalHighlight: isNight ? '#4a4a4a' : '#5a5a5a',
  }

  const handleClick = () => {
    setIsLit(!isLit)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="relative cursor-pointer"
      onClick={handleClick}
      style={{ width: '220px', height: '300px' }}
    >
      {/* ============================================
          RESPLANDOR AMBIENTAL DEL FUEGO
          ============================================ */}
      <AnimatePresence>
        {isLit && (
          <>
            {/* Resplandor principal en la pared */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.35 * fireIntensity }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute pointer-events-none"
              style={{
                width: '400px',
                height: '350px',
                left: '-90px',
                bottom: '-30px',
                background: 'radial-gradient(ellipse 60% 70% at 50% 80%, rgba(255,100,30,0.6) 0%, rgba(255,60,10,0.3) 30%, transparent 65%)',
                filter: 'blur(30px)',
              }}
            />
            {/* Luz que se proyecta en el suelo */}
            <motion.div
              className="absolute pointer-events-none"
              style={{
                width: '300px',
                height: '60px',
                left: '-40px',
                bottom: '-20px',
                background: 'radial-gradient(ellipse 100% 100% at 50% 0%, rgba(255,120,50,0.25) 0%, transparent 70%)',
                filter: 'blur(15px)',
              }}
              animate={{
                opacity: [0.4 * fireIntensity, 0.6 * fireIntensity, 0.4 * fireIntensity],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </>
        )}
      </AnimatePresence>

      {/* ============================================
          ESTRUCTURA DE PIEDRA - SVG DETALLADO
          ============================================ */}
      <svg width="220" height="300" viewBox="0 0 220 300" className="absolute inset-0">
        <defs>
          {/* Gradientes de piedra */}
          <linearGradient id={`${id}-stoneV`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.stone.dark} />
            <stop offset="30%" stopColor={colors.stone.base} />
            <stop offset="70%" stopColor={colors.stone.base} />
            <stop offset="100%" stopColor={colors.stone.shadow} />
          </linearGradient>

          <linearGradient id={`${id}-stoneH`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.stone.light} />
            <stop offset="50%" stopColor={colors.stone.base} />
            <stop offset="100%" stopColor={colors.stone.dark} />
          </linearGradient>

          {/* Textura de piedra rugosa */}
          <filter id={`${id}-roughness`} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="4" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
          </filter>

          {/* Gradiente para el interior */}
          <radialGradient id={`${id}-interiorGlow`} cx="50%" cy="100%" r="80%">
            <stop offset="0%" stopColor={isLit ? '#1a0a05' : colors.interior} />
            <stop offset="100%" stopColor={colors.interior} />
          </radialGradient>

          {/* Gradiente de la repisa de madera */}
          <linearGradient id={`${id}-woodGrad`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.wood.light} />
            <stop offset="40%" stopColor={colors.wood.base} />
            <stop offset="100%" stopColor={colors.wood.dark} />
          </linearGradient>

          {/* Patrón de vetas de madera */}
          <pattern id={`${id}-woodGrain`} patternUnits="userSpaceOnUse" width="60" height="8">
            <rect width="60" height="8" fill={colors.wood.base} />
            <path d="M0,4 Q15,2 30,4 T60,4" stroke={colors.wood.dark} strokeWidth="0.8" fill="none" opacity="0.4" />
            <path d="M0,6 Q20,5 40,6 T60,6" stroke={colors.wood.dark} strokeWidth="0.4" fill="none" opacity="0.25" />
          </pattern>
        </defs>

        {/* ============ REPISA SUPERIOR ============ */}
        {/* Repisa principal */}
        <rect x="-8" y="38" width="236" height="22" rx="2" fill={`url(#${id}-woodGrad)`} />
        <rect x="-8" y="38" width="236" height="22" fill={`url(#${id}-woodGrain)`} opacity="0.6" />
        {/* Bisel superior */}
        <rect x="-8" y="38" width="236" height="4" fill={colors.wood.light} opacity="0.6" />
        {/* Sombra inferior */}
        <rect x="-8" y="56" width="236" height="4" fill={colors.wood.dark} opacity="0.5" />
        {/* Moldura decorativa */}
        <rect x="-5" y="55" width="230" height="6" rx="1" fill={colors.wood.dark} />
        <rect x="-5" y="55" width="230" height="2" fill={colors.wood.base} opacity="0.4" />

        {/* ============ ESTRUCTURA DE PIEDRA ============ */}

        {/* Columna izquierda - piedras apiladas */}
        <g>
          {/* Piedra 1 */}
          <rect x="0" y="65" width="32" height="50" rx="3" fill={colors.stone.base} stroke={colors.stone.shadow} strokeWidth="1" />
          <rect x="2" y="67" width="28" height="3" fill={colors.stone.highlight} opacity="0.3" />

          {/* Piedra 2 */}
          <rect x="3" y="118" width="30" height="45" rx="3" fill={colors.stone.light} stroke={colors.stone.shadow} strokeWidth="1" />
          <rect x="5" y="120" width="26" height="2" fill={colors.stone.highlight} opacity="0.25" />

          {/* Piedra 3 */}
          <rect x="0" y="166" width="34" height="52" rx="3" fill={colors.stone.base} stroke={colors.stone.shadow} strokeWidth="1" />
          <rect x="2" y="168" width="30" height="3" fill={colors.stone.highlight} opacity="0.3" />

          {/* Piedra 4 */}
          <rect x="2" y="220" width="32" height="48" rx="3" fill={colors.stone.dark} stroke={colors.stone.shadow} strokeWidth="1" />
          <rect x="4" y="222" width="28" height="2" fill={colors.stone.base} opacity="0.3" />

          {/* Piedra 5 (base) */}
          <rect x="0" y="270" width="35" height="28" rx="2" fill={colors.stone.base} stroke={colors.stone.shadow} strokeWidth="1" />
        </g>

        {/* Columna derecha - piedras apiladas */}
        <g>
          {/* Piedra 1 */}
          <rect x="188" y="65" width="32" height="48" rx="3" fill={colors.stone.light} stroke={colors.stone.shadow} strokeWidth="1" />
          <rect x="190" y="67" width="28" height="3" fill={colors.stone.highlight} opacity="0.3" />

          {/* Piedra 2 */}
          <rect x="185" y="116" width="35" height="50" rx="3" fill={colors.stone.base} stroke={colors.stone.shadow} strokeWidth="1" />
          <rect x="187" y="118" width="31" height="2" fill={colors.stone.highlight} opacity="0.25" />

          {/* Piedra 3 */}
          <rect x="188" y="168" width="32" height="48" rx="3" fill={colors.stone.dark} stroke={colors.stone.shadow} strokeWidth="1" />
          <rect x="190" y="170" width="28" height="3" fill={colors.stone.base} opacity="0.3" />

          {/* Piedra 4 */}
          <rect x="186" y="218" width="34" height="52" rx="3" fill={colors.stone.base} stroke={colors.stone.shadow} strokeWidth="1" />
          <rect x="188" y="220" width="30" height="2" fill={colors.stone.highlight} opacity="0.3" />

          {/* Piedra 5 (base) */}
          <rect x="185" y="272" width="35" height="26" rx="2" fill={colors.stone.light} stroke={colors.stone.shadow} strokeWidth="1" />
        </g>

        {/* ============ ARCO SUPERIOR ============ */}
        {/* Arco de piedra con keystone */}
        <path
          d="M 32 70 Q 110 20 188 70"
          fill="none"
          stroke={colors.stone.shadow}
          strokeWidth="38"
          strokeLinecap="round"
        />
        <path
          d="M 32 70 Q 110 25 188 70"
          fill="none"
          stroke={colors.stone.base}
          strokeWidth="32"
          strokeLinecap="round"
        />
        <path
          d="M 32 68 Q 110 28 188 68"
          fill="none"
          stroke={colors.stone.light}
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.4"
        />

        {/* Keystone (piedra central del arco) */}
        <path
          d="M 95 42 L 100 28 L 120 28 L 125 42 Z"
          fill={colors.stone.highlight}
          stroke={colors.stone.shadow}
          strokeWidth="1"
        />
        <path
          d="M 97 42 L 101 31 L 119 31 L 123 42"
          fill="none"
          stroke={colors.stone.light}
          strokeWidth="1"
          opacity="0.5"
        />

        {/* Piedras decorativas en el arco */}
        <ellipse cx="55" cy="55" rx="16" ry="12" fill={colors.stone.base} stroke={colors.stone.shadow} strokeWidth="1" />
        <ellipse cx="75" cy="45" rx="14" ry="11" fill={colors.stone.light} stroke={colors.stone.shadow} strokeWidth="1" />
        <ellipse cx="145" cy="45" rx="14" ry="11" fill={colors.stone.base} stroke={colors.stone.shadow} strokeWidth="1" />
        <ellipse cx="165" cy="55" rx="16" ry="12" fill={colors.stone.light} stroke={colors.stone.shadow} strokeWidth="1" />

        {/* ============ INTERIOR DEL HOGAR ============ */}
        {/* Fondo del hogar */}
        <path
          d="M 35 75 Q 110 55 185 75 L 185 290 L 35 290 Z"
          fill={`url(#${id}-interiorGlow)`}
        />

        {/* Ladrillos interiores del fondo */}
        <g opacity="0.3">
          {[0, 1, 2, 3, 4, 5].map((row) => (
            <g key={row}>
              {[0, 1, 2, 3].map((col) => (
                <rect
                  key={`${row}-${col}`}
                  x={45 + col * 32 + (row % 2) * 16}
                  y={90 + row * 25}
                  width="28"
                  height="22"
                  rx="1"
                  fill={colors.brick.base}
                  stroke={colors.brick.dark}
                  strokeWidth="0.5"
                  opacity={0.5 - row * 0.05}
                />
              ))}
            </g>
          ))}
        </g>

        {/* Sombra interior superior */}
        <path
          d="M 35 75 Q 110 55 185 75 L 185 110 Q 110 90 35 110 Z"
          fill="rgba(0,0,0,0.5)"
        />

        {/* ============ BASE DEL HOGAR ============ */}
        {/* Plataforma de piedra */}
        <rect x="30" y="285" width="160" height="15" rx="2" fill={colors.stone.dark} />
        <rect x="32" y="286" width="156" height="4" fill={colors.stone.base} opacity="0.4" />

        {/* ============ REJILLA DE HIERRO ============ */}
        <g>
          {/* Marco de la rejilla */}
          <rect x="50" y="278" width="120" height="10" rx="2" fill={colors.metal} />
          <rect x="52" y="279" width="116" height="2" fill={colors.metalHighlight} opacity="0.3" />

          {/* Barras verticales */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <rect
              key={i}
              x={58 + i * 14}
              y="279"
              width="3"
              height="8"
              rx="1"
              fill={colors.metalHighlight}
            />
          ))}
        </g>

        {/* ============ HERRAJES DECORATIVOS ============ */}
        {/* Soporte izquierdo */}
        <path
          d="M 28 140 Q 20 140 20 150 L 20 160 Q 20 170 28 170"
          fill="none"
          stroke={colors.metal}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle cx="24" cy="155" r="3" fill={colors.metalHighlight} />

        {/* Soporte derecho */}
        <path
          d="M 192 140 Q 200 140 200 150 L 200 160 Q 200 170 192 170"
          fill="none"
          stroke={colors.metal}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle cx="196" cy="155" r="3" fill={colors.metalHighlight} />
      </svg>

      {/* ============================================
          LEÑOS REALISTAS
          ============================================ */}
      <div className="absolute" style={{ bottom: '25px', left: '55px', width: '110px' }}>
        {/* Leño trasero grande */}
        <div
          className="absolute"
          style={{
            width: '95px',
            height: '22px',
            background: `linear-gradient(180deg,
              ${isNight ? '#4a3a2a' : '#6B5A45'} 0%,
              ${isNight ? '#3a2a1a' : '#5A4A38'} 40%,
              ${isNight ? '#2a1a0a' : '#4A3A28'} 100%)`,
            borderRadius: '11px',
            left: '50%',
            transform: 'translateX(-50%)',
            bottom: '30px',
            boxShadow: isLit
              ? '0 0 20px rgba(255,100,30,0.4), inset 0 -3px 6px rgba(0,0,0,0.3)'
              : 'inset 0 -3px 6px rgba(0,0,0,0.3)',
          }}
        >
          {/* Corteza */}
          <div className="absolute inset-0 rounded-full overflow-hidden opacity-40">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  width: '100%',
                  height: '2px',
                  top: `${20 + i * 8}%`,
                  background: isNight ? '#2a1a0a' : '#3A2A18',
                }}
              />
            ))}
          </div>
          {/* Anillos visibles en los extremos */}
          <div
            className="absolute left-1 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full"
            style={{
              background: `radial-gradient(circle, ${isNight ? '#5a4a3a' : '#7A6A5A'} 20%, ${isNight ? '#3a2a1a' : '#5A4A3A'} 100%)`,
              border: `1px solid ${isNight ? '#2a1a0a' : '#4A3A2A'}`,
            }}
          />
          <div
            className="absolute right-1 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full"
            style={{
              background: `radial-gradient(circle, ${isNight ? '#5a4a3a' : '#7A6A5A'} 20%, ${isNight ? '#3a2a1a' : '#5A4A3A'} 100%)`,
              border: `1px solid ${isNight ? '#2a1a0a' : '#4A3A2A'}`,
            }}
          />
        </div>

        {/* Leño izquierdo diagonal */}
        <div
          className="absolute"
          style={{
            width: '75px',
            height: '18px',
            background: `linear-gradient(180deg,
              ${isNight ? '#5a4a3a' : '#7A6A5A'} 0%,
              ${isNight ? '#3a2a1a' : '#5A4A38'} 100%)`,
            borderRadius: '9px',
            transform: 'rotate(-28deg)',
            left: '-8px',
            bottom: '10px',
            boxShadow: isLit
              ? '0 0 15px rgba(255,100,30,0.5), inset 0 -2px 4px rgba(0,0,0,0.3)'
              : 'inset 0 -2px 4px rgba(0,0,0,0.3)',
          }}
        />

        {/* Leño derecho diagonal */}
        <div
          className="absolute"
          style={{
            width: '75px',
            height: '18px',
            background: `linear-gradient(180deg,
              ${isNight ? '#4a3a2a' : '#6A5A4A'} 0%,
              ${isNight ? '#2a1a0a' : '#4A3A28'} 100%)`,
            borderRadius: '9px',
            transform: 'rotate(28deg)',
            right: '-8px',
            bottom: '10px',
            boxShadow: isLit
              ? '0 0 15px rgba(255,100,30,0.5), inset 0 -2px 4px rgba(0,0,0,0.3)'
              : 'inset 0 -2px 4px rgba(0,0,0,0.3)',
          }}
        />

        {/* Leño pequeño frontal */}
        <div
          className="absolute"
          style={{
            width: '50px',
            height: '14px',
            background: `linear-gradient(180deg,
              ${isNight ? '#5a4a3a' : '#7A6A5A'} 0%,
              ${isNight ? '#3a2a1a' : '#5A4A38'} 100%)`,
            borderRadius: '7px',
            left: '50%',
            transform: 'translateX(-50%)',
            bottom: '2px',
            boxShadow: isLit
              ? '0 0 12px rgba(255,100,30,0.6), inset 0 -2px 4px rgba(0,0,0,0.3)'
              : 'inset 0 -2px 4px rgba(0,0,0,0.3)',
          }}
        />
      </div>

      {/* ============================================
          BRASAS REALISTAS
          ============================================ */}
      <AnimatePresence>
        {isLit && (
          <div
            className="absolute pointer-events-none"
            style={{ bottom: '22px', left: '60px', width: '100px', height: '25px' }}
          >
            {embers.map((ember) => (
              <motion.div
                key={ember.id}
                className="absolute rounded-full"
                style={{
                  width: ember.size,
                  height: ember.size,
                  left: `${ember.x}%`,
                  bottom: ember.y,
                  background: `radial-gradient(circle at 30% 30%,
                    ${colors.ember.hot} 0%,
                    ${colors.ember.warm} 40%,
                    ${colors.ember.cool} 100%)`,
                  boxShadow: `0 0 ${ember.size}px ${colors.ember.hot}`,
                }}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [ember.brightness * 0.6, ember.brightness, ember.brightness * 0.6],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 0.3 + Math.random() * 0.4,
                  repeat: Infinity,
                  delay: ember.delay,
                }}
              />
            ))}

            {/* Ceniza brillante en los bordes */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={`ash-${i}`}
                className="absolute"
                style={{
                  width: '100%',
                  height: '2px',
                  bottom: 20 + i * 2,
                  background: `linear-gradient(90deg,
                    transparent 0%,
                    rgba(255,100,30,${0.1 - i * 0.015}) 20%,
                    rgba(255,100,30,${0.15 - i * 0.02}) 50%,
                    rgba(255,100,30,${0.1 - i * 0.015}) 80%,
                    transparent 100%)`,
                }}
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 1 + i * 0.2,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* ============================================
          SISTEMA DE LLAMAS AVANZADO
          ============================================ */}
      <AnimatePresence>
        {isLit && (
          <div
            className="absolute pointer-events-none"
            style={{ bottom: '50px', left: '50%', transform: 'translateX(-50%)' }}
          >
            {/* Capa de humo/calor (distorsión) */}
            <motion.div
              className="absolute"
              style={{
                width: '120px',
                height: '80px',
                left: '50%',
                bottom: '60px',
                transform: 'translateX(-50%)',
                background: 'radial-gradient(ellipse, rgba(255,200,150,0.05) 0%, transparent 70%)',
                filter: 'blur(10px)',
              }}
              animate={{
                opacity: [0.3, 0.5, 0.3],
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* LLAMA CENTRAL PRINCIPAL */}
            <motion.div
              className="absolute"
              style={{
                width: '55px',
                height: '95px',
                left: '50%',
                bottom: 0,
                transform: 'translateX(-50%)',
                background: `linear-gradient(0deg,
                  ${colors.fire.dark} 0%,
                  ${colors.fire.red} 15%,
                  ${colors.fire.orange} 35%,
                  ${colors.fire.yellow} 55%,
                  ${colors.fire.inner} 75%,
                  ${colors.fire.core} 90%,
                  rgba(255,255,255,0.9) 100%)`,
                borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                filter: 'blur(2px)',
                boxShadow: `0 0 30px ${colors.fire.orange}, 0 0 60px ${colors.fire.red}40`,
              }}
              animate={{
                scaleY: [1 * fireIntensity, 1.18 * fireIntensity, 0.92 * fireIntensity, 1.12 * fireIntensity, 1 * fireIntensity],
                scaleX: [1, 0.94, 1.06, 0.97, 1],
                skewX: [0, 2.5, -2.5, 1.5, 0],
                y: [0, -2, 0, -1, 0],
              }}
              transition={{
                duration: 0.3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* LLAMA IZQUIERDA */}
            <motion.div
              className="absolute"
              style={{
                width: '38px',
                height: '70px',
                left: '-28px',
                bottom: 0,
                background: `linear-gradient(0deg,
                  ${colors.fire.dark} 0%,
                  ${colors.fire.red} 20%,
                  ${colors.fire.orange} 45%,
                  ${colors.fire.yellow} 70%,
                  ${colors.fire.inner} 90%,
                  transparent 100%)`,
                borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                filter: 'blur(1.5px)',
              }}
              animate={{
                scaleY: [0.88 * fireIntensity, 1.15 * fireIntensity, 0.82 * fireIntensity, 1.05 * fireIntensity],
                rotate: [-6, 5, -4, 0],
                x: [0, 2, 0, 1, 0],
              }}
              transition={{
                duration: 0.4,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.08,
              }}
            />

            {/* LLAMA DERECHA */}
            <motion.div
              className="absolute"
              style={{
                width: '40px',
                height: '75px',
                right: '-30px',
                bottom: 0,
                background: `linear-gradient(0deg,
                  ${colors.fire.dark} 0%,
                  ${colors.fire.red} 18%,
                  ${colors.fire.orange} 42%,
                  ${colors.fire.yellow} 68%,
                  ${colors.fire.inner} 88%,
                  transparent 100%)`,
                borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                filter: 'blur(1.5px)',
              }}
              animate={{
                scaleY: [0.92 * fireIntensity, 1.1 * fireIntensity, 0.85 * fireIntensity, 1.12 * fireIntensity],
                rotate: [5, -4, 3, 0],
                x: [0, -2, 0, -1, 0],
              }}
              transition={{
                duration: 0.38,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.12,
              }}
            />

            {/* LLAMAS SECUNDARIAS PEQUEÑAS */}
            {[-45, -20, 20, 45].map((offset, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  width: '22px',
                  height: '45px',
                  left: `calc(50% + ${offset}px)`,
                  transform: 'translateX(-50%)',
                  bottom: 0,
                  background: `linear-gradient(0deg,
                    ${colors.fire.red} 0%,
                    ${colors.fire.orange} 40%,
                    ${colors.fire.yellow} 80%,
                    transparent 100%)`,
                  borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                  filter: 'blur(1.5px)',
                }}
                animate={{
                  scaleY: [0.6 * fireIntensity, 0.95 * fireIntensity, 0.5 * fireIntensity, 0.85 * fireIntensity],
                  opacity: [0.6, 1, 0.5, 0.9],
                  rotate: [offset > 0 ? 3 : -3, offset > 0 ? -2 : 2, 0],
                }}
                transition={{
                  duration: 0.45 + i * 0.05,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.08,
                }}
              />
            ))}

            {/* NÚCLEO BRILLANTE */}
            <motion.div
              className="absolute"
              style={{
                width: '35px',
                height: '50px',
                left: '50%',
                bottom: '15px',
                transform: 'translateX(-50%)',
                background: `radial-gradient(ellipse at 50% 70%,
                  rgba(255,255,255,0.95) 0%,
                  ${colors.fire.core} 20%,
                  ${colors.fire.inner} 45%,
                  transparent 100%)`,
                filter: 'blur(4px)',
              }}
              animate={{
                opacity: [0.7, 1, 0.7],
                scale: [1, 1.12, 1],
              }}
              transition={{
                duration: 0.22,
                repeat: Infinity,
              }}
            />

            {/* LENGUAS DE FUEGO ALEATORIAS */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={`tongue-${i}`}
                className="absolute"
                style={{
                  width: '12px',
                  height: '35px',
                  left: `calc(50% + ${-15 + i * 15}px)`,
                  transform: 'translateX(-50%)',
                  bottom: '50px',
                  background: `linear-gradient(0deg,
                    ${colors.fire.yellow} 0%,
                    ${colors.fire.inner} 60%,
                    transparent 100%)`,
                  borderRadius: '50% 50% 50% 50% / 70% 70% 30% 30%',
                  filter: 'blur(2px)',
                }}
                animate={{
                  scaleY: [0.4, 1, 0.3, 0.8, 0.4],
                  opacity: [0.4, 0.9, 0.3, 0.7, 0.4],
                  x: [0, 3, -2, 1, 0],
                }}
                transition={{
                  duration: 0.5 + i * 0.15,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.15,
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* ============================================
          CHISPAS
          ============================================ */}
      <AnimatePresence>
        {sparks.map((spark) => (
          <motion.div
            key={spark.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: spark.size,
              height: spark.size,
              left: `calc(${spark.x}% + 55px)`,
              bottom: '120px',
              background: `radial-gradient(circle, ${colors.fire.core} 0%, ${colors.fire.yellow} 50%, ${colors.fire.orange} 100%)`,
              boxShadow: `0 0 ${spark.size * 2}px ${colors.fire.orange}`,
            }}
            initial={{ opacity: 0, y: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: [-80 - Math.random() * 40],
              x: [(Math.random() - 0.5) * 40],
              scale: [0.3, 1, 0.5, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: spark.duration,
              ease: 'easeOut',
              delay: spark.delay,
            }}
          />
        ))}
      </AnimatePresence>

      {/* ============================================
          LUZ SUPERIOR DEL ARCO
          ============================================ */}
      <AnimatePresence>
        {isLit && (
          <motion.div
            className="absolute pointer-events-none"
            style={{
              top: '60px',
              left: '40px',
              width: '140px',
              height: '60px',
              background: 'radial-gradient(ellipse at 50% 100%, rgba(255,150,60,0.4) 0%, rgba(255,100,30,0.15) 50%, transparent 80%)',
              filter: 'blur(10px)',
            }}
            animate={{
              opacity: [0.5 * fireIntensity, 0.85 * fireIntensity, 0.5 * fireIntensity],
            }}
            transition={{
              duration: 0.35,
              repeat: Infinity,
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

'use client'

import { useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { TimeOfDay } from '@/types'

interface DayNightToggleProps {
  timeOfDay: TimeOfDay
  isOverride: boolean
  onToggle: () => void
}

export function DayNightToggle({ timeOfDay, isOverride, onToggle }: DayNightToggleProps) {
  const isNight = timeOfDay === 'night' || timeOfDay === 'dusk'
  const [isPulling, setIsPulling] = useState(false)
  const cordControls = useAnimation()
  const lampControls = useAnimation()

  // Colores de la lámpara estilo cabaña
  const colors = {
    cord: isNight ? '#3a2a20' : '#5A4030',
    cordKnob: isNight ? '#D4A574' : '#C9A86C',
    shade: isNight ? '#2a1818' : '#8B4A4A',
    shadeLight: isNight ? '#3a2222' : '#A05858',
    shadeDark: isNight ? '#1a0f0f' : '#6B3636',
    metal: isNight ? '#B8956C' : '#D4A574',
    metalDark: isNight ? '#8B7355' : '#A67C52',
    bulbOff: '#4A4035',
    bulbOn: '#FFF8E0',
    glowColor: 'rgba(255, 220, 150, 0.6)',
  }

  const handlePull = async () => {
    setIsPulling(true)

    // Animate cord pull
    await cordControls.start({
      y: [0, 15, 0],
      transition: { duration: 0.3, ease: 'easeInOut' }
    })

    // Slight lamp swing
    lampControls.start({
      rotate: [0, -2, 2, -1, 0],
      transition: { duration: 0.5, ease: 'easeOut' }
    })

    onToggle()
    setIsPulling(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="relative flex flex-col items-center"
      style={{ width: '80px' }}
    >
      {/* Cable principal que va al techo */}
      <div
        className="w-1 rounded-full"
        style={{
          height: '30px',
          background: `linear-gradient(180deg, ${colors.cord} 0%, ${colors.cordKnob} 100%)`,
          boxShadow: isNight ? 'none' : '1px 0 2px rgba(0,0,0,0.2)',
        }}
      />

      {/* La lámpara entera (se balancea) */}
      <motion.div
        animate={lampControls}
        className="relative flex flex-col items-center"
        style={{ transformOrigin: 'top center' }}
      >
        {/* Enganche de metal decorativo */}
        <svg width="24" height="12" viewBox="0 0 24 12" className="relative z-10">
          <defs>
            <linearGradient id="metalGradLamp" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.metal} />
              <stop offset="50%" stopColor={colors.metalDark} />
              <stop offset="100%" stopColor={colors.metal} />
            </linearGradient>
          </defs>
          {/* Pieza de enganche */}
          <path
            d="M10 0 L14 0 L16 4 L18 4 L18 8 L6 8 L6 4 L8 4 Z"
            fill="url(#metalGradLamp)"
          />
          {/* Remaches decorativos */}
          <circle cx="8" cy="6" r="1" fill={colors.metalDark} />
          <circle cx="16" cy="6" r="1" fill={colors.metalDark} />
        </svg>

        {/* Pantalla de la lámpara (shade) */}
        <div
          className="relative"
          style={{
            width: '70px',
            height: '45px',
          }}
        >
          {/* Forma de la pantalla - cónica con textura de tela/lino */}
          <svg width="70" height="45" viewBox="0 0 70 45" className="absolute top-0 left-0">
            <defs>
              {/* Gradiente de la pantalla */}
              <linearGradient id="shadeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={colors.shadeLight} />
                <stop offset="30%" stopColor={colors.shade} />
                <stop offset="70%" stopColor={colors.shade} />
                <stop offset="100%" stopColor={colors.shadeDark} />
              </linearGradient>
              {/* Patrón de textura de lino */}
              <pattern id="linenTexture" patternUnits="userSpaceOnUse" width="4" height="4">
                <rect width="4" height="4" fill={colors.shade} />
                <line x1="0" y1="0" x2="4" y2="0" stroke={colors.shadeLight} strokeWidth="0.3" opacity="0.3" />
                <line x1="0" y1="2" x2="4" y2="2" stroke={colors.shadeDark} strokeWidth="0.2" opacity="0.2" />
              </pattern>
              {/* Resplandor interior cuando está encendida */}
              <radialGradient id="innerGlow" cx="50%" cy="100%" r="80%">
                <stop offset="0%" stopColor={isNight ? colors.bulbOff : colors.bulbOn} stopOpacity={isNight ? 0 : 0.4} />
                <stop offset="100%" stopColor={isNight ? colors.bulbOff : colors.bulbOn} stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Forma trapezoidal de la pantalla */}
            <path
              d="M15 0 L55 0 L65 42 Q35 48 5 42 Z"
              fill="url(#shadeGrad)"
            />
            {/* Textura superpuesta */}
            <path
              d="M15 0 L55 0 L65 42 Q35 48 5 42 Z"
              fill="url(#linenTexture)"
              opacity="0.5"
            />
            {/* Borde superior metálico */}
            <path
              d="M14 0 L56 0 L56 3 L14 3 Z"
              fill={colors.metal}
            />
            {/* Resplandor interior */}
            <ellipse
              cx="35"
              cy="35"
              rx="25"
              ry="15"
              fill="url(#innerGlow)"
            />
          </svg>

          {/* Efecto de luz cuando está encendido (día) */}
          {!isNight && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute"
              style={{
                bottom: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '50px',
                height: '30px',
                background: `radial-gradient(ellipse at center, ${colors.glowColor} 0%, transparent 70%)`,
                filter: 'blur(8px)',
                pointerEvents: 'none',
              }}
            />
          )}
        </div>

        {/* Bombilla visible por debajo */}
        <div className="relative" style={{ marginTop: '-8px' }}>
          <motion.div
            animate={{
              boxShadow: isNight
                ? 'none'
                : `0 0 20px ${colors.glowColor}, 0 0 40px rgba(255, 200, 100, 0.3)`,
            }}
            transition={{ duration: 0.5 }}
            className="rounded-full"
            style={{
              width: '16px',
              height: '20px',
              background: isNight
                ? `radial-gradient(ellipse at 30% 30%, #5a5045 0%, ${colors.bulbOff} 100%)`
                : `radial-gradient(ellipse at 30% 30%, #FFFEF5 0%, ${colors.bulbOn} 100%)`,
              borderRadius: '50% 50% 45% 45%',
            }}
          />
          {/* Casquillo de la bombilla */}
          <div
            style={{
              width: '10px',
              height: '6px',
              margin: '-2px auto 0',
              background: `linear-gradient(90deg, ${colors.metalDark} 0%, ${colors.metal} 50%, ${colors.metalDark} 100%)`,
              borderRadius: '0 0 3px 3px',
            }}
          />
        </div>

        {/* Cordón de tiro (pull cord) */}
        <motion.div
          animate={cordControls}
          className="flex flex-col items-center cursor-pointer"
          onClick={handlePull}
          style={{ marginTop: '8px' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Cordón */}
          <div
            style={{
              width: '2px',
              height: '35px',
              background: `linear-gradient(180deg, ${colors.cord} 0%, ${colors.cord} 80%, ${colors.cordKnob} 100%)`,
            }}
          />
          {/* Bolita decorativa del cordón (wooden bead) */}
          <div
            className="rounded-full relative"
            style={{
              width: '14px',
              height: '14px',
              background: `radial-gradient(ellipse at 30% 30%, ${colors.metal} 0%, ${colors.cordKnob} 50%, ${colors.metalDark} 100%)`,
              boxShadow: `
                inset 0 -2px 4px rgba(0,0,0,0.3),
                0 2px 4px rgba(0,0,0,0.3)
              `,
            }}
          >
            {/* Agujero del cordón */}
            <div
              className="absolute rounded-full"
              style={{
                width: '3px',
                height: '3px',
                top: '2px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: colors.cord,
              }}
            />
          </div>

          {/* Indicador de override */}
          {isOverride && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute rounded-full"
              style={{
                width: '8px',
                height: '8px',
                bottom: '-12px',
                background: '#8B5CF6',
                boxShadow: '0 0 8px #8B5CF6',
              }}
            />
          )}
        </motion.div>
      </motion.div>

      {/* Cono de luz proyectado (solo de día/encendido) */}
      {!isNight && (
        <motion.div
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 0.15, scaleY: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute pointer-events-none"
          style={{
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '0',
            height: '0',
            borderLeft: '40px solid transparent',
            borderRight: '40px solid transparent',
            borderTop: '120px solid rgba(255, 220, 150, 0.3)',
            filter: 'blur(10px)',
          }}
        />
      )}
    </motion.div>
  )
}

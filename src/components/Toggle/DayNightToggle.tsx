'use client'

import { useId } from 'react'
import { motion } from 'framer-motion'
import { TimeOfDay } from '@/types'

interface DayNightToggleProps {
  timeOfDay: TimeOfDay
  isOverride: boolean
  onToggle: () => void
  onPlaySound?: () => void
}

export function DayNightToggle({ timeOfDay, isOverride, onToggle, onPlaySound }: DayNightToggleProps) {
  const id = useId()
  const isNight = timeOfDay === 'night' || timeOfDay === 'dusk'
  const isOn = !isNight

  // Colores de la lámpara estilo cabaña nórdica
  const colors = {
    // Cable y soportes
    cable: isNight ? '#2a1a10' : '#4A3020',
    cableHighlight: isNight ? '#3a2a20' : '#5A4030',

    // Metal (bronce/latón envejecido)
    metal: isNight ? '#8B7355' : '#C9A86C',
    metalLight: isNight ? '#A08060' : '#D4B87A',
    metalDark: isNight ? '#5A4A35' : '#8B7040',

    // Pantalla de tela (rojo burdeos estilo cabaña)
    shade: isNight ? '#2a1515' : '#8B4A4A',
    shadeLight: isNight ? '#3a2020' : '#A05858',
    shadeDark: isNight ? '#1a0a0a' : '#6B3636',
    shadeInner: isNight ? '#1a0808' : '#4A2525',

    // Bombilla
    bulbGlass: isNight ? '#3a3530' : '#FFF8E8',
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative flex flex-col items-center"
      style={{ width: '100px' }}
    >
      {/* Cable eléctrico que va al techo */}
      <svg width="6" height="35" viewBox="0 0 6 35">
        <defs>
          <linearGradient id={`${id}-cableGrad`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.cable} />
            <stop offset="50%" stopColor={colors.cableHighlight} />
            <stop offset="100%" stopColor={colors.cable} />
          </linearGradient>
        </defs>
        <rect x="1" y="0" width="4" height="35" rx="2" fill={`url(#${id}-cableGrad)`} />
      </svg>

      {/* Florón (ceiling rose) - pieza decorativa en el techo */}
      <svg width="30" height="15" viewBox="0 0 30 15" style={{ marginTop: '-2px' }}>
        <defs>
          <linearGradient id={`${id}-floronGrad`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.metalLight} />
            <stop offset="50%" stopColor={colors.metal} />
            <stop offset="100%" stopColor={colors.metalDark} />
          </linearGradient>
        </defs>
        <ellipse cx="15" cy="4" rx="12" ry="4" fill={`url(#${id}-floronGrad)`} />
        <path d="M10 6 L10 12 Q15 14 20 12 L20 6" fill={colors.metal} />
        <ellipse cx="15" cy="6" rx="8" ry="2" fill={colors.metalDark} opacity="0.5" />
      </svg>

      {/* Cadena decorativa */}
      <div className="flex flex-col items-center" style={{ marginTop: '-3px' }}>
        {[0, 1, 2].map((i) => (
          <svg key={i} width="12" height="10" viewBox="0 0 12 10" style={{ marginTop: i > 0 ? '-4px' : 0 }}>
            <ellipse cx="6" cy="5" rx="5" ry="4" fill="none" stroke={colors.metal} strokeWidth="2" />
            <ellipse cx="6" cy="5" rx="3" ry="2" fill="none" stroke={colors.metalLight} strokeWidth="0.5" opacity="0.5" />
          </svg>
        ))}
      </div>

      {/* La lámpara cónica - clickeable */}
      <motion.div
        className="relative flex flex-col items-center cursor-pointer"
        style={{ marginTop: '-2px' }}
        onClick={() => {
          onPlaySound?.()
          onToggle()
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        title="Toggle light"
      >
        <svg width="90" height="70" viewBox="0 0 90 70">
          <defs>
            <linearGradient id={`${id}-shadeOuter`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.shadeLight} />
              <stop offset="30%" stopColor={colors.shade} />
              <stop offset="70%" stopColor={colors.shade} />
              <stop offset="100%" stopColor={colors.shadeDark} />
            </linearGradient>

            <radialGradient id={`${id}-shadeInner`} cx="50%" cy="80%" r="80%">
              <stop offset="0%" stopColor={isOn ? 'rgba(255,220,150,0.6)' : colors.shadeInner} />
              <stop offset="60%" stopColor={isOn ? 'rgba(255,180,100,0.3)' : colors.shadeInner} />
              <stop offset="100%" stopColor={colors.shadeInner} />
            </radialGradient>

            <radialGradient id={`${id}-bulbGrad`} cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor={isOn ? '#FFFEF8' : '#5a5550'} />
              <stop offset="40%" stopColor={isOn ? '#FFF8E0' : '#4a4540'} />
              <stop offset="100%" stopColor={isOn ? '#FFE8B0' : '#3a3530'} />
            </radialGradient>

            <pattern id={`${id}-fabricTexture`} patternUnits="userSpaceOnUse" width="4" height="4">
              <rect width="4" height="4" fill={colors.shade} />
              <line x1="0" y1="0" x2="4" y2="0" stroke={colors.shadeLight} strokeWidth="0.3" opacity="0.2" />
              <line x1="0" y1="2" x2="4" y2="2" stroke={colors.shadeDark} strokeWidth="0.2" opacity="0.15" />
            </pattern>

            <filter id={`${id}-bulbGlow`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
            </filter>
          </defs>

          {/* Soporte metálico superior */}
          <path d="M40 0 L50 0 L52 5 L55 5 L55 10 L35 10 L35 5 L38 5 Z" fill={colors.metal} />
          <path d="M38 5 L52 5 L52 8 L38 8 Z" fill={colors.metalDark} />

          {/* Aro metálico superior */}
          <ellipse cx="45" cy="12" rx="18" ry="3" fill={colors.metalDark} />
          <ellipse cx="45" cy="11" rx="18" ry="3" fill={colors.metal} />
          <ellipse cx="45" cy="11" rx="16" ry="2" fill={colors.metalLight} opacity="0.3" />

          {/* Pantalla cónica */}
          <path d="M27 13 L63 13 L75 55 L15 55 Z" fill={`url(#${id}-shadeOuter)`} />
          <path d="M27 13 L63 13 L75 55 L15 55 Z" fill={`url(#${id}-fabricTexture)`} opacity="0.4" />

          {/* Costuras decorativas */}
          <line x1="45" y1="13" x2="45" y2="55" stroke={colors.shadeDark} strokeWidth="0.5" opacity="0.3" />
          <line x1="36" y1="13" x2="30" y2="55" stroke={colors.shadeDark} strokeWidth="0.3" opacity="0.2" />
          <line x1="54" y1="13" x2="60" y2="55" stroke={colors.shadeDark} strokeWidth="0.3" opacity="0.2" />

          {/* Interior iluminado */}
          <path d="M20 52 L70 52 L72 55 Q45 62 18 55 Z" fill={`url(#${id}-shadeInner)`} />

          {/* Aro metálico inferior */}
          <ellipse cx="45" cy="55" rx="30" ry="4" fill={colors.metalDark} />
          <ellipse cx="45" cy="54" rx="30" ry="4" fill={colors.metal} />

          {/* Glow de la bombilla */}
          {isOn && (
            <ellipse cx="45" cy="60" rx="12" ry="8" fill="rgba(255,220,150,0.6)" filter={`url(#${id}-bulbGlow)`} />
          )}

          {/* Bombilla */}
          <ellipse cx="45" cy="60" rx="6" ry="7" fill={`url(#${id}-bulbGrad)`} />
          <ellipse cx="43" cy="57" rx="2" ry="2" fill="white" opacity={isOn ? 0.6 : 0.2} />

          {/* Casquillo */}
          <rect x="42" y="52" width="6" height="4" rx="1" fill={colors.metalDark} />
          <line x1="42" y1="53" x2="48" y2="53" stroke={colors.metal} strokeWidth="0.5" />
          <line x1="42" y1="54.5" x2="48" y2="54.5" stroke={colors.metal} strokeWidth="0.5" />
        </svg>

        {/* Halo de luz suave debajo de la lámpara */}
        {isOn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            className="absolute pointer-events-none"
            style={{
              bottom: '-15px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '70px',
              height: '35px',
              background: 'radial-gradient(ellipse at center, rgba(255,220,150,0.4) 0%, rgba(255,200,120,0.2) 40%, transparent 70%)',
              filter: 'blur(8px)',
            }}
          />
        )}
      </motion.div>

      {/* Luz proyectada hacia abajo - forma más natural */}
      {isOn && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute pointer-events-none"
          style={{
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          {/* Cono de luz suave y natural */}
          <div
            style={{
              width: '120px',
              height: '180px',
              background: 'radial-gradient(ellipse 60% 100% at 50% 0%, rgba(255, 220, 150, 0.15) 0%, rgba(255, 200, 120, 0.08) 40%, transparent 70%)',
              filter: 'blur(15px)',
            }}
          />
        </motion.div>
      )}
    </motion.div>
  )
}

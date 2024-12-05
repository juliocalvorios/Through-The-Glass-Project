'use client'

import { memo, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TimeOfDay, WeatherCondition } from '@/types'

interface NordicWindowProps {
  children: ReactNode
  timeOfDay: TimeOfDay
  condition: WeatherCondition
  curtainsOpen?: boolean
  onCurtainsToggle?: () => void
  fireGlow?: boolean
}

function NordicWindowComponent({ children, timeOfDay, condition, curtainsOpen = true, onCurtainsToggle, fireGlow = false }: NordicWindowProps) {
  const isNight = timeOfDay === 'night' || timeOfDay === 'dusk'

  // Paleta de colores SCANDINAVIAN WINTER CABIN - Madera roja noruega
  const colors = {
    frame: {
      // Madera roja escandinava (pino rojo, cerezo nórdico)
      outer: isNight ? '#1a0f0f' : '#6B2D2D',      // Rojo oscuro profundo
      middle: isNight ? '#2a1515' : '#8B3A3A',     // Rojo caoba
      inner: isNight ? '#3d2020' : '#A04545',      // Rojo cerezo
      accent: isNight ? '#4a2828' : '#B85555',     // Rojo cálido
      highlight: isNight ? '#5a3535' : '#C96666',  // Rojo claro
      deep: isNight ? '#120a0a' : '#4A1E1E',       // Rojo muy oscuro (sombras)
    },
    glass: {
      tint: isNight ? 'rgba(10, 15, 30, 0.3)' : 'rgba(200, 220, 255, 0.1)',
    },
    curtain: {
      base: isNight ? '#2a2525' : '#E8DDD5',       // Lino natural
      shadow: isNight ? '#1a1515' : '#D0C4BC',
      highlight: isNight ? '#3a3232' : '#F5EDE5',
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative"
      style={{
        width: 'min(80vw, 700px)',
        height: 'min(65vh, 550px)',
      }}
    >
      {/* ============================================
          CAPA 1: SOMBRA EXTERIOR PROFUNDA
          ============================================ */}
      <div
        className="absolute -inset-4 rounded-2xl"
        style={{
          background: 'transparent',
          boxShadow: isNight
            ? `
              0 25px 80px rgba(0,0,0,0.7),
              0 15px 40px rgba(0,0,0,0.5),
              0 5px 15px rgba(0,0,0,0.4)
            `
            : `
              0 25px 80px rgba(0,0,0,0.25),
              0 15px 40px rgba(0,0,0,0.15),
              0 5px 15px rgba(0,0,0,0.1)
            `,
        }}
      />

      {/* ============================================
          CAPA 2: MARCO EXTERIOR (Moldura principal)
          ============================================ */}
      <div
        className="absolute inset-0 rounded-xl overflow-hidden"
        style={{
          background: `linear-gradient(
            145deg,
            ${colors.frame.middle} 0%,
            ${colors.frame.outer} 50%,
            ${colors.frame.outer} 100%
          )`,
          padding: '6px',
        }}
      >
        {/* Bisel superior del marco exterior */}
        <div
          className="absolute top-0 left-0 right-0 h-1.5 rounded-t-xl"
          style={{
            background: `linear-gradient(180deg, ${colors.frame.highlight}90 0%, transparent 100%)`,
          }}
        />

        {/* Bisel inferior (sombra) del marco exterior */}
        <div
          className="absolute bottom-0 left-0 right-0 h-2"
          style={{
            background: `linear-gradient(0deg, rgba(0,0,0,0.4) 0%, transparent 100%)`,
          }}
        />

        {/* ============================================
            CAPA 3: SEGUNDO MARCO (Moldura intermedia)
            ============================================ */}
        <div
          className="relative w-full h-full rounded-lg overflow-hidden"
          style={{
            background: `linear-gradient(
              170deg,
              ${colors.frame.inner} 0%,
              ${colors.frame.middle} 30%,
              ${colors.frame.middle} 70%,
              ${colors.frame.outer} 100%
            )`,
            padding: '8px',
            boxShadow: `
              inset 0 2px 4px rgba(255,255,255,${isNight ? 0.05 : 0.3}),
              inset 0 -2px 4px rgba(0,0,0,0.2)
            `,
          }}
        >
          {/* Textura de madera - vetas horizontales */}
          <WoodGrainTexture isNight={isNight} />

          {/* ============================================
              CAPA 4: MARCO INTERIOR (Rebaje para el cristal)
              ============================================ */}
          <div
            className="relative w-full h-full rounded-md overflow-hidden"
            style={{
              background: colors.frame.outer,
              padding: '4px',
              boxShadow: `
                inset 0 3px 8px rgba(0,0,0,0.4),
                inset 0 -1px 2px rgba(255,255,255,${isNight ? 0.05 : 0.15})
              `,
            }}
          >
            {/* ============================================
                CAPA 5: ÁREA DEL CRISTAL
                ============================================ */}
            <div className="relative w-full h-full rounded overflow-hidden">

              {/* Fondo del cielo */}
              <div
                className="absolute inset-0 transition-all duration-1000"
                style={{
                  background: getSkyGradient(timeOfDay, condition),
                }}
              />

              {/* Contenido (efectos del clima) */}
              <div className="absolute inset-0 z-10">
                {children}
              </div>

              {/* ============================================
                  CRISTAL: Efectos de vidrio realista
                  ============================================ */}
              <GlassEffects
                isNight={isNight}
                condition={condition}
                fireGlow={fireGlow}
              />

              {/* ============================================
                  DIVISIONES DE LA VENTANA (Muntins)
                  ============================================ */}
              <WindowMuntins colors={colors} isNight={isNight} />

            </div>
          </div>
        </div>
      </div>

      {/* ============================================
          CORTINAS
          ============================================ */}
      <Curtains
        isNight={isNight}
        condition={condition}
        isOpen={curtainsOpen}
        onToggle={onCurtainsToggle || (() => {})}
      />

      {/* ============================================
          ALFÉIZAR (Windowsill)
          ============================================ */}
      <Windowsill colors={colors} isNight={isNight} condition={condition} />

    </motion.div>
  )
}

// ============================================
// TEXTURA DE MADERA
// ============================================
function WoodGrainTexture({ isNight }: { isNight: boolean }) {
  // Colores de vetas para madera roja
  const grainColor = isNight ? '#0a0505' : '#3d1515'
  const grainColorLight = isNight ? '#1a0a0a' : '#5a2020'
  const knotColor = isNight ? '#080404' : '#2a0f0f'

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
      {/* Vetas principales - patrón de madera roja */}
      <svg className="absolute inset-0 w-full h-full opacity-25" preserveAspectRatio="none">
        <defs>
          <pattern id="woodGrainRed" patternUnits="userSpaceOnUse" width="150" height="12">
            {/* Veta principal ondulada */}
            <path
              d="M0,3 Q30,1 60,3 Q90,5 120,3 T150,3"
              stroke={grainColor}
              strokeWidth="0.8"
              fill="none"
              opacity="0.6"
            />
            {/* Veta secundaria */}
            <path
              d="M0,7 Q40,5 80,7 Q110,9 150,7"
              stroke={grainColor}
              strokeWidth="0.5"
              fill="none"
              opacity="0.4"
            />
            {/* Veta fina */}
            <path
              d="M0,10 Q25,9 50,10 Q75,11 100,10 T150,10"
              stroke={grainColorLight}
              strokeWidth="0.3"
              fill="none"
              opacity="0.3"
            />
          </pattern>
          {/* Gradiente para dar profundidad a la madera */}
          <linearGradient id="woodDepth" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.05" />
            <stop offset="50%" stopColor="black" stopOpacity="0" />
            <stop offset="100%" stopColor="black" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#woodGrainRed)" />
        <rect width="100%" height="100%" fill="url(#woodDepth)" />
      </svg>

      {/* Nudos de madera - característicos de pino rojo */}
      <div
        className="absolute rounded-full"
        style={{
          width: '18px',
          height: '12px',
          top: '18%',
          left: '12%',
          background: `radial-gradient(ellipse, ${knotColor} 0%, ${knotColor}80 40%, transparent 70%)`,
          opacity: 0.3,
          transform: 'rotate(-5deg)',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: '14px',
          height: '10px',
          bottom: '25%',
          right: '18%',
          background: `radial-gradient(ellipse, ${knotColor} 0%, ${knotColor}80 40%, transparent 70%)`,
          opacity: 0.25,
          transform: 'rotate(8deg)',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: '10px',
          height: '8px',
          top: '60%',
          left: '75%',
          background: `radial-gradient(ellipse, ${knotColor} 0%, ${knotColor}60 50%, transparent 70%)`,
          opacity: 0.2,
        }}
      />

      {/* Variación de tono en la madera (anillos de crecimiento) */}
      <div
        className="absolute inset-0"
        style={{
          background: `repeating-linear-gradient(
            92deg,
            transparent 0px,
            transparent 40px,
            ${isNight ? 'rgba(255,200,200,0.02)' : 'rgba(80,20,20,0.03)'} 40px,
            ${isNight ? 'rgba(255,200,200,0.02)' : 'rgba(80,20,20,0.03)'} 42px,
            transparent 42px,
            transparent 80px
          )`,
        }}
      />
    </div>
  )
}

// ============================================
// EFECTOS DEL CRISTAL - Realista y elegante
// ============================================
function GlassEffects({
  isNight,
  condition,
  fireGlow = false,
}: {
  isNight: boolean
  condition: WeatherCondition
  fireGlow?: boolean
}) {
  return (
    <>
      {/* Tinte del cristal - muy sutil */}
      <div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background: isNight
            ? 'rgba(8, 12, 25, 0.08)'
            : 'rgba(200, 220, 255, 0.04)',
        }}
      />

      {/* Reflejo principal - estático, esquina superior izquierda (fuente de luz natural) */}
      <div
        className="absolute inset-0 pointer-events-none z-30"
        style={{
          background: `
            radial-gradient(
              ellipse 80% 60% at 15% 20%,
              rgba(255,255,255,${isNight ? 0.02 : 0.06}) 0%,
              rgba(255,255,255,${isNight ? 0.01 : 0.03}) 30%,
              transparent 60%
            )
          `,
        }}
      />

      {/* Reflejo secundario - esquina opuesta más tenue */}
      <div
        className="absolute inset-0 pointer-events-none z-30"
        style={{
          background: `
            radial-gradient(
              ellipse 50% 40% at 85% 75%,
              rgba(255,255,255,${isNight ? 0.008 : 0.025}) 0%,
              transparent 50%
            )
          `,
        }}
      />

      {/* Borde interior del cristal - bisel sutil */}
      <div
        className="absolute inset-0 pointer-events-none z-25 rounded"
        style={{
          boxShadow: `
            inset 0 1px 0 rgba(255,255,255,${isNight ? 0.03 : 0.12}),
            inset 0 -1px 0 rgba(0,0,0,0.08),
            inset 1px 0 0 rgba(255,255,255,${isNight ? 0.02 : 0.06}),
            inset -1px 0 0 rgba(0,0,0,0.04)
          `,
        }}
      />

      {/* Textura de cristal muy sutil - imperfecciones microscópicas */}
      <div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity: 0.015,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Condensación en lluvia/tormenta - gotas en el borde inferior */}
      {(condition === 'rain' || condition === 'storm') && (
        <div className="absolute inset-0 pointer-events-none z-35">
          {/* Vaho en la parte inferior */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '25%',
              background: `linear-gradient(
                180deg,
                transparent 0%,
                rgba(180, 200, 220, 0.04) 50%,
                rgba(180, 200, 220, 0.08) 100%
              )`,
            }}
          />
          {/* Gotitas pequeñas de condensación */}
          <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.4 }}>
            <defs>
              <radialGradient id="droplet" cx="50%" cy="30%" r="50%">
                <stop offset="0%" stopColor="white" stopOpacity="0.6" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </radialGradient>
            </defs>
            {[...Array(12)].map((_, i) => (
              <circle
                key={i}
                cx={`${15 + (i % 4) * 25 + Math.random() * 10}%`}
                cy={`${75 + Math.random() * 20}%`}
                r={1 + Math.random() * 1.5}
                fill="url(#droplet)"
              />
            ))}
          </svg>
        </div>
      )}

      {/* Escarcha en las esquinas (nieve/frío) */}
      {condition === 'snow' && <FrostEffect />}

      {/* Reflejo del fuego de la chimenea (solo de noche) */}
      {fireGlow && isNight && (
        <>
          <motion.div
            className="absolute pointer-events-none z-25"
            style={{
              bottom: '5%',
              right: '5%',
              width: '35%',
              height: '30%',
              background: 'radial-gradient(ellipse at 100% 100%, rgba(255,120,50,0.06) 0%, rgba(255,80,30,0.03) 40%, transparent 70%)',
              filter: 'blur(10px)',
            }}
            animate={{
              opacity: [0.5, 0.8, 0.6, 0.75, 0.5],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </>
      )}
    </>
  )
}

// ============================================
// EFECTO DE ESCARCHA
// ============================================
function FrostEffect() {
  return (
    <div className="absolute inset-0 pointer-events-none z-40">
      {/* Esquinas con escarcha */}
      {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
        <div
          key={i}
          className={`absolute ${pos} w-28 h-28`}
          style={{
            background: `radial-gradient(
              ellipse at ${pos.includes('left') ? '0%' : '100%'} ${pos.includes('top') ? '0%' : '100%'},
              rgba(255,255,255,0.5) 0%,
              rgba(255,255,255,0.2) 30%,
              transparent 60%
            )`,
            filter: 'blur(1px)',
          }}
        />
      ))}

      {/* Cristales de hielo SVG en las esquinas */}
      <svg className="absolute top-0 left-0 w-24 h-24 opacity-40">
        <defs>
          <radialGradient id="frostGrad" cx="0%" cy="0%" r="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.8" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>
        {[...Array(6)].map((_, i) => (
          <line
            key={i}
            x1="0"
            y1="0"
            x2={20 + Math.random() * 30}
            y2={20 + Math.random() * 30}
            stroke="url(#frostGrad)"
            strokeWidth="1"
            opacity={0.3 + Math.random() * 0.4}
          />
        ))}
      </svg>
    </div>
  )
}

// ============================================
// DIVISIONES DE LA VENTANA (Muntins)
// ============================================
function WindowMuntins({ colors, isNight }: { colors: any; isNight: boolean }) {
  const muntinWidth = 14
  const muntinDepth = isNight ? 0.1 : 0.25

  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      {/* División vertical central */}
      <div
        className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2"
        style={{ width: muntinWidth }}
      >
        {/* Cuerpo principal */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(
              90deg,
              ${colors.frame.outer} 0%,
              ${colors.frame.inner} 20%,
              ${colors.frame.accent} 50%,
              ${colors.frame.inner} 80%,
              ${colors.frame.outer} 100%
            )`,
          }}
        />
        {/* Highlight superior */}
        <div
          className="absolute top-0 left-1 right-1 h-full"
          style={{
            background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,${muntinDepth}) 50%, transparent 100%)`,
          }}
        />
        {/* Sombra proyectada */}
        <div
          className="absolute top-0 bottom-0 -right-1 w-2"
          style={{
            background: 'linear-gradient(90deg, rgba(0,0,0,0.15) 0%, transparent 100%)',
          }}
        />
      </div>

      {/* División horizontal central */}
      <div
        className="absolute top-1/2 left-0 right-0 -translate-y-1/2"
        style={{ height: muntinWidth }}
      >
        {/* Cuerpo principal */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(
              180deg,
              ${colors.frame.outer} 0%,
              ${colors.frame.inner} 20%,
              ${colors.frame.accent} 50%,
              ${colors.frame.inner} 80%,
              ${colors.frame.outer} 100%
            )`,
          }}
        />
        {/* Highlight superior */}
        <div
          className="absolute top-1 left-0 right-0 h-1"
          style={{
            background: `linear-gradient(180deg, rgba(255,255,255,${muntinDepth}) 0%, transparent 100%)`,
          }}
        />
        {/* Sombra proyectada */}
        <div
          className="absolute left-0 right-0 -bottom-1 h-2"
          style={{
            background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, transparent 100%)',
          }}
        />
      </div>

      {/* Centro donde se cruzan los muntins */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full z-10"
        style={{
          background: `radial-gradient(
            circle,
            ${colors.frame.accent} 0%,
            ${colors.frame.inner} 60%,
            ${colors.frame.outer} 100%
          )`,
          boxShadow: `
            inset 0 1px 2px rgba(255,255,255,${muntinDepth}),
            0 2px 4px rgba(0,0,0,0.2)
          `,
        }}
      />
    </div>
  )
}

// ============================================
// CORTINAS CON DRAPEADO REAL
// ============================================
function Curtains({
  isNight,
  condition,
  isOpen,
  onToggle,
}: {
  isNight: boolean
  condition: WeatherCondition
  isOpen: boolean
  onToggle: () => void
}) {
  const hasWind = condition === 'storm' && isOpen

  // Colores de las cortinas - Lino nórdico natural (contrasta con madera roja)
  const curtainBase = isNight ? '#2a2525' : '#E8DDD5'
  const curtainShadow = isNight ? '#1a1515' : '#D0C4BC'
  const curtainHighlight = isNight ? '#3a3232' : '#F5EDE5'

  // Número de pliegues - más cuando está cerrada para verse más llena
  const foldCount = isOpen ? 5 : 8

  // Ancho de las cortinas: 12% cuando abiertas, 50% cuando cerradas (cada lado cubre exactamente la mitad)
  const curtainWidth = isOpen ? '12%' : '50%'

  return (
    <>
      {/* CORTINA IZQUIERDA */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 z-40 cursor-pointer overflow-hidden"
        style={{
          marginTop: '-1%',
          marginBottom: '-2%',
        }}
        initial={false}
        animate={{
          width: curtainWidth,
          x: hasWind ? [0, 6, 0, 4, 0] : 0,
        }}
        transition={hasWind
          ? { duration: 3, repeat: Infinity, ease: 'easeInOut' }
          : { duration: 1.2, ease: 'easeInOut' }
        }
        onClick={onToggle}
      >
        {/* Pliegues de la cortina */}
        <div className="relative w-full h-full">
          {[...Array(foldCount)].map((_, i) => {
            const foldWidth = 100 / foldCount
            const isEven = i % 2 === 0
            return (
              <div
                key={i}
                className="absolute top-0 bottom-0"
                style={{
                  left: `${i * foldWidth}%`,
                  width: `${foldWidth + 5}%`,
                  background: `linear-gradient(
                    90deg,
                    ${isEven ? curtainShadow : curtainBase} 0%,
                    ${isEven ? curtainBase : curtainHighlight} 30%,
                    ${isEven ? curtainHighlight : curtainBase} 70%,
                    ${isEven ? curtainBase : curtainShadow} 100%
                  )`,
                  boxShadow: isEven
                    ? `inset -2px 0 4px rgba(0,0,0,0.1)`
                    : `inset 2px 0 4px rgba(0,0,0,0.05)`,
                }}
              />
            )
          })}

          {/* Textura de tela */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  0deg,
                  transparent 0px,
                  transparent 1px,
                  rgba(0,0,0,0.03) 1px,
                  rgba(0,0,0,0.03) 2px
                )
              `,
            }}
          />

          {/* Degradado de transparencia hacia la derecha */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(90deg, transparent 60%, ${isNight ? '#1a1f2e' : '#f5f0e6'}00 100%)`,
            }}
          />

          {/* Sombra en la parte inferior (peso de la tela) */}
          <div
            className="absolute bottom-0 left-0 right-0 h-16"
            style={{
              background: `linear-gradient(0deg, rgba(0,0,0,0.1) 0%, transparent 100%)`,
            }}
          />
        </div>

        {/* Recogido/amarre de la cortina - solo visible cuando está abierta */}
        <motion.div
          className="absolute right-0 top-1/4 w-4 h-20"
          style={{
            background: `linear-gradient(90deg, ${curtainShadow} 0%, ${curtainBase} 50%, ${curtainShadow} 100%)`,
            borderRadius: '0 4px 4px 0',
            boxShadow: '2px 0 4px rgba(0,0,0,0.15)',
          }}
          animate={{ opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : 0.8 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      {/* CORTINA DERECHA (espejo de la izquierda) */}
      <motion.div
        className="absolute right-0 top-0 bottom-0 z-40 cursor-pointer overflow-hidden"
        style={{
          marginTop: '-1%',
          marginBottom: '-2%',
        }}
        initial={false}
        animate={{
          width: curtainWidth,
          x: hasWind ? [0, -5, 0, -3, 0] : 0,
        }}
        transition={hasWind
          ? { duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }
          : { duration: 1.2, ease: 'easeInOut' }
        }
        onClick={onToggle}
      >
        <div className="relative w-full h-full">
          {[...Array(foldCount)].map((_, i) => {
            const foldWidth = 100 / foldCount
            const isEven = i % 2 === 0
            return (
              <div
                key={i}
                className="absolute top-0 bottom-0"
                style={{
                  right: `${i * foldWidth}%`,
                  width: `${foldWidth + 5}%`,
                  background: `linear-gradient(
                    270deg,
                    ${isEven ? curtainShadow : curtainBase} 0%,
                    ${isEven ? curtainBase : curtainHighlight} 30%,
                    ${isEven ? curtainHighlight : curtainBase} 70%,
                    ${isEven ? curtainBase : curtainShadow} 100%
                  )`,
                  boxShadow: isEven
                    ? `inset 2px 0 4px rgba(0,0,0,0.1)`
                    : `inset -2px 0 4px rgba(0,0,0,0.05)`,
                }}
              />
            )
          })}

          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  0deg,
                  transparent 0px,
                  transparent 1px,
                  rgba(0,0,0,0.03) 1px,
                  rgba(0,0,0,0.03) 2px
                )
              `,
            }}
          />

          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(270deg, transparent 60%, ${isNight ? '#1a1f2e' : '#f5f0e6'}00 100%)`,
            }}
          />

          <div
            className="absolute bottom-0 left-0 right-0 h-16"
            style={{
              background: `linear-gradient(0deg, rgba(0,0,0,0.1) 0%, transparent 100%)`,
            }}
          />
        </div>

        {/* Recogido/amarre de la cortina - solo visible cuando está abierta */}
        <motion.div
          className="absolute left-0 top-1/4 w-4 h-20"
          style={{
            background: `linear-gradient(270deg, ${curtainShadow} 0%, ${curtainBase} 50%, ${curtainShadow} 100%)`,
            borderRadius: '4px 0 0 4px',
            boxShadow: '-2px 0 4px rgba(0,0,0,0.15)',
          }}
          animate={{ opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : 0.8 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      {/* BARRA DE CORTINA - Madera roja */}
      <div
        className="absolute -top-3 -left-4 -right-4 h-4 z-50 cursor-pointer"
        onClick={onToggle}
        style={{
          background: `linear-gradient(
            180deg,
            ${isNight ? '#4a2828' : '#B85555'} 0%,
            ${isNight ? '#3d2020' : '#A04545'} 50%,
            ${isNight ? '#2a1515' : '#8B3A3A'} 100%
          )`,
          borderRadius: '3px',
          boxShadow: `
            0 3px 8px rgba(0,0,0,0.3),
            inset 0 1px 0 rgba(255,255,255,${isNight ? 0.1 : 0.2})
          `,
        }}
      >
        {/* Terminales de la barra - latón/bronce */}
        <div
          className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-5 rounded-full"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${isNight ? '#8B7355' : '#D4AF37'}, ${isNight ? '#5a4a3a' : '#AA8C2C'})`,
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}
        />
        <div
          className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-5 rounded-full"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${isNight ? '#8B7355' : '#D4AF37'}, ${isNight ? '#5a4a3a' : '#AA8C2C'})`,
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}
        />

        {/* Anillas de cortina - latón */}
        {/* Anillas izquierdas */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={`left-${i}`}
            className="absolute top-1/2 -translate-y-1/2 w-2.5 h-3 rounded-full border-2"
            style={{
              borderColor: isNight ? '#8B7355' : '#C9A876',
              background: 'transparent',
              left: isOpen ? `${5 + i * 4}%` : `${15 + i * 10}%`,
            }}
            initial={false}
            animate={{
              left: isOpen ? `${5 + i * 4}%` : `${15 + i * 10}%`,
            }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          />
        ))}
        {/* Anillas derechas */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={`right-${i}`}
            className="absolute top-1/2 -translate-y-1/2 w-2.5 h-3 rounded-full border-2"
            style={{
              borderColor: isNight ? '#8B7355' : '#C9A876',
              background: 'transparent',
              right: isOpen ? `${5 + i * 4}%` : `${15 + i * 10}%`,
            }}
            initial={false}
            animate={{
              right: isOpen ? `${5 + i * 4}%` : `${15 + i * 10}%`,
            }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          />
        ))}
      </div>
    </>
  )
}

// ============================================
// ALFÉIZAR CON PERSPECTIVA 3D
// ============================================
function Windowsill({ colors, isNight, condition }: { colors: any; isNight: boolean; condition: WeatherCondition }) {
  return (
    <div
      className="absolute -bottom-7 -left-6 -right-6 z-60"
      style={{ perspective: '500px' }}
    >
      {/* Nieve acumulada en el alféizar - detrás del marco */}
      {condition === 'snow' && (
        <motion.div
          className="absolute left-8 right-8 h-6"
          style={{
            top: '-10px',
            zIndex: -1,
            background: 'linear-gradient(180deg, #ffffff 0%, #f0f0f5 40%, #e0e0e8 100%)',
            borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
            transformOrigin: 'bottom',
            boxShadow: '0 -3px 10px rgba(255,255,255,0.8), inset 0 2px 4px rgba(255,255,255,0.9)',
          }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 3 }}
        />
      )}

      {/* Cara superior del alféizar (con perspectiva) */}
      <div
        className="relative h-8"
        style={{
          background: `linear-gradient(
            180deg,
            ${colors.frame.accent} 0%,
            ${colors.frame.inner} 30%,
            ${colors.frame.middle} 100%
          )`,
          borderRadius: '4px 4px 0 0',
          transform: 'rotateX(-10deg)',
          transformOrigin: 'top center',
          boxShadow: `
            inset 0 2px 4px rgba(255,255,255,${isNight ? 0.1 : 0.3}),
            0 4px 12px rgba(0,0,0,0.25)
          `,
        }}
      >
        {/* Textura de madera */}
        <WoodGrainTexture isNight={isNight} />
      </div>

      {/* Cara frontal del alféizar */}
      <div
        className="h-4"
        style={{
          background: `linear-gradient(
            180deg,
            ${colors.frame.middle} 0%,
            ${colors.frame.outer} 100%
          )`,
          borderRadius: '0 0 6px 6px',
          boxShadow: `
            0 6px 16px rgba(0,0,0,0.3),
            inset 0 1px 0 rgba(0,0,0,0.1)
          `,
        }}
      />

      {/* Decoraciones del alféizar */}
      <WindowsillDecor isNight={isNight} condition={condition} />
    </div>
  )
}

// ============================================
// DECORACIONES DEL ALFÉIZAR
// ============================================
function WindowsillDecor({ isNight, condition }: { isNight: boolean; condition: WeatherCondition }) {
  return (
    <div
      className="absolute -top-6 left-0 right-0 flex items-end justify-between px-8"
      style={{ transform: 'rotateX(-10deg)', transformOrigin: 'top center' }}
    >
    </div>
  )
}

// ============================================
// GRADIENTES DEL CIELO
// ============================================
function getSkyGradient(timeOfDay: TimeOfDay, condition: WeatherCondition): string {
  if (condition === 'storm') {
    return `linear-gradient(
      180deg,
      #0f1218 0%,
      #1a2030 20%,
      #2a3545 40%,
      #3a4555 60%,
      #2a3540 80%,
      #1f2530 100%
    )`
  }

  if (condition === 'rain') {
    const isNight = timeOfDay === 'night' || timeOfDay === 'dusk'
    return isNight
      ? 'linear-gradient(180deg, #0f1419 0%, #1a2530 30%, #2a3545 60%, #3a4555 100%)'
      : 'linear-gradient(180deg, #6a7a8a 0%, #8a9aaa 30%, #a0b0c0 60%, #b0c0d0 100%)'
  }

  if (condition === 'snow') {
    const isNight = timeOfDay === 'night' || timeOfDay === 'dusk'
    return isNight
      ? 'linear-gradient(180deg, #1a1f2e 0%, #2a3345 30%, #3a4555 60%, #4a5565 100%)'
      : 'linear-gradient(180deg, #c8d0d8 0%, #d8e0e8 30%, #e8f0f8 60%, #f0f5fa 100%)'
  }

  if (condition === 'fog') {
    return 'linear-gradient(180deg, #9aa0a8 0%, #b8c0c8 30%, #d0d8e0 60%, #e0e8f0 100%)'
  }

  if (condition === 'cloudy') {
    const isNight = timeOfDay === 'night' || timeOfDay === 'dusk'
    return isNight
      ? 'linear-gradient(180deg, #1a1f28 0%, #2a3040 30%, #3a4555 60%, #4a5565 100%)'
      : 'linear-gradient(180deg, #8a9aaa 0%, #a0b0c0 30%, #b8c8d8 60%, #c8d8e8 100%)'
  }

  // Clear sky
  switch (timeOfDay) {
    case 'dawn':
      return `linear-gradient(
        180deg,
        #1a1f30 0%,
        #3a3050 15%,
        #6a4060 25%,
        #c06050 40%,
        #e8a060 55%,
        #f0c080 70%,
        #a0c0d0 85%,
        #80b0d0 100%
      )`
    case 'day':
      return `linear-gradient(
        180deg,
        #3080c0 0%,
        #50a0d8 25%,
        #70b8e8 50%,
        #90d0f0 75%,
        #b0e0f8 100%
      )`
    case 'dusk':
      return `linear-gradient(
        180deg,
        #1a1520 0%,
        #302040 15%,
        #504060 25%,
        #806070 40%,
        #c08060 55%,
        #e0a060 65%,
        #c08070 80%,
        #604060 90%,
        #302040 100%
      )`
    case 'night':
    default:
      return `linear-gradient(
        180deg,
        #080810 0%,
        #101020 20%,
        #181830 40%,
        #202040 60%,
        #282850 80%,
        #1a1a30 100%
      )`
  }
}

export const NordicWindow = memo(NordicWindowComponent)

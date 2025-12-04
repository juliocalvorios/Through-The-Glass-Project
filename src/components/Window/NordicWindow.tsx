'use client'

import { memo, ReactNode, useRef, useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { TimeOfDay, WeatherCondition } from '@/types'

interface NordicWindowProps {
  children: ReactNode
  timeOfDay: TimeOfDay
  condition: WeatherCondition
}

function NordicWindowComponent({ children, timeOfDay, condition }: NordicWindowProps) {
  const isNight = timeOfDay === 'night' || timeOfDay === 'dusk'
  const windowRef = useRef<HTMLDivElement>(null)

  // Para el reflejo que sigue al cursor
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!windowRef.current) return
      const rect = windowRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      mouseX.set(Math.max(0, Math.min(1, x)))
      mouseY.set(Math.max(0, Math.min(1, y)))
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  // Paleta de colores según hora
  const colors = {
    frame: {
      outer: isNight ? '#1a1612' : '#8B7355',
      middle: isNight ? '#2a2420' : '#A0896C',
      inner: isNight ? '#3d342c' : '#C4A882',
      accent: isNight ? '#4a3f35' : '#D4BC98',
      highlight: isNight ? '#5a4d42' : '#E8D4B8',
    },
    glass: {
      tint: isNight ? 'rgba(10, 15, 30, 0.3)' : 'rgba(200, 220, 255, 0.1)',
    }
  }

  return (
    <motion.div
      ref={windowRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
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
                springX={springX}
                springY={springY}
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
      <Curtains isNight={isNight} condition={condition} />

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
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
      {/* Vetas principales */}
      <svg className="absolute inset-0 w-full h-full opacity-20" preserveAspectRatio="none">
        <defs>
          <pattern id="woodGrain" patternUnits="userSpaceOnUse" width="200" height="8">
            <path
              d="M0,4 Q50,2 100,4 T200,4"
              stroke={isNight ? '#000' : '#5a3d2b'}
              strokeWidth="0.5"
              fill="none"
              opacity="0.5"
            />
            <path
              d="M0,6 Q50,8 100,6 T200,6"
              stroke={isNight ? '#000' : '#5a3d2b'}
              strokeWidth="0.3"
              fill="none"
              opacity="0.3"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#woodGrain)" />
      </svg>

      {/* Nudos de madera ocasionales */}
      <div
        className="absolute w-6 h-4 rounded-full opacity-10"
        style={{
          top: '20%',
          left: '15%',
          background: `radial-gradient(ellipse, ${isNight ? '#000' : '#4a2c17'} 0%, transparent 70%)`,
        }}
      />
      <div
        className="absolute w-4 h-3 rounded-full opacity-10"
        style={{
          bottom: '30%',
          right: '20%',
          background: `radial-gradient(ellipse, ${isNight ? '#000' : '#4a2c17'} 0%, transparent 70%)`,
        }}
      />
    </div>
  )
}

// ============================================
// EFECTOS DEL CRISTAL
// ============================================
function GlassEffects({
  isNight,
  condition,
  springX,
  springY,
}: {
  isNight: boolean
  condition: WeatherCondition
  springX: any
  springY: any
}) {
  return (
    <>
      {/* Tinte del cristal */}
      <div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background: isNight
            ? 'rgba(10, 15, 35, 0.15)'
            : 'rgba(220, 235, 255, 0.08)',
          mixBlendMode: 'multiply',
        }}
      />

      {/* Reflejo principal que sigue al cursor */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-30"
        style={{
          background: `radial-gradient(
            ellipse 60% 50% at calc(${springX.get() * 100}% + 0%) calc(${springY.get() * 100}% + 0%),
            rgba(255,255,255,${isNight ? 0.03 : 0.12}) 0%,
            transparent 50%
          )`,
        }}
      />

      {/* Reflejo de esquina superior izquierda (luz de ventana) */}
      <div
        className="absolute top-0 left-0 w-1/2 h-1/2 pointer-events-none z-30"
        style={{
          background: `linear-gradient(
            135deg,
            rgba(255,255,255,${isNight ? 0.02 : 0.15}) 0%,
            rgba(255,255,255,${isNight ? 0.01 : 0.05}) 30%,
            transparent 60%
          )`,
        }}
      />

      {/* Reflejo lineal diagonal */}
      <div
        className="absolute inset-0 pointer-events-none z-30"
        style={{
          background: `linear-gradient(
            125deg,
            transparent 0%,
            transparent 40%,
            rgba(255,255,255,${isNight ? 0.015 : 0.06}) 45%,
            rgba(255,255,255,${isNight ? 0.02 : 0.08}) 50%,
            rgba(255,255,255,${isNight ? 0.015 : 0.06}) 55%,
            transparent 60%,
            transparent 100%
          )`,
        }}
      />

      {/* Borde del cristal - bisel interior */}
      <div
        className="absolute inset-0 pointer-events-none z-25 rounded"
        style={{
          boxShadow: `
            inset 0 1px 0 rgba(255,255,255,${isNight ? 0.05 : 0.2}),
            inset 0 -1px 0 rgba(0,0,0,0.1),
            inset 1px 0 0 rgba(255,255,255,${isNight ? 0.03 : 0.1}),
            inset -1px 0 0 rgba(0,0,0,0.05)
          `,
        }}
      />

      {/* Imperfecciones sutiles del cristal */}
      <div
        className="absolute inset-0 pointer-events-none z-20 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity: 0.02,
        }}
      />

      {/* Condensación según el clima */}
      {(condition === 'rain' || condition === 'storm') && (
        <div
          className="absolute inset-0 pointer-events-none z-35"
          style={{
            background: `linear-gradient(
              180deg,
              transparent 0%,
              transparent 60%,
              rgba(180, 200, 220, 0.08) 80%,
              rgba(180, 200, 220, 0.12) 100%
            )`,
          }}
        />
      )}

      {/* Escarcha en las esquinas (nieve/frío) */}
      {condition === 'snow' && <FrostEffect />}
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
    <div className="absolute inset-0 pointer-events-none z-50">
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
function Curtains({ isNight, condition }: { isNight: boolean; condition: WeatherCondition }) {
  const hasWind = condition === 'storm'

  // Colores de las cortinas
  const curtainBase = isNight ? '#3a3632' : '#E8E0D4'
  const curtainShadow = isNight ? '#252320' : '#C8C0B4'
  const curtainHighlight = isNight ? '#4a4540' : '#F5EDE1'

  // Número de pliegues
  const foldCount = 5

  return (
    <>
      {/* CORTINA IZQUIERDA */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 z-40 pointer-events-none"
        style={{
          width: '12%',
          marginTop: '-1%',
          marginBottom: '8%',
        }}
        animate={hasWind ? { x: [0, 6, 0, 4, 0] } : {}}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
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

        {/* Recogido/amarre de la cortina */}
        <div
          className="absolute right-0 top-1/4 w-4 h-20"
          style={{
            background: `linear-gradient(90deg, ${curtainShadow} 0%, ${curtainBase} 50%, ${curtainShadow} 100%)`,
            borderRadius: '0 4px 4px 0',
            boxShadow: '2px 0 4px rgba(0,0,0,0.15)',
          }}
        />
      </motion.div>

      {/* CORTINA DERECHA (espejo de la izquierda) */}
      <motion.div
        className="absolute right-0 top-0 bottom-0 z-40 pointer-events-none"
        style={{
          width: '12%',
          marginTop: '-1%',
          marginBottom: '8%',
        }}
        animate={hasWind ? { x: [0, -5, 0, -3, 0] } : {}}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
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

        <div
          className="absolute left-0 top-1/4 w-4 h-20"
          style={{
            background: `linear-gradient(270deg, ${curtainShadow} 0%, ${curtainBase} 50%, ${curtainShadow} 100%)`,
            borderRadius: '4px 0 0 4px',
            boxShadow: '-2px 0 4px rgba(0,0,0,0.15)',
          }}
        />
      </motion.div>

      {/* BARRA DE CORTINA */}
      <div
        className="absolute -top-3 -left-4 -right-4 h-4 z-50"
        style={{
          background: `linear-gradient(
            180deg,
            ${isNight ? '#5a4d42' : '#C9B896'} 0%,
            ${isNight ? '#4a3f32' : '#A89880'} 50%,
            ${isNight ? '#3d3529' : '#8B7355'} 100%
          )`,
          borderRadius: '3px',
          boxShadow: `
            0 3px 8px rgba(0,0,0,0.3),
            inset 0 1px 0 rgba(255,255,255,${isNight ? 0.1 : 0.3})
          `,
        }}
      >
        {/* Terminales de la barra */}
        <div
          className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-5 rounded-full"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${isNight ? '#6a5d52' : '#D4C4A8'}, ${isNight ? '#4a3f32' : '#A89880'})`,
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}
        />
        <div
          className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-5 rounded-full"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${isNight ? '#6a5d52' : '#D4C4A8'}, ${isNight ? '#4a3f32' : '#A89880'})`,
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}
        />

        {/* Anillas de cortina */}
        {[15, 25, 75, 85].map((pos, i) => (
          <div
            key={i}
            className="absolute top-1/2 -translate-y-1/2 w-2.5 h-3 rounded-full border-2"
            style={{
              left: `${pos}%`,
              borderColor: isNight ? '#6a5d52' : '#B8A882',
              background: 'transparent',
            }}
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

        {/* Nieve acumulada en el alféizar */}
        {condition === 'snow' && (
          <motion.div
            className="absolute -top-2 left-2 right-2 h-4"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 3 }}
            style={{
              background: 'linear-gradient(180deg, #fff 0%, #e8e8f0 50%, #d0d0e0 100%)',
              borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
              transformOrigin: 'bottom',
              boxShadow: '0 -2px 8px rgba(255,255,255,0.5)',
            }}
          />
        )}
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
      {/* VELA */}
      <div className="relative">
        {/* Platito de la vela */}
        <div
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-2 rounded-full"
          style={{
            background: isNight
              ? 'linear-gradient(180deg, #4a4540 0%, #3a3530 100%)'
              : 'linear-gradient(180deg, #d4c4a8 0%, #c4b498 100%)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
        />

        {/* Cuerpo de la vela */}
        <div
          className="relative w-5 h-10 rounded-sm mx-auto"
          style={{
            background: isNight
              ? 'linear-gradient(180deg, #f5f0e6 0%, #e8e0d4 50%, #ddd5c8 100%)'
              : 'linear-gradient(180deg, #fffef8 0%, #f5f0e6 50%, #ebe3d6 100%)',
            boxShadow: isNight
              ? '0 0 20px rgba(255,180,100,0.3), inset -2px 0 4px rgba(0,0,0,0.1)'
              : 'inset -2px 0 4px rgba(0,0,0,0.1)',
          }}
        >
          {/* Cera derretida */}
          <div
            className="absolute top-0 left-0 right-0 h-3"
            style={{
              background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, transparent 100%)',
              borderRadius: '2px 2px 0 0',
            }}
          />
        </div>

        {/* Mecha */}
        <div
          className="absolute -top-2 left-1/2 -translate-x-1/2 w-0.5 h-3"
          style={{
            backgroundColor: '#2a2420',
            borderRadius: '1px',
          }}
        />

        {/* Llama (solo de noche) */}
        {isNight && (
          <motion.div
            className="absolute -top-8 left-1/2 -translate-x-1/2"
            animate={{
              scale: [1, 1.05, 0.95, 1.02, 1],
              rotate: [-1, 1, -0.5, 0.5, 0],
            }}
            transition={{ duration: 0.4, repeat: Infinity }}
          >
            {/* Llama exterior */}
            <div
              className="w-4 h-7 rounded-full"
              style={{
                background: `radial-gradient(
                  ellipse 50% 80% at 50% 90%,
                  #fff 0%,
                  #ffdd44 20%,
                  #ff9500 50%,
                  #ff5500 70%,
                  transparent 100%
                )`,
                filter: 'blur(0.5px)',
              }}
            />
            {/* Núcleo de la llama */}
            <div
              className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-4 rounded-full"
              style={{
                background: 'linear-gradient(0deg, #4af 0%, #fff 50%, transparent 100%)',
                filter: 'blur(0.5px)',
              }}
            />
            {/* Glow */}
            <div
              className="absolute -inset-4"
              style={{
                background: 'radial-gradient(circle, rgba(255,180,80,0.4) 0%, transparent 70%)',
                filter: 'blur(8px)',
              }}
            />
          </motion.div>
        )}
      </div>

      {/* PLANTA SUCULENTA */}
      <div className="relative">
        {/* Maceta */}
        <div
          className="relative w-10 h-8"
          style={{
            background: isNight
              ? 'linear-gradient(180deg, #6b5d4d 0%, #4a3f32 100%)'
              : 'linear-gradient(180deg, #c9a876 0%, #a08060 100%)',
            borderRadius: '2px 2px 4px 4px',
            clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          }}
        >
          {/* Borde de la maceta */}
          <div
            className="absolute -top-1 -left-0.5 -right-0.5 h-2 rounded-sm"
            style={{
              background: isNight
                ? 'linear-gradient(180deg, #7a6d5d 0%, #5a4d3d 100%)'
                : 'linear-gradient(180deg, #d4b896 0%, #b49876 100%)',
            }}
          />
        </div>

        {/* Tierra */}
        <div
          className="absolute top-0 left-1 right-1 h-2 rounded-t-sm"
          style={{
            backgroundColor: '#3d2817',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)',
          }}
        />

        {/* Hojas de la suculenta */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2">
          {[
            { angle: -40, height: 14, delay: 0 },
            { angle: -20, height: 16, delay: 0.1 },
            { angle: 0, height: 18, delay: 0.2 },
            { angle: 20, height: 16, delay: 0.1 },
            { angle: 40, height: 14, delay: 0 },
          ].map((leaf, i) => (
            <motion.div
              key={i}
              className="absolute bottom-0 left-1/2 origin-bottom"
              style={{
                width: '6px',
                height: leaf.height,
                background: `linear-gradient(
                  0deg,
                  ${isNight ? '#3a5030' : '#5c6b54'} 0%,
                  ${isNight ? '#4a6040' : '#6b7a64'} 50%,
                  ${isNight ? '#5a7050' : '#7a8a74'} 100%
                )`,
                borderRadius: '50% 50% 20% 20%',
                transform: `translateX(-50%) rotate(${leaf.angle}deg)`,
                boxShadow: 'inset 1px 0 2px rgba(255,255,255,0.2)',
              }}
              animate={{
                rotate: [leaf.angle, leaf.angle + 2, leaf.angle],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: leaf.delay,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* Nieve en la planta */}
        {condition === 'snow' && (
          <div
            className="absolute -top-7 left-1/2 -translate-x-1/2 w-6 h-3"
            style={{
              background: 'radial-gradient(ellipse at bottom, white 0%, transparent 80%)',
              filter: 'blur(1px)',
            }}
          />
        )}
      </div>
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

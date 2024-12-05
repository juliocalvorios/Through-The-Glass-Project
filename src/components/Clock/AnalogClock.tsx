'use client'

import { useEffect, useState, memo } from 'react'
import { motion } from 'framer-motion'
import { WeatherData, TimeOfDay, WeatherCondition } from '@/types'

interface AnalogClockProps {
  weather?: WeatherData
  timeOfDay: TimeOfDay
  condition?: WeatherCondition
  onHoverStart?: () => void
  onHoverEnd?: () => void
}

function AnalogClockComponent({ weather, timeOfDay, condition, onHoverStart, onHoverEnd }: AnalogClockProps) {
  const [time, setTime] = useState(new Date())
  const [isHoveringClock, setIsHoveringClock] = useState(false)
  const [isHoveringFolio, setIsHoveringFolio] = useState(false)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; size: number; duration: number }>>([])
  const isNight = timeOfDay === 'night' || timeOfDay === 'dusk'

  // Usar condition override o el del weather
  const currentCondition = condition || weather?.condition || 'clear'

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  // Generar partículas solo para nieve/lluvia/tormenta
  const hasParticles = currentCondition === 'snow' || currentCondition === 'rain' || currentCondition === 'storm'

  useEffect(() => {
    if (isHoveringFolio && hasParticles) {
      const interval = setInterval(() => {
        setParticles(prev => {
          const newParticle = {
            id: Date.now() + Math.random(),
            x: Math.random() * 50 - 25,
            size: 2 + Math.random() * 3,
            duration: 1 + Math.random() * 0.5
          }
          return [...prev.slice(-6), newParticle]
        })
      }, 250)
      return () => clearInterval(interval)
    } else {
      setParticles([])
    }
  }, [isHoveringFolio, hasParticles])

  const seconds = time.getSeconds()
  const minutes = time.getMinutes()
  const hours = time.getHours() % 12

  // Ángulos de las agujas - cuando hay hover, giran rápido
  const secondDeg = isHoveringClock ? seconds * 6 + 720 : seconds * 6
  const minuteDeg = isHoveringClock ? minutes * 6 + seconds * 0.1 + 360 : minutes * 6 + seconds * 0.1
  const hourDeg = isHoveringClock ? hours * 30 + minutes * 0.5 + 180 : hours * 30 + minutes * 0.5

  // Colores SCANDINAVIAN WINTER CABIN - Madera roja noruega
  const colors = {
    wood: {
      // Madera roja escandinava (igual que la ventana)
      light: isNight ? '#3d2020' : '#A04545',
      medium: isNight ? '#2a1515' : '#8B3A3A',
      dark: isNight ? '#1a0f0f' : '#6B2D2D',
      accent: isNight ? '#4a2828' : '#B85555',
      highlight: isNight ? '#5a3535' : '#C96666',
    },
    metal: {
      // Latón/bronce antiguo (contrasta con rojo)
      gold: isNight ? '#8B7355' : '#D4AF37',
      goldLight: isNight ? '#A08060' : '#F4CF67',
      goldDark: isNight ? '#5a4a3a' : '#AA8C2C',
      bronze: isNight ? '#6B5344' : '#CD7F32',
    },
    face: {
      // Cara del reloj - crema cálido vintage
      bg: isNight ? '#1a1815' : '#FDF8F0',
      text: isNight ? '#C4A882' : '#4A2020',  // Texto más rojizo
      accent: isNight ? '#8B5555' : '#6B2D2D', // Acento rojo oscuro
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center gap-5"
    >
      {/* ============================================
          RELOJ PRINCIPAL
          ============================================ */}
      <div
        className="relative cursor-pointer"
        style={{
          width: '160px',
          height: '160px',
        }}
        onMouseEnter={() => {
          setIsHoveringClock(true)
          onHoverStart?.()
        }}
        onMouseLeave={() => {
          setIsHoveringClock(false)
          onHoverEnd?.()
        }}
      >
        {/* ============================================
            SOMBRA EXTERIOR
            ============================================ */}
        <div
          className="absolute -inset-2 rounded-full"
          style={{
            boxShadow: isNight
              ? `
                0 10px 40px rgba(0,0,0,0.6),
                0 5px 15px rgba(0,0,0,0.4)
              `
              : `
                0 10px 40px rgba(0,0,0,0.2),
                0 5px 15px rgba(0,0,0,0.15)
              `,
          }}
        />

        {/* ============================================
            CAPA 1: MARCO EXTERIOR DE MADERA
            ============================================ */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `
              radial-gradient(
                ellipse at 30% 20%,
                ${colors.wood.accent} 0%,
                ${colors.wood.light} 30%,
                ${colors.wood.medium} 60%,
                ${colors.wood.dark} 100%
              )
            `,
            padding: '8px',
          }}
        >
          {/* Textura de madera roja en el marco */}
          <svg className="absolute inset-0 w-full h-full rounded-full opacity-20 overflow-hidden">
            <defs>
              <pattern id="clockWoodGrainRed" patternUnits="userSpaceOnUse" width="50" height="6">
                <path
                  d="M0,2 Q12,1 25,2 T50,2"
                  stroke={isNight ? '#0a0505' : '#3d1515'}
                  strokeWidth="0.6"
                  fill="none"
                  opacity="0.7"
                />
                <path
                  d="M0,4.5 Q15,4 30,4.5 T50,4.5"
                  stroke={isNight ? '#0a0505' : '#3d1515'}
                  strokeWidth="0.3"
                  fill="none"
                  opacity="0.4"
                />
              </pattern>
            </defs>
            <circle cx="50%" cy="50%" r="48%" fill="url(#clockWoodGrainRed)" />
          </svg>

          {/* Bisel superior (luz) */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `linear-gradient(
                160deg,
                rgba(255,255,255,${isNight ? 0.08 : 0.25}) 0%,
                transparent 40%,
                transparent 60%,
                rgba(0,0,0,0.2) 100%
              )`,
            }}
          />

          {/* ============================================
              CAPA 2: ARO METÁLICO DORADO/BRONCE
              ============================================ */}
          <div
            className="relative w-full h-full rounded-full"
            style={{
              background: `
                linear-gradient(
                  145deg,
                  ${colors.metal.goldLight} 0%,
                  ${colors.metal.gold} 25%,
                  ${colors.metal.goldDark} 50%,
                  ${colors.metal.gold} 75%,
                  ${colors.metal.goldLight} 100%
                )
              `,
              padding: '4px',
              boxShadow: `
                inset 0 2px 4px rgba(255,255,255,${isNight ? 0.1 : 0.4}),
                inset 0 -2px 4px rgba(0,0,0,0.3)
              `,
            }}
          >
            {/* Detalle del bisel metálico - muescas decorativas */}
            <div className="absolute inset-1 rounded-full overflow-hidden">
              {[...Array(60)].map((_, i) => {
                const angle = (i * 6 - 90) * (Math.PI / 180)
                const isHourMark = i % 5 === 0
                if (!isHourMark) return null

                return (
                  <div
                    key={i}
                    className="absolute"
                    style={{
                      width: '2px',
                      height: '6px',
                      background: colors.metal.goldDark,
                      left: '50%',
                      top: '2px',
                      transformOrigin: '50% 76px',
                      transform: `translateX(-50%) rotate(${i * 6}deg)`,
                    }}
                  />
                )
              })}
            </div>

            {/* ============================================
                CAPA 3: CARA DEL RELOJ
                ============================================ */}
            <div
              className="relative w-full h-full rounded-full overflow-hidden"
              style={{
                background: `
                  radial-gradient(
                    circle at 40% 35%,
                    ${isNight ? '#252220' : '#FFFEF8'} 0%,
                    ${colors.face.bg} 50%,
                    ${isNight ? '#151310' : '#F0E8D8'} 100%
                  )
                `,
                boxShadow: `
                  inset 0 3px 10px rgba(0,0,0,${isNight ? 0.5 : 0.15}),
                  inset 0 -2px 6px rgba(255,255,255,${isNight ? 0.05 : 0.3})
                `,
              }}
            >
              {/* Textura sutil del papel/esmalte */}
              <div
                className="absolute inset-0 rounded-full opacity-30"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                  opacity: isNight ? 0.05 : 0.03,
                }}
              />

              {/* ============================================
                  NÚMEROS ROMANOS
                  ============================================ */}
              <ClockNumbers colors={colors} isNight={isNight} />

              {/* ============================================
                  MARCADORES DE MINUTOS
                  ============================================ */}
              <MinuteMarkers colors={colors} isNight={isNight} />

              {/* ============================================
                  MARCA/LOGO VINTAGE
                  ============================================ */}
              <div
                className="absolute left-1/2 -translate-x-1/2"
                style={{ top: '62%' }}
              >
                <span
                  className="text-[6px] tracking-widest uppercase"
                  style={{
                    color: colors.face.accent,
                    fontFamily: 'Georgia, serif',
                    opacity: 0.6,
                  }}
                >
                  Nordic
                </span>
              </div>

              {/* ============================================
                  AGUJAS
                  ============================================ */}

              {/* Sombra de las agujas */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  filter: 'blur(2px)',
                  opacity: 0.3,
                }}
              >
                <HourHand angle={hourDeg} colors={colors} isShadow />
                <MinuteHand angle={minuteDeg} colors={colors} isShadow />
              </div>

              {/* Aguja de hora */}
              <HourHand angle={hourDeg} colors={colors} />

              {/* Aguja de minuto */}
              <MinuteHand angle={minuteDeg} colors={colors} />

              {/* Aguja de segundo */}
              <SecondHand angle={secondDeg} colors={colors} isNight={isNight} />

              {/* Centro del reloj (eje de las agujas) */}
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full z-30"
                style={{
                  width: '14px',
                  height: '14px',
                  background: `
                    radial-gradient(
                      circle at 35% 35%,
                      ${colors.metal.goldLight} 0%,
                      ${colors.metal.gold} 40%,
                      ${colors.metal.goldDark} 100%
                    )
                  `,
                  boxShadow: `
                    0 2px 4px rgba(0,0,0,0.4),
                    inset 0 1px 2px rgba(255,255,255,0.4)
                  `,
                }}
              >
                {/* Punto central */}
                <div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
                  style={{
                    background: colors.metal.goldDark,
                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)',
                  }}
                />
              </div>

              {/* ============================================
                  CRISTAL SOBRE LA CARA
                  ============================================ */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background: `
                    linear-gradient(
                      135deg,
                      rgba(255,255,255,${isNight ? 0.03 : 0.12}) 0%,
                      transparent 40%,
                      transparent 60%,
                      rgba(255,255,255,${isNight ? 0.01 : 0.05}) 100%
                    )
                  `,
                }}
              />

              {/* Reflejo del cristal */}
              <div
                className="absolute rounded-full pointer-events-none"
                style={{
                  top: '8%',
                  left: '15%',
                  width: '35%',
                  height: '25%',
                  background: `
                    radial-gradient(
                      ellipse at 50% 50%,
                      rgba(255,255,255,${isNight ? 0.04 : 0.15}) 0%,
                      transparent 70%
                    )
                  `,
                  transform: 'rotate(-20deg)',
                }}
              />

              {/* Borde del cristal */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  boxShadow: `
                    inset 0 1px 0 rgba(255,255,255,${isNight ? 0.1 : 0.3}),
                    inset 0 -1px 0 rgba(0,0,0,0.1)
                  `,
                }}
              />
            </div>
          </div>
        </div>

        {/* ============================================
            GANCHO PARA COLGAR
            ============================================ */}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{ top: '-12px' }}
        >
          {/* Aro del gancho */}
          <div
            className="relative w-6 h-4"
            style={{
              borderRadius: '50% 50% 0 0',
              border: `3px solid ${colors.metal.gold}`,
              borderBottom: 'none',
              boxShadow: `
                0 -2px 4px rgba(0,0,0,0.2),
                inset 0 2px 2px rgba(255,255,255,${isNight ? 0.1 : 0.3})
              `,
            }}
          />
          {/* Base del gancho */}
          <div
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-2 rounded-b-full"
            style={{
              background: `linear-gradient(180deg, ${colors.wood.light} 0%, ${colors.wood.medium} 100%)`,
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
          />
        </div>
      </div>

      {/* ============================================
          TEMPERATURA Y UBICACIÓN - FOLIO CON CHINCHETA
          ============================================ */}
      {weather && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="relative mt-3 cursor-pointer"
          style={{ transformOrigin: 'top center' }}
          onMouseEnter={() => setIsHoveringFolio(true)}
          onMouseLeave={() => setIsHoveringFolio(false)}
          whileHover={{
            rotate: [0, -2, 2, -1, 1, 0],
            transition: { duration: 1.2, ease: 'easeInOut', repeat: Infinity }
          }}
        >
          {/* Partículas nieve/lluvia */}
          {particles.map((particle) => {
            const isSnow = currentCondition === 'snow'
            const isRain = currentCondition === 'rain' || currentCondition === 'storm'

            return (
              <motion.div
                key={particle.id}
                className="absolute pointer-events-none"
                style={{
                  left: `calc(50% + ${particle.x}px)`,
                  bottom: 0,
                  width: isRain ? 2 : particle.size,
                  height: isRain ? particle.size * 3 : particle.size,
                  background: isSnow
                    ? 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.4) 100%)'
                    : 'linear-gradient(180deg, rgba(150,200,255,0.8) 0%, rgba(100,150,220,0.4) 100%)',
                  boxShadow: isSnow
                    ? '0 0 4px rgba(255,255,255,0.5)'
                    : '0 0 3px rgba(100,150,220,0.4)',
                  borderRadius: isRain ? '0 0 50% 50%' : '50%',
                }}
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: [0, 1, 1, 0], y: 50 }}
                transition={{ duration: particle.duration, ease: 'easeOut' }}
              />
            )
          })}

          {/* Efecto niebla para fog/cloudy */}
          {isHoveringFolio && (currentCondition === 'fog' || currentCondition === 'cloudy') && (
            <motion.div
              className="absolute inset-0 pointer-events-none rounded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                background: 'radial-gradient(ellipse at center, rgba(200,200,210,0.4) 0%, transparent 70%)',
                filter: 'blur(8px)',
              }}
            />
          )}

          {/* Rayos de sol para clear */}
          {isHoveringFolio && currentCondition === 'clear' && (
            <motion.div
              className="absolute pointer-events-none"
              style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, rotate: 360 }}
              transition={{ opacity: { duration: 0.3 }, scale: { duration: 0.3 }, rotate: { duration: 20, repeat: Infinity, ease: 'linear' } }}
            >
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    width: '2px',
                    height: '25px',
                    background: 'linear-gradient(180deg, rgba(255,220,150,0.8) 0%, transparent 100%)',
                    left: '50%',
                    top: '50%',
                    transformOrigin: 'center top',
                    transform: `translateX(-50%) rotate(${i * 45}deg) translateY(-20px)`,
                  }}
                />
              ))}
            </motion.div>
          )}

          {/* Folio/papel - estilo Scandinavian Winter Cabin */}
          <div
            className="relative px-5 py-4 text-center"
            style={{
              background: isNight
                ? 'linear-gradient(180deg, #1a1815 0%, #151210 100%)'
                : 'linear-gradient(180deg, #FDF8F0 0%, #F5EDE0 100%)',
              boxShadow: isNight
                ? '2px 3px 10px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)'
                : '2px 3px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.5)',
              border: `1px solid ${isNight ? '#2a1515' : '#D4C4B0'}`,
              transform: 'rotate(-1deg)',
            }}
          >
            {/* Temperatura */}
            <div
              className="text-2xl font-light tracking-wide"
              style={{
                color: isNight ? '#C4A882' : '#4A2020',
                fontFamily: 'Georgia, serif',
              }}
            >
              {weather.temperature}°
            </div>

            {/* Ubicación */}
            {weather.location?.city && (
              <div
                className="text-[9px] uppercase tracking-[0.15em] mt-1"
                style={{
                  color: isNight ? '#8B7355' : '#6B2D2D',
                }}
              >
                {weather.location.city}
              </div>
            )}
          </div>

          {/* Chincheta - latón/bronce estilo cabin */}
          <div
            className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full"
            style={{
              background: isNight
                ? 'radial-gradient(circle at 35% 35%, #A08060 0%, #6B5344 70%, #4a3a2a 100%)'
                : 'radial-gradient(circle at 35% 35%, #F4CF67 0%, #D4AF37 70%, #AA8C2C 100%)',
              boxShadow: '0 2px 3px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.3)',
            }}
          />
        </motion.div>
      )}
    </motion.div>
  )
}

// ============================================
// NÚMEROS ROMANOS
// ============================================
function ClockNumbers({ colors, isNight }: { colors: any; isNight: boolean }) {
  const numbers = [
    { num: 'XII', angle: 0 },
    { num: 'I', angle: 30 },
    { num: 'II', angle: 60 },
    { num: 'III', angle: 90 },
    { num: 'IV', angle: 120 },
    { num: 'V', angle: 150 },
    { num: 'VI', angle: 180 },
    { num: 'VII', angle: 210 },
    { num: 'VIII', angle: 240 },
    { num: 'IX', angle: 270 },
    { num: 'X', angle: 300 },
    { num: 'XI', angle: 330 },
  ]

  const radius = 48 // Distancia desde el centro

  return (
    <>
      {numbers.map(({ num, angle }) => {
        const angleRad = (angle - 90) * (Math.PI / 180)
        const x = Math.cos(angleRad) * radius
        const y = Math.sin(angleRad) * radius

        return (
          <div
            key={num}
            className="absolute"
            style={{
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <span
              style={{
                fontSize: num === 'XII' || num === 'VI' ? '11px' : '9px',
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontWeight: num === 'XII' ? 600 : 400,
                color: colors.face.text,
                textShadow: isNight ? '0 0 8px rgba(196,168,130,0.2)' : 'none',
              }}
            >
              {num}
            </span>
          </div>
        )
      })}
    </>
  )
}

// ============================================
// MARCADORES DE MINUTOS
// ============================================
function MinuteMarkers({ colors, isNight }: { colors: any; isNight: boolean }) {
  return (
    <>
      {[...Array(60)].map((_, i) => {
        const isHourMark = i % 5 === 0
        if (isHourMark) return null // Los de hora ya tienen números

        const angle = (i * 6 - 90) * (Math.PI / 180)
        const outerRadius = 58
        const innerRadius = 54
        const x1 = Math.cos(angle) * outerRadius
        const y1 = Math.sin(angle) * outerRadius
        const x2 = Math.cos(angle) * innerRadius
        const y2 = Math.sin(angle) * innerRadius

        return (
          <div
            key={i}
            className="absolute"
            style={{
              left: '50%',
              top: '50%',
              width: '1px',
              height: '4px',
              background: colors.face.accent,
              opacity: 0.3,
              transformOrigin: 'center -54px',
              transform: `translate(-50%, -58px) rotate(${i * 6}deg)`,
            }}
          />
        )
      })}
    </>
  )
}

// ============================================
// AGUJA DE HORA (estilo spade/flecha)
// ============================================
function HourHand({ angle, colors, isShadow = false }: { angle: number; colors: any; isShadow?: boolean }) {
  const handLength = 32
  const tailLength = 8
  const totalHeight = handLength + tailLength

  return (
    <motion.div
      className="absolute z-20"
      style={{
        left: '50%',
        top: '50%',
        width: '8px',
        height: `${totalHeight}px`,
        marginLeft: '-4px',
        marginTop: `-${handLength}px`,
        transformOrigin: `center ${handLength}px`,
        transform: isShadow ? 'translate(2px, 2px)' : undefined,
      }}
      animate={{ rotate: angle }}
      transition={{ type: 'spring', stiffness: 50, damping: 12 }}
    >
      {/* Forma de flecha/spade */}
      <svg
        width="8"
        height={totalHeight}
        viewBox={`0 0 8 ${totalHeight}`}
        fill="none"
        style={{ filter: isShadow ? 'blur(1px)' : 'none' }}
      >
        {/* Punta y cuerpo principal */}
        <path
          d={`M4 0 L7 10 L5.5 10 L5.5 ${handLength} L2.5 ${handLength} L2.5 10 L1 10 Z`}
          fill={isShadow ? 'rgba(0,0,0,0.4)' : colors.face.text}
        />
        {/* Cola de contrapeso */}
        <rect
          x="3"
          y={handLength}
          width="2"
          height={tailLength}
          fill={isShadow ? 'rgba(0,0,0,0.4)' : colors.face.text}
        />
        {!isShadow && (
          <path
            d={`M4 1 L6 9 L5 9 L5 ${handLength - 1} L4 ${handLength - 1} L4 9 L3 9 Z`}
            fill={colors.metal.gold}
            opacity="0.3"
          />
        )}
      </svg>
    </motion.div>
  )
}

// ============================================
// AGUJA DE MINUTO (más larga y elegante)
// ============================================
function MinuteHand({ angle, colors, isShadow = false }: { angle: number; colors: any; isShadow?: boolean }) {
  const handLength = 46
  const tailLength = 10
  const totalHeight = handLength + tailLength

  return (
    <motion.div
      className="absolute z-21"
      style={{
        left: '50%',
        top: '50%',
        width: '6px',
        height: `${totalHeight}px`,
        marginLeft: '-3px',
        marginTop: `-${handLength}px`,
        transformOrigin: `center ${handLength}px`,
        transform: isShadow ? 'translate(2px, 2px)' : undefined,
      }}
      animate={{ rotate: angle }}
      transition={{ type: 'spring', stiffness: 50, damping: 12 }}
    >
      <svg
        width="6"
        height={totalHeight}
        viewBox={`0 0 6 ${totalHeight}`}
        fill="none"
        style={{ filter: isShadow ? 'blur(1px)' : 'none' }}
      >
        {/* Punta y cuerpo principal */}
        <path
          d={`M3 0 L5.5 8 L4 8 L4 ${handLength} L2 ${handLength} L2 8 L0.5 8 Z`}
          fill={isShadow ? 'rgba(0,0,0,0.4)' : colors.face.text}
        />
        {/* Cola de contrapeso */}
        <rect
          x="2"
          y={handLength}
          width="2"
          height={tailLength}
          fill={isShadow ? 'rgba(0,0,0,0.4)' : colors.face.text}
        />
        {!isShadow && (
          <path
            d={`M3 1 L5 7.5 L3.5 7.5 L3.5 ${handLength - 1} L3 ${handLength - 1} L3 7.5 L2 7.5 Z`}
            fill={colors.metal.gold}
            opacity="0.25"
          />
        )}
      </svg>
    </motion.div>
  )
}

// ============================================
// AGUJA DE SEGUNDO (roja, delgada, clásica)
// ============================================
function SecondHand({ angle, colors, isNight }: { angle: number; colors: any; isNight: boolean }) {
  const handLength = 50
  const tailLength = 14
  const totalHeight = handLength + tailLength

  return (
    <motion.div
      className="absolute z-22"
      style={{
        left: '50%',
        top: '50%',
        width: '5px',
        height: `${totalHeight}px`,
        marginLeft: '-2.5px',
        marginTop: `-${handLength}px`,
        transformOrigin: `center ${handLength}px`,
      }}
      animate={{ rotate: angle }}
      transition={{ duration: 0.1, ease: 'linear' }}
    >
      <svg width="5" height={totalHeight} viewBox={`0 0 5 ${totalHeight}`} fill="none">
        {/* Cuerpo de la aguja */}
        <rect
          x="2"
          y="0"
          width="1"
          height={handLength}
          fill={isNight ? '#8B4513' : '#B22222'}
        />
        {/* Punta */}
        <path
          d="M2.5 0 L3.5 5 L1.5 5 Z"
          fill={isNight ? '#8B4513' : '#B22222'}
        />
        {/* Cola de contrapeso */}
        <rect
          x="1.5"
          y={handLength}
          width="2"
          height={tailLength - 4}
          fill={isNight ? '#8B4513' : '#B22222'}
        />
        <circle
          cx="2.5"
          cy={totalHeight - 3}
          r="2.5"
          fill={isNight ? '#8B4513' : '#B22222'}
        />
      </svg>
    </motion.div>
  )
}

export const AnalogClock = memo(AnalogClockComponent)

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  AnalogClock,
  DayNightToggle,
  NordicWindow,
  Rain,
  Snow,
  Stars,
  Lightning,
  Sun,
  Aurora,
} from '@/components'
import { useLocation, useWeather, useTime } from '@/hooks'
import { TimeOfDay, WeatherCondition } from '@/types'

export default function Home() {
  const { location } = useLocation()
  const { data: weather, isLoading } = useWeather(location)
  const time = useTime()

  // Override para demo/testing
  const [timeOverride, setTimeOverride] = useState<TimeOfDay | null>(null)
  const [conditionOverride, setConditionOverride] = useState<WeatherCondition | null>(null)

  // Estado actual (real o override)
  const currentTimeOfDay = timeOverride || time.timeOfDay
  const currentCondition = conditionOverride || weather?.condition || 'clear'
  const isNight = currentTimeOfDay === 'night' || currentTimeOfDay === 'dusk'

  // Toggle día/noche
  const handleTimeToggle = () => {
    if (timeOverride) {
      setTimeOverride(null)
    } else {
      setTimeOverride(isNight ? 'day' : 'night')
    }
  }

  // Colores de la cabaña de madera roja
  const cabinColors = {
    wall: isNight ? '#1a0d0d' : '#8B4A4A',
    wallLight: isNight ? '#2a1515' : '#A05858',
    wallDark: isNight ? '#120808' : '#6B3636',
    plank: isNight ? '#251212' : '#7A4040',
    groove: isNight ? '#0a0505' : '#4A2525',
  }

  return (
    <main
      className="relative min-h-screen w-full overflow-hidden flex items-center justify-center"
      style={{
        background: cabinColors.wall,
        transition: 'background 1s ease',
      }}
    >
      {/* Pared de madera de cabaña - tablones horizontales */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Tablones de madera */}
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={`plank-${i}`}
            className="absolute left-0 right-0"
            style={{
              top: `${i * 5}%`,
              height: '5.5%',
              background: `linear-gradient(
                90deg,
                ${cabinColors.plank} 0%,
                ${cabinColors.wallLight} 20%,
                ${cabinColors.wall} 40%,
                ${cabinColors.wallLight} 60%,
                ${cabinColors.plank} 80%,
                ${cabinColors.wall} 100%
              )`,
            }}
          >
            {/* Ranura entre tablones */}
            <div
              className="absolute bottom-0 left-0 right-0"
              style={{
                height: '2px',
                background: cabinColors.groove,
                boxShadow: `0 1px 2px ${cabinColors.groove}`,
              }}
            />
          </div>
        ))}

        {/* Textura de veta de madera SVG superpuesta */}
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: isNight ? 0.15 : 0.25 }}>
          <defs>
            <pattern id="woodGrainWall" patternUnits="userSpaceOnUse" width="200" height="20">
              <path
                d="M0,10 Q50,5 100,10 T200,10"
                stroke={isNight ? '#3a2020' : '#5A3030'}
                strokeWidth="0.5"
                fill="none"
                opacity="0.6"
              />
              <path
                d="M0,15 Q50,12 100,15 T200,15"
                stroke={isNight ? '#3a2020' : '#5A3030'}
                strokeWidth="0.3"
                fill="none"
                opacity="0.4"
              />
              <path
                d="M0,5 Q50,8 100,5 T200,5"
                stroke={isNight ? '#3a2020' : '#5A3030'}
                strokeWidth="0.3"
                fill="none"
                opacity="0.3"
              />
              {/* Nudos ocasionales */}
              <ellipse cx="150" cy="10" rx="3" ry="2" fill={isNight ? '#2a1515' : '#4A2828'} opacity="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#woodGrainWall)" />
        </svg>

        {/* Textura de ruido para más realismo */}
        <div
          className="absolute inset-0"
          style={{
            opacity: isNight ? 0.08 : 0.12,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            mixBlendMode: 'multiply',
          }}
        />
      </div>

      {/* Sombra en las esquinas (ambiente de cabaña) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at center, transparent 30%, ${isNight ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.25)'} 100%)
          `,
        }}
      />

      {/* Luz cálida de chimenea/vela en la noche */}
      {isNight && (
        <>
          <motion.div
            className="absolute pointer-events-none"
            style={{
              width: '100%',
              height: '60%',
              bottom: 0,
              left: 0,
              background: 'radial-gradient(ellipse at 50% 100%, rgba(255,140,60,0.12) 0%, transparent 50%)',
            }}
            animate={{
              opacity: [0.5, 0.7, 0.5, 0.6, 0.5],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          {/* Luz más intensa cerca de la ventana */}
          <motion.div
            className="absolute pointer-events-none"
            style={{
              width: '500px',
              height: '300px',
              bottom: '10%',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'radial-gradient(ellipse at center bottom, rgba(255,160,80,0.1) 0%, transparent 60%)',
            }}
            animate={{
              opacity: [0.6, 0.9, 0.6, 0.8, 0.6],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </>
      )}

      {/* Luz del sol entrando (día despejado) */}
      {!isNight && currentCondition === 'clear' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="absolute pointer-events-none"
          style={{
            width: '80vw',
            height: '80vh',
            background: 'radial-gradient(ellipse at 60% 40%, rgba(255,250,220,0.15) 0%, transparent 60%)',
          }}
        />
      )}

      {/* Reloj analógico en la pared (arriba derecha) */}
      <div className="absolute top-8 right-8 z-30">
        <AnalogClock
          weather={weather}
          timeOfDay={currentTimeOfDay}
        />
      </div>

      {/* Toggle día/noche */}
      <div className="absolute top-56 right-12 z-30">
        <DayNightToggle
          timeOfDay={currentTimeOfDay}
          isOverride={timeOverride !== null}
          onToggle={handleTimeToggle}
        />
      </div>

      {/* Selector de clima estilo cabaña */}
      <div className="absolute bottom-8 left-8 z-30">
        <WeatherSelector
          currentCondition={currentCondition}
          isOverride={conditionOverride !== null}
          onSelect={(c) => setConditionOverride(c === conditionOverride ? null : c)}
          isNight={isNight}
        />
      </div>

      {/* Crédito discreto */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 right-8 z-30"
      >
        <span
          className="text-xs tracking-wider"
          style={{
            color: isNight ? 'rgba(255,220,180,0.4)' : 'rgba(60,30,20,0.4)',
            fontFamily: 'Georgia, serif',
            textShadow: isNight ? '0 1px 2px rgba(0,0,0,0.5)' : 'none',
          }}
        >
          Through the Glass
        </span>
      </motion.div>

      {/* La ventana Nordic Cozy */}
      <NordicWindow
        timeOfDay={currentTimeOfDay}
        condition={currentCondition}
      >
        <WeatherEffects
          condition={currentCondition}
          timeOfDay={currentTimeOfDay}
        />
      </NordicWindow>

      {/* Loading */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            className="w-10 h-10 border-2 border-t-transparent rounded-full"
            style={{ borderColor: isNight ? '#D4A574' : '#8B4A4A' }}
          />
        </div>
      )}
    </main>
  )
}

// Efectos del clima
function WeatherEffects({
  condition,
  timeOfDay
}: {
  condition: WeatherCondition
  timeOfDay: TimeOfDay
}) {
  const isNight = timeOfDay === 'night' || timeOfDay === 'dusk'

  return (
    <>
      {/* Estrellas (noche clara) */}
      {isNight && condition !== 'storm' && condition !== 'rain' && condition !== 'fog' && (
        <Stars count={condition === 'cloudy' ? 20 : 50} showMoon={condition !== 'aurora'} />
      )}

      {/* Aurora Boreal (noche + aurora) */}
      {condition === 'aurora' && isNight && (
        <>
          <Stars count={60} showMoon={false} />
          <Aurora intensity="high" />
        </>
      )}

      {/* Sol */}
      {!isNight && condition === 'clear' && <Sun />}

      {/* Lluvia */}
      {condition === 'rain' && <Rain intensity="moderate" />}

      {/* Nieve */}
      {condition === 'snow' && <Snow intensity="moderate" />}

      {/* Tormenta */}
      {condition === 'storm' && (
        <>
          <Rain intensity="heavy" isStorm />
          <Lightning frequency={5} />
        </>
      )}
    </>
  )
}

// Selector de clima estilo rústico/cabaña
function WeatherSelector({
  currentCondition,
  isOverride,
  onSelect,
  isNight,
}: {
  currentCondition: WeatherCondition
  isOverride: boolean
  onSelect: (c: WeatherCondition) => void
  isNight: boolean
}) {
  const conditions: { value: WeatherCondition; icon: React.ReactNode; label: string }[] = [
    {
      value: 'clear',
      icon: <SunIcon />,
      label: 'Clear'
    },
    {
      value: 'cloudy',
      icon: <CloudIcon />,
      label: 'Cloudy'
    },
    {
      value: 'rain',
      icon: <RainIcon />,
      label: 'Rain'
    },
    {
      value: 'snow',
      icon: <SnowIcon />,
      label: 'Snow'
    },
    {
      value: 'storm',
      icon: <StormIcon />,
      label: 'Storm'
    },
    {
      value: 'fog',
      icon: <FogIcon />,
      label: 'Fog'
    },
    {
      value: 'aurora',
      icon: <AuroraIcon />,
      label: 'Aurora'
    },
  ]

  // Colores del selector estilo madera
  const selectorColors = {
    bg: isNight ? '#2a1818' : '#6B3A3A',
    bgLight: isNight ? '#3a2222' : '#7A4545',
    border: isNight ? '#1a0f0f' : '#4A2525',
    accent: isNight ? '#D4A574' : '#C9A86C',
    text: isNight ? '#E8D5C4' : '#F5EBE0',
    selected: isNight ? 'rgba(212,165,116,0.25)' : 'rgba(201,168,108,0.3)',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2 }}
      className="relative"
    >
      {/* Marco de madera del selector */}
      <div
        className="relative p-1 rounded-lg"
        style={{
          background: `linear-gradient(145deg, ${selectorColors.bgLight} 0%, ${selectorColors.bg} 50%, ${selectorColors.border} 100%)`,
          boxShadow: `
            inset 0 1px 0 rgba(255,255,255,0.1),
            0 4px 12px rgba(0,0,0,0.4),
            0 8px 24px rgba(0,0,0,0.2)
          `,
        }}
      >
        {/* Borde interior */}
        <div
          className="p-3 rounded-md flex gap-1"
          style={{
            background: isNight
              ? 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%)'
              : 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.05) 100%)',
            border: `1px solid ${selectorColors.border}`,
          }}
        >
          {conditions.map(({ value, icon, label }) => {
            const isSelected = currentCondition === value
            return (
              <motion.button
                key={value}
                onClick={() => onSelect(value)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-9 h-9 rounded-md flex items-center justify-center transition-colors"
                style={{
                  background: isSelected ? selectorColors.selected : 'transparent',
                  border: isSelected
                    ? `1px solid ${selectorColors.accent}`
                    : '1px solid transparent',
                  boxShadow: isSelected
                    ? `0 0 8px ${selectorColors.accent}40, inset 0 0 4px ${selectorColors.accent}20`
                    : 'none',
                }}
                title={label}
              >
                <div style={{ color: isSelected ? selectorColors.accent : selectorColors.text }}>
                  {icon}
                </div>
                {/* Indicador de override */}
                {isOverride && isSelected && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
                    style={{ background: selectorColors.accent }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Textura de madera sutil */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none rounded-lg overflow-hidden" style={{ opacity: 0.15 }}>
        <defs>
          <pattern id="selectorWoodGrain" patternUnits="userSpaceOnUse" width="60" height="8">
            <path
              d="M0,4 Q15,2 30,4 T60,4"
              stroke={isNight ? '#4a2828' : '#3A2020'}
              strokeWidth="0.5"
              fill="none"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#selectorWoodGrain)" />
      </svg>
    </motion.div>
  )
}

// Iconos SVG personalizados para el selector
function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  )
}

function CloudIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    </svg>
  )
}

function RainIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M16 13v8M8 13v8M12 15v8" />
      <path d="M18 8h-1.26A8 8 0 1 0 9 16h9a5 5 0 0 0 0-10z" />
    </svg>
  )
}

function SnowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 2v20M17 7l-10 10M7 7l10 10" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  )
}

function StormIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9" />
      <polyline points="13 11 9 17 15 17 11 23" />
    </svg>
  )
}

function FogIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 14h16M4 10h16M4 18h16" />
    </svg>
  )
}

function AuroraIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 20c0-8 4-16 8-16s8 8 8 16" />
      <path d="M8 20c0-5 2-10 4-10s4 5 4 10" />
      <path d="M12 20v-6" />
    </svg>
  )
}

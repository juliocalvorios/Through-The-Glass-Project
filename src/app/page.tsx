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

  return (
    <main 
      className="relative min-h-screen w-full overflow-hidden flex items-center justify-center"
      style={{
        background: isNight 
          ? 'linear-gradient(180deg, #1a1f2e 0%, #252d3d 50%, #1f2937 100%)'
          : 'linear-gradient(180deg, #f5f0e6 0%, #ebe4d6 50%, #e0d8c8 100%)',
        transition: 'background 1s ease',
      }}
    >
      {/* Textura de pared - yeso cálido */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: isNight ? 0.1 : 0.25,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Luz cálida de la vela en la noche */}
      {isNight && (
        <motion.div
          className="absolute pointer-events-none"
          style={{
            width: '600px',
            height: '400px',
            bottom: '15%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'radial-gradient(ellipse at center bottom, rgba(255,180,100,0.08) 0%, transparent 60%)',
          }}
          animate={{
            opacity: [0.6, 0.8, 0.6, 0.7, 0.6],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
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
            background: 'radial-gradient(ellipse at 60% 40%, rgba(255,250,220,0.2) 0%, transparent 60%)',
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

      {/* Selector de clima para demo */}
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
            color: isNight ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)',
            fontFamily: 'Georgia, serif',
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
            style={{ borderColor: isNight ? '#f5f0e6' : '#5c4a32' }}
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
        <Stars count={condition === 'cloudy' ? 15 : 40} />
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

// Selector de clima
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
  const conditions: { value: WeatherCondition; emoji: string; label: string }[] = [
    { value: 'clear', emoji: '☀️', label: 'Clear' },
    { value: 'cloudy', emoji: '☁️', label: 'Cloudy' },
    { value: 'rain', emoji: '🌧️', label: 'Rain' },
    { value: 'snow', emoji: '❄️', label: 'Snow' },
    { value: 'storm', emoji: '⛈️', label: 'Storm' },
    { value: 'fog', emoji: '🌫️', label: 'Fog' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2 }}
      className="flex gap-2 p-3 rounded-2xl"
      style={{
        background: isNight 
          ? 'rgba(30, 35, 45, 0.8)' 
          : 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px)',
        boxShadow: isNight
          ? '0 4px 20px rgba(0,0,0,0.3)'
          : '0 4px 20px rgba(0,0,0,0.1)',
      }}
    >
      {conditions.map(({ value, emoji, label }) => (
        <button
          key={value}
          onClick={() => onSelect(value)}
          className={`
            w-10 h-10 rounded-xl flex items-center justify-center text-lg
            transition-all duration-200 hover:scale-110
          `}
          style={{
            background: currentCondition === value 
              ? (isNight ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)')
              : 'transparent',
            boxShadow: isOverride && currentCondition === value 
              ? '0 0 0 2px #8b5cf6' 
              : 'none',
          }}
          title={label}
        >
          {emoji}
        </button>
      ))}
    </motion.div>
  )
}

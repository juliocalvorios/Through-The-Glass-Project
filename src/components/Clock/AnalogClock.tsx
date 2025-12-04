'use client'

import { useEffect, useState, memo } from 'react'
import { motion } from 'framer-motion'
import { WeatherData, TimeOfDay } from '@/types'

interface AnalogClockProps {
  weather?: WeatherData
  timeOfDay: TimeOfDay
}

function AnalogClockComponent({ weather, timeOfDay }: AnalogClockProps) {
  const [time, setTime] = useState(new Date())
  const isNight = timeOfDay === 'night' || timeOfDay === 'dusk'

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const seconds = time.getSeconds()
  const minutes = time.getMinutes()
  const hours = time.getHours() % 12

  // Ángulos de las agujas
  const secondDeg = seconds * 6
  const minuteDeg = minutes * 6 + seconds * 0.1
  const hourDeg = hours * 30 + minutes * 0.5

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="flex flex-col items-center gap-4"
    >
      {/* Reloj analógico */}
      <div 
        className="relative"
        style={{
          width: '140px',
          height: '140px',
        }}
      >
        {/* Cuerpo del reloj - madera clara nórdica */}
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: isNight 
              ? 'linear-gradient(145deg, #3d3529 0%, #2a241c 100%)'
              : 'linear-gradient(145deg, #f5ebe0 0%, #e8dcc8 100%)',
            boxShadow: isNight
              ? '0 8px 32px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.05)'
              : '0 8px 32px rgba(0,0,0,0.15), inset 0 2px 4px rgba(255,255,255,0.5)',
            border: isNight 
              ? '6px solid #4a3f32'
              : '6px solid #c9b896',
          }}
        >
          {/* Textura de madera sutil */}
          <div 
            className="absolute inset-0 rounded-full opacity-20"
            style={{
              backgroundImage: `repeating-linear-gradient(
                90deg,
                transparent 0px,
                transparent 3px,
                rgba(139,90,43,0.1) 3px,
                rgba(139,90,43,0.1) 4px
              )`,
            }}
          />
        </div>

        {/* Cara del reloj */}
        <div className="absolute inset-3 rounded-full flex items-center justify-center">
          
          {/* Marcadores de hora */}
          {[...Array(12)].map((_, i) => {
            const angle = (i * 30 - 90) * (Math.PI / 180)
            const isMainHour = i % 3 === 0
            const radius = 42
            const x = Math.cos(angle) * radius
            const y = Math.sin(angle) * radius
            
            return (
              <div
                key={i}
                className="absolute"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {isMainHour ? (
                  // Marcadores principales (12, 3, 6, 9)
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: isNight ? '#a89880' : '#8b7355',
                    }}
                  />
                ) : (
                  // Marcadores secundarios
                  <div 
                    className="w-1 h-1 rounded-full"
                    style={{
                      backgroundColor: isNight ? '#6b5d4d' : '#c9b896',
                    }}
                  />
                )}
              </div>
            )
          })}

          {/* Aguja de hora */}
          <motion.div
            className="absolute origin-bottom"
            style={{
              width: '4px',
              height: '32px',
              bottom: '50%',
              left: 'calc(50% - 2px)',
              backgroundColor: isNight ? '#d4c4a8' : '#5c4a32',
              borderRadius: '2px',
              transformOrigin: 'bottom center',
            }}
            animate={{ rotate: hourDeg }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          />

          {/* Aguja de minuto */}
          <motion.div
            className="absolute origin-bottom"
            style={{
              width: '3px',
              height: '44px',
              bottom: '50%',
              left: 'calc(50% - 1.5px)',
              backgroundColor: isNight ? '#c9b896' : '#6b5740',
              borderRadius: '1.5px',
              transformOrigin: 'bottom center',
            }}
            animate={{ rotate: minuteDeg }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          />

          {/* Aguja de segundo */}
          <motion.div
            className="absolute origin-bottom"
            style={{
              width: '1px',
              height: '48px',
              bottom: '50%',
              left: 'calc(50% - 0.5px)',
              backgroundColor: isNight ? '#a08060' : '#8b5a2b',
              transformOrigin: 'bottom center',
            }}
            animate={{ rotate: secondDeg }}
            transition={{ duration: 0.1 }}
          />

          {/* Centro del reloj */}
          <div 
            className="absolute w-3 h-3 rounded-full"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: isNight ? '#a89880' : '#8b7355',
              boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
            }}
          />
        </div>

        {/* Pequeño gancho arriba (para colgar) */}
        <div 
          className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-3 rounded-t-full"
          style={{
            backgroundColor: isNight ? '#4a3f32' : '#c9b896',
          }}
        />
      </div>

      {/* Temperatura debajo del reloj */}
      {weather && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <div 
            className="text-3xl font-light tracking-wide"
            style={{
              color: isNight ? '#e8dcc8' : '#5c4a32',
              fontFamily: 'Georgia, serif',
            }}
          >
            {weather.temperature}°
          </div>
          <div 
            className="text-xs uppercase tracking-widest mt-1"
            style={{
              color: isNight ? '#a89880' : '#8b7355',
            }}
          >
            {weather.location?.city}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export const AnalogClock = memo(AnalogClockComponent)

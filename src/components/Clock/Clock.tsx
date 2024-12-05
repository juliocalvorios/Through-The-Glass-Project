'use client'

import { useTime } from '@/hooks'
import { WeatherData, TimeOfDay } from '@/types'
import { motion } from 'framer-motion'

interface ClockProps {
  weather?: WeatherData
  timeOfDay: TimeOfDay
}

export function Clock({ weather, timeOfDay }: ClockProps) {
  const time = useTime()
  
  const isNight = timeOfDay === 'night' || timeOfDay === 'dusk'
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className={`
        relative p-6 rounded-2xl
        backdrop-blur-sm
        transition-all duration-500
        ${isNight 
          ? 'bg-gray-900/40 text-white shadow-lg shadow-black/20' 
          : 'bg-white/60 text-gray-800 shadow-lg shadow-black/10'
        }
      `}
    >
      {/* Hora principal */}
      <div className="text-center">
        <motion.div
          key={time.formatted24h}
          initial={{ opacity: 0.5, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`
            text-5xl font-light tracking-wider
            ${isNight ? 'text-white' : 'text-gray-800'}
          `}
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {time.formatted24h}
        </motion.div>
        
        {/* Temperatura */}
        {weather && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`
              mt-2 text-3xl font-extralight
              ${isNight ? 'text-white/80' : 'text-gray-600'}
            `}
          >
            {weather.temperature}°C
          </motion.div>
        )}

        {/* Ubicación */}
        {weather?.location && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className={`
              mt-1 text-sm font-light tracking-wide uppercase
              ${isNight ? 'text-white/50' : 'text-gray-400'}
            `}
          >
            {weather.location.city}
          </motion.div>
        )}
      </div>

      {/* Efecto de brillo nocturno (como reloj luminoso) */}
      {isNight && (
        <div 
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 30px rgba(255,255,255,0.05)',
          }}
        />
      )}

      {/* Efecto de relámpago */}
      {weather?.condition === 'storm' && (
        <motion.div
          className="absolute inset-0 rounded-2xl bg-white/20 pointer-events-none"
          animate={{ opacity: [0, 0, 1, 0, 0.5, 0] }}
          transition={{ 
            duration: 0.5, 
            repeat: Infinity, 
            repeatDelay: Math.random() * 5 + 3 
          }}
        />
      )}
    </motion.div>
  )
}

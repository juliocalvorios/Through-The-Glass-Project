'use client'

import { motion } from 'framer-motion'
import { TimeOfDay } from '@/types'

interface DayNightToggleProps {
  timeOfDay: TimeOfDay
  isOverride: boolean
  onToggle: () => void
}

export function DayNightToggle({ timeOfDay, isOverride, onToggle }: DayNightToggleProps) {
  const isNight = timeOfDay === 'night' || timeOfDay === 'dusk'

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      onClick={onToggle}
      className={`
        relative w-20 h-10 rounded-full cursor-pointer
        transition-all duration-500 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${isNight 
          ? 'bg-gray-800 focus:ring-indigo-500' 
          : 'bg-sky-400 focus:ring-yellow-500'
        }
        ${isOverride ? 'ring-2 ring-purple-500' : ''}
      `}
      aria-label={isNight ? 'Switch to day mode' : 'Switch to night mode'}
      title={isOverride ? 'Override active - click to reset' : 'Toggle day/night'}
    >
      {/* Track background effects */}
      <div className="absolute inset-0 rounded-full overflow-hidden">
        {/* Estrellas (noche) */}
        {isNight && (
          <>
            <div className="star" style={{ top: '20%', left: '60%', animationDelay: '0s' }} />
            <div className="star" style={{ top: '40%', left: '70%', animationDelay: '0.5s' }} />
            <div className="star" style={{ top: '60%', left: '55%', animationDelay: '1s' }} />
            <div className="star" style={{ top: '30%', left: '80%', animationDelay: '0.3s' }} />
          </>
        )}
        
        {/* Nubes (día) */}
        {!isNight && (
          <motion.div
            className="absolute w-6 h-3 bg-white/60 rounded-full"
            style={{ top: '25%', right: '15%' }}
            animate={{ x: [0, 3, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        )}
      </div>

      {/* El botón (sol/luna) */}
      <motion.div
        className={`
          absolute top-1 w-8 h-8 rounded-full
          flex items-center justify-center
          transition-colors duration-500
          ${isNight 
            ? 'bg-gray-200' 
            : 'bg-yellow-400'
          }
        `}
        animate={{ 
          left: isNight ? '2.5rem' : '0.25rem',
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {/* Sol */}
        {!isNight && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="w-full h-full rounded-full bg-yellow-400"
            style={{
              boxShadow: '0 0 20px rgba(255, 200, 0, 0.6)',
            }}
          />
        )}
        
        {/* Luna con cráteres */}
        {isNight && (
          <motion.div
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="w-full h-full rounded-full bg-gray-200 relative overflow-hidden"
          >
            {/* Cráteres */}
            <div 
              className="absolute w-2 h-2 rounded-full bg-gray-300"
              style={{ top: '20%', left: '20%' }}
            />
            <div 
              className="absolute w-1.5 h-1.5 rounded-full bg-gray-300"
              style={{ top: '50%', left: '60%' }}
            />
            <div 
              className="absolute w-1 h-1 rounded-full bg-gray-300"
              style={{ top: '70%', left: '30%' }}
            />
          </motion.div>
        )}
      </motion.div>

      {/* Indicador de override */}
      {isOverride && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full"
        />
      )}
    </motion.button>
  )
}

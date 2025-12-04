'use client'

import { memo, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { TimeOfDay, WeatherCondition } from '@/types'

interface WindowFrameProps {
  children: ReactNode
  timeOfDay: TimeOfDay
  condition: WeatherCondition
}

function WindowFrameComponent({ children, timeOfDay, condition }: WindowFrameProps) {
  const isNight = timeOfDay === 'night' || timeOfDay === 'dusk'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="relative"
    >
      {/* Marco exterior de la ventana */}
      <div 
        className="relative rounded-lg overflow-hidden"
        style={{
          width: 'min(80vw, 600px)',
          height: 'min(60vh, 450px)',
          boxShadow: `
            0 10px 40px rgba(0,0,0,0.3),
            inset 0 2px 0 rgba(255,255,255,0.1)
          `,
        }}
      >
        {/* Marco de madera */}
        <div 
          className="absolute inset-0 rounded-lg"
          style={{
            border: '12px solid',
            borderColor: isNight ? '#3d2817' : '#5d3a1a',
            boxShadow: `
              inset 0 0 20px rgba(0,0,0,0.5),
              inset 2px 2px 4px rgba(255,255,255,0.1)
            `,
          }}
        >
          {/* Textura de madera */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `repeating-linear-gradient(
                90deg,
                transparent,
                transparent 2px,
                rgba(0,0,0,0.1) 2px,
                rgba(0,0,0,0.1) 4px
              )`,
            }}
          />
        </div>

        {/* División central de la ventana (cruz) */}
        <div 
          className="absolute left-1/2 top-0 bottom-0 w-3 -translate-x-1/2 z-10"
          style={{
            backgroundColor: isNight ? '#3d2817' : '#5d3a1a',
            boxShadow: '2px 0 4px rgba(0,0,0,0.3)',
          }}
        />
        <div 
          className="absolute top-1/2 left-0 right-0 h-3 -translate-y-1/2 z-10"
          style={{
            backgroundColor: isNight ? '#3d2817' : '#5d3a1a',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}
        />

        {/* Área del cristal (donde van los efectos del clima) */}
        <div 
          className="absolute inset-3 rounded overflow-hidden"
          style={{
            boxShadow: 'inset 0 0 30px rgba(0,0,0,0.2)',
          }}
        >
          {/* Fondo del cielo */}
          <div 
            className="absolute inset-0 transition-colors duration-1000"
            style={{
              background: getSkyGradient(timeOfDay, condition),
            }}
          />

          {/* Contenido (efectos del clima) */}
          {children}

          {/* Reflejo del cristal */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(
                135deg,
                rgba(255,255,255,0.1) 0%,
                transparent 50%,
                rgba(255,255,255,0.05) 100%
              )`,
            }}
          />
        </div>

        {/* Alféizar de la ventana */}
        <div 
          className="absolute -bottom-4 -left-2 -right-2 h-6 rounded-b-lg z-20"
          style={{
            backgroundColor: isNight ? '#2d1810' : '#4a2c17',
            boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
          }}
        >
          {/* Borde superior del alféizar */}
          <div 
            className="absolute top-0 left-0 right-0 h-1"
            style={{
              backgroundColor: isNight ? '#4a2c17' : '#6d4423',
            }}
          />
        </div>
      </div>
    </motion.div>
  )
}

// Gradientes del cielo según hora y clima
function getSkyGradient(timeOfDay: TimeOfDay, condition: WeatherCondition): string {
  // Storm siempre oscuro
  if (condition === 'storm') {
    return 'linear-gradient(180deg, #1a1a2e 0%, #2c3e50 50%, #34495e 100%)'
  }

  // Rain - gris
  if (condition === 'rain') {
    if (timeOfDay === 'night') {
      return 'linear-gradient(180deg, #0f0c29 0%, #1a1a2e 50%, #24243e 100%)'
    }
    return 'linear-gradient(180deg, #5d6d7e 0%, #85929e 50%, #aab7b8 100%)'
  }

  // Snow - blanco grisáceo
  if (condition === 'snow') {
    if (timeOfDay === 'night') {
      return 'linear-gradient(180deg, #1a1a2e 0%, #2c3e50 50%, #5d6d7e 100%)'
    }
    return 'linear-gradient(180deg, #d5d8dc 0%, #e8e8e8 50%, #f4f4f4 100%)'
  }

  // Por hora del día
  switch (timeOfDay) {
    case 'dawn':
      return 'linear-gradient(180deg, #1a1a2e 0%, #ff7e5f 30%, #feb47b 60%, #87CEEB 100%)'
    case 'day':
      return 'linear-gradient(180deg, #4a90c2 0%, #87CEEB 40%, #b4d7e8 100%)'
    case 'dusk':
      return 'linear-gradient(180deg, #2c3e50 0%, #e74c3c 30%, #f39c12 60%, #1a1a2e 100%)'
    case 'night':
    default:
      return 'linear-gradient(180deg, #0f0c29 0%, #302b63 50%, #24243e 100%)'
  }
}

export const WindowFrame = memo(WindowFrameComponent)

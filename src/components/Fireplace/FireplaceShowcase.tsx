'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { TimeOfDay, WeatherCondition } from '@/types'
import { Fireplace1 } from './designs/Fireplace1'
import { Fireplace2 } from './designs/Fireplace2'
import { Fireplace3 } from './designs/Fireplace3'
import { Fireplace4 } from './designs/Fireplace4'
import { Fireplace5 } from './designs/Fireplace5'
import { Fireplace6 } from './designs/Fireplace6'

interface FireplaceShowcaseProps {
  timeOfDay: TimeOfDay
  condition: WeatherCondition
  onFireChange?: (isLit: boolean) => void
}

const designs = [
  { id: 1, name: 'Classic Stone', component: Fireplace1 },
  { id: 2, name: 'Modern Minimalist', component: Fireplace2 },
  { id: 3, name: 'Rustic Cabin', component: Fireplace3 },
  { id: 4, name: 'Victorian Ornate', component: Fireplace4 },
  { id: 5, name: 'Scandinavian Hygge', component: Fireplace5 },
  { id: 6, name: 'Mountain Lodge', component: Fireplace6 },
]

export function FireplaceShowcase({ timeOfDay, condition, onFireChange }: FireplaceShowcaseProps) {
  const [currentDesign, setCurrentDesign] = useState(0)
  const isNight = timeOfDay === 'night' || timeOfDay === 'dusk'

  const CurrentFireplace = designs[currentDesign].component

  return (
    <div className="relative">
      {/* Selector de diseño */}
      <div
        className="absolute -top-12 left-1/2 -translate-x-1/2 flex gap-2 z-50"
        style={{ width: '240px' }}
      >
        {designs.map((design, i) => (
          <motion.button
            key={design.id}
            onClick={(e) => {
              e.stopPropagation()
              setCurrentDesign(i)
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{
              background: currentDesign === i
                ? 'linear-gradient(135deg, #FF6B35 0%, #FF8C00 100%)'
                : isNight
                  ? 'rgba(60,50,40,0.8)'
                  : 'rgba(180,160,140,0.8)',
              color: currentDesign === i ? '#fff' : isNight ? '#a0a0a0' : '#555',
              border: `2px solid ${currentDesign === i ? '#FFD700' : 'transparent'}`,
              boxShadow: currentDesign === i ? '0 0 10px rgba(255,107,53,0.5)' : 'none',
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {design.id}
          </motion.button>
        ))}
      </div>

      {/* Nombre del diseño */}
      <motion.div
        key={currentDesign}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute -top-20 left-1/2 -translate-x-1/2 text-center z-50"
      >
        <span
          className="text-sm font-medium px-3 py-1 rounded"
          style={{
            background: isNight ? 'rgba(30,25,20,0.9)' : 'rgba(255,250,245,0.9)',
            color: isNight ? '#D4A574' : '#6B4A3A',
            border: `1px solid ${isNight ? '#4a3a2a' : '#D4C4B4'}`,
          }}
        >
          {designs[currentDesign].name}
        </span>
      </motion.div>

      {/* Chimenea actual */}
      <CurrentFireplace
        timeOfDay={timeOfDay}
        condition={condition}
        onFireChange={onFireChange}
      />
    </div>
  )
}

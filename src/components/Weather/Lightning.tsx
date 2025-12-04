'use client'

import { memo, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LightningProps {
  frequency?: number // Segundos entre relámpagos promedio
}

function LightningComponent({ frequency = 5 }: LightningProps) {
  const [flash, setFlash] = useState(false)

  useEffect(() => {
    const triggerLightning = () => {
      setFlash(true)
      setTimeout(() => setFlash(false), 150)
      
      // A veces doble flash
      if (Math.random() > 0.6) {
        setTimeout(() => {
          setFlash(true)
          setTimeout(() => setFlash(false), 100)
        }, 200)
      }
    }

    const scheduleNext = () => {
      const nextDelay = (frequency + Math.random() * frequency) * 1000
      return setTimeout(() => {
        triggerLightning()
        scheduleNext()
      }, nextDelay)
    }

    const timeout = scheduleNext()
    return () => clearTimeout(timeout)
  }, [frequency])

  return (
    <AnimatePresence>
      {flash && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.5, 1, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="absolute inset-0 bg-white/90 pointer-events-none z-50"
        />
      )}
    </AnimatePresence>
  )
}

export const Lightning = memo(LightningComponent)

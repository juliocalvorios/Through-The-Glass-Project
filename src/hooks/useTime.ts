'use client'

import { useState, useEffect } from 'react'
import { TimeOfDay } from '@/types'

interface TimeState {
  hours: number
  minutes: number
  seconds: number
  timeOfDay: TimeOfDay
  formatted12h: string
  formatted24h: string
}

function getTimeOfDay(hours: number): TimeOfDay {
  if (hours >= 6 && hours < 8) return 'dawn'
  if (hours >= 8 && hours < 18) return 'day'
  if (hours >= 18 && hours < 20) return 'dusk'
  return 'night'
}

function formatTime12h(hours: number, minutes: number): string {
  const h = hours % 12 || 12
  const m = minutes.toString().padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  return `${h}:${m} ${ampm}`
}

function formatTime24h(hours: number, minutes: number): string {
  const h = hours.toString().padStart(2, '0')
  const m = minutes.toString().padStart(2, '0')
  return `${h}:${m}`
}

export function useTime() {
  const [time, setTime] = useState<TimeState>(() => {
    const now = new Date()
    return {
      hours: now.getHours(),
      minutes: now.getMinutes(),
      seconds: now.getSeconds(),
      timeOfDay: getTimeOfDay(now.getHours()),
      formatted12h: formatTime12h(now.getHours(), now.getMinutes()),
      formatted24h: formatTime24h(now.getHours(), now.getMinutes()),
    }
  })

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      setTime({
        hours: now.getHours(),
        minutes: now.getMinutes(),
        seconds: now.getSeconds(),
        timeOfDay: getTimeOfDay(now.getHours()),
        formatted12h: formatTime12h(now.getHours(), now.getMinutes()),
        formatted24h: formatTime24h(now.getHours(), now.getMinutes()),
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return time
}

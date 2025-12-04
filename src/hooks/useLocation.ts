'use client'

import { useState, useEffect } from 'react'
import { Location } from '@/types'

export function useLocation() {
  const [location, setLocation] = useState<Location | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported')
      setIsLoading(false)
      // Fallback: Toronto
      setLocation({ latitude: 43.6532, longitude: -79.3832, city: 'Toronto', country: 'CA' })
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
        setIsLoading(false)
      },
      (err) => {
        setError(err.message)
        setIsLoading(false)
        // Fallback: Toronto
        setLocation({ latitude: 43.6532, longitude: -79.3832, city: 'Toronto', country: 'CA' })
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 600000, // 10 min cache
      }
    )
  }, [])

  return { location, error, isLoading }
}

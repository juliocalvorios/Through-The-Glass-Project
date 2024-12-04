'use client'

import { useQuery } from '@tanstack/react-query'
import { Location } from '@/types'

const FALLBACK_LOCATION: Location = {
  latitude: 43.6532,
  longitude: -79.3832,
  city: 'Toronto',
  country: 'CA',
}

async function getGeolocation(): Promise<Location> {
  if (!navigator.geolocation) {
    return FALLBACK_LOCATION
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      () => {
        resolve(FALLBACK_LOCATION)
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 600000,
      }
    )
  })
}

export function useLocation() {
  const { data: location, error, isLoading } = useQuery({
    queryKey: ['geolocation'],
    queryFn: getGeolocation,
    staleTime: 10 * 60 * 1000, // 10 min
    gcTime: 30 * 60 * 1000, // 30 min
    retry: 1,
  })

  return {
    location: location ?? null,
    error: error?.message ?? null,
    isLoading,
  }
}

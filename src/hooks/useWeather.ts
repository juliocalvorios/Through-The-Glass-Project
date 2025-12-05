'use client'

import { useQuery } from '@tanstack/react-query'
import { WeatherData, WeatherCondition, Location } from '@/types'

// Open-Meteo API - 100% gratuita, sin API key necesaria
const BASE_URL = 'https://api.open-meteo.com/v1/forecast'

// Mapeo de códigos WMO de Open-Meteo a nuestras condiciones
function mapWeatherCode(code: number): WeatherCondition {
  // Clear sky
  if (code === 0 || code === 1) return 'clear'
  // Partly cloudy
  if (code === 2) return 'cloudy'
  // Overcast
  if (code === 3) return 'cloudy'
  // Fog
  if (code >= 45 && code <= 48) return 'fog'
  // Drizzle
  if (code >= 51 && code <= 57) return 'rain'
  // Rain
  if (code >= 61 && code <= 67) return 'rain'
  // Snow
  if (code >= 71 && code <= 77) return 'snow'
  // Rain showers
  if (code >= 80 && code <= 82) return 'rain'
  // Snow showers
  if (code >= 85 && code <= 86) return 'snow'
  // Thunderstorm
  if (code >= 95 && code <= 99) return 'storm'

  return 'clear'
}

// Descripción legible del código WMO
function getWeatherDescription(code: number): string {
  const descriptions: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  }
  return descriptions[code] || 'Unknown'
}

async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const response = await fetch(
    `${BASE_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`
  )

  if (!response.ok) {
    throw new Error('Failed to fetch weather')
  }

  const data = await response.json()
  const current = data.current

  return {
    temperature: Math.round(current.temperature_2m),
    feelsLike: Math.round(current.apparent_temperature),
    humidity: current.relative_humidity_2m,
    windSpeed: Math.round(current.wind_speed_10m),
    condition: mapWeatherCode(current.weather_code),
    description: getWeatherDescription(current.weather_code),
    icon: '01d', // Open-Meteo no tiene iconos, pero no lo usamos
    location: {
      city: 'Your Location',
      country: '',
    },
  }
}

export function useWeather(location: Location | null) {
  return useQuery({
    queryKey: ['weather', location?.latitude, location?.longitude],
    queryFn: () => {
      if (!location) throw new Error('No location')
      return fetchWeather(location.latitude, location.longitude)
    },
    enabled: !!location,
    staleTime: 5 * 60 * 1000, // 5 min
    refetchInterval: 10 * 60 * 1000, // 10 min
  })
}

// Hook para override manual del clima (desarrollo/demo)
export function useWeatherOverride() {
  // Esto permite cambiar el clima manualmente para testing
  return {
    setCondition: (condition: WeatherCondition) => {
      // Implementar si necesitamos override
    }
  }
}

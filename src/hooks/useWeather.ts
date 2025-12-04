'use client'

import { useQuery } from '@tanstack/react-query'
import { WeatherData, WeatherCondition, Location } from '@/types'

// OpenWeatherMap API - necesitarás una API key gratuita
const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || 'demo'
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

// Mapeo de códigos de OpenWeather a nuestras condiciones
function mapWeatherCondition(code: number, description: string): WeatherCondition {
  // Thunderstorm
  if (code >= 200 && code < 300) return 'storm'
  // Drizzle & Rain
  if (code >= 300 && code < 600) return 'rain'
  // Snow
  if (code >= 600 && code < 700) return 'snow'
  // Atmosphere (fog, mist, etc.)
  if (code >= 700 && code < 800) return 'fog'
  // Clear
  if (code === 800) return 'clear'
  // Clouds
  if (code > 800) return 'cloudy'
  
  return 'clear'
}

async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  // Si no hay API key, usamos datos mock
  if (API_KEY === 'demo') {
    return getMockWeather()
  }

  const response = await fetch(
    `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  )

  if (!response.ok) {
    throw new Error('Failed to fetch weather')
  }

  const data = await response.json()

  return {
    temperature: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind.speed * 3.6), // m/s to km/h
    condition: mapWeatherCondition(data.weather[0].id, data.weather[0].description),
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    location: {
      city: data.name,
      country: data.sys.country,
    },
  }
}

// Mock para desarrollo sin API key
function getMockWeather(): WeatherData {
  const conditions: WeatherCondition[] = ['clear', 'rain', 'snow', 'fog', 'storm', 'cloudy']
  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)]
  
  return {
    temperature: Math.round(Math.random() * 30 - 5), // -5 to 25
    feelsLike: Math.round(Math.random() * 30 - 5),
    humidity: Math.round(Math.random() * 60 + 40), // 40-100
    windSpeed: Math.round(Math.random() * 30),
    condition: randomCondition,
    description: randomCondition,
    icon: '01d',
    location: {
      city: 'Toronto',
      country: 'CA',
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

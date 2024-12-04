// Tipos de clima posibles
export type WeatherCondition = 
  | 'clear'      // Despejado
  | 'rain'       // Lluvia
  | 'snow'       // Nieve
  | 'fog'        // Niebla
  | 'storm'      // Tormenta
  | 'cloudy'     // Nublado
  | 'aurora'     // Aurora boreal (se combina con night)

// Estado del tiempo del día
export type TimeOfDay = 'day' | 'night' | 'dawn' | 'dusk'

// Datos del clima de la API
export interface WeatherData {
  temperature: number          // Celsius
  feelsLike: number
  humidity: number             // %
  windSpeed: number            // km/h
  condition: WeatherCondition
  description: string
  icon: string
  location: {
    city: string
    country: string
  }
}

// Datos de aurora
export interface AuroraData {
  probability: number          // 0-100
  kpIndex: number              // 0-9
  isVisible: boolean
}

// Ubicación del usuario
export interface Location {
  latitude: number
  longitude: number
  city?: string
  country?: string
}

// Estado completo de la escena
export interface SceneState {
  weather: WeatherCondition
  timeOfDay: TimeOfDay
  temperature: number
  isAuroraVisible: boolean
  auroraIntensity: number      // 0-1
}

// Props para efectos de partículas
export interface ParticleProps {
  count: number
  speed?: number
  opacity?: number
}

// Interacción del cursor
export interface CursorInteraction {
  x: number
  y: number
  isPressed: boolean
  trail: { x: number; y: number }[]
}

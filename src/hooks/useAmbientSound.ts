'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { WeatherCondition, TimeOfDay } from '@/types'

// Sound configuration for each weather type
interface SoundConfig {
  src: string
  volume: number
  loop: boolean
  fadeIn?: number
  fadeOut?: number
}

type SoundType = 'rain' | 'storm' | 'thunder' | 'wind' | 'snow' | 'fire' | 'birds' | 'crickets' | 'aurora' | 'piano'

// You'll need to add actual sound files to public/sounds/
const SOUND_CONFIGS: Record<SoundType, SoundConfig> = {
  rain: {
    src: '/sounds/rain-sound.mp3',
    volume: 0.4,
    loop: true,
    fadeIn: 2000,
    fadeOut: 2000,
  },
  storm: {
    src: '/sounds/storm-snow.mp3',
    volume: 0.5,
    loop: true,
    fadeIn: 1500,
    fadeOut: 2000,
  },
  thunder: {
    src: '/sounds/storm-snow.mp3',
    volume: 0.7,
    loop: false,
  },
  wind: {
    src: '/sounds/wind.mp3',
    volume: 0.3,
    loop: true,
    fadeIn: 3000,
    fadeOut: 3000,
  },
  snow: {
    src: '/sounds/storm-snow.mp3',
    volume: 0.25,
    loop: true,
    fadeIn: 3000,
    fadeOut: 3000,
  },
  fire: {
    src: '/sounds/fireplace.mp3',
    volume: 0.25,
    loop: true,
    fadeIn: 2000,
    fadeOut: 2000,
  },
  birds: {
    src: '/sounds/birds.mp3',
    volume: 0.2,
    loop: true,
    fadeIn: 3000,
    fadeOut: 3000,
  },
  crickets: {
    src: '/sounds/crickets.mp3',
    volume: 0.15,
    loop: true,
    fadeIn: 3000,
    fadeOut: 3000,
  },
  aurora: {
    src: '/sounds/aurora-ambient.mp3',
    volume: 0.2,
    loop: true,
    fadeIn: 4000,
    fadeOut: 4000,
  },
  piano: {
    src: '/sounds/piano-music.mp3',
    volume: 0.08,
    loop: true,
    fadeIn: 3000,
    fadeOut: 3000,
  },
}

// Map weather conditions to sounds
function getSoundsForWeather(condition: WeatherCondition, timeOfDay: TimeOfDay): SoundType[] {
  const isNight = timeOfDay === 'night' || timeOfDay === 'dusk'
  const sounds: SoundType[] = ['piano'] // Piano always plays in background

  switch (condition) {
    case 'rain':
      sounds.push('rain')
      break
    case 'storm':
      sounds.push('storm', 'rain')
      break
    case 'snow':
      sounds.push('snow', 'wind')
      break
    case 'fog':
      sounds.push('wind')
      break
    case 'aurora':
      sounds.push('aurora')
      if (isNight) sounds.push('crickets')
      break
    case 'clear':
    case 'cloudy':
      if (isNight) {
        sounds.push('crickets')
      } else {
        sounds.push('birds')
      }
      break
  }

  // Always add fireplace at night for cozy cabin ambiance
  if (isNight) {
    sounds.push('fire')
  }

  return sounds
}

interface UseAmbientSoundOptions {
  enabled?: boolean
  masterVolume?: number
}

interface UseAmbientSoundReturn {
  isEnabled: boolean
  isMuted: boolean
  masterVolume: number
  toggleSound: () => void
  setMasterVolume: (volume: number) => void
  playThunder: () => void
}

export function useAmbientSound(
  condition: WeatherCondition,
  timeOfDay: TimeOfDay,
  options: UseAmbientSoundOptions = {}
): UseAmbientSoundReturn {
  const { enabled = false, masterVolume: initialVolume = 0.5 } = options

  const [isEnabled, setIsEnabled] = useState(enabled)
  const [isMuted, setIsMuted] = useState(false)
  const [masterVolume, setMasterVolume] = useState(initialVolume)

  // Store audio instances
  const audioRefs = useRef<Map<SoundType, HTMLAudioElement>>(new Map())
  const fadeTimeouts = useRef<Map<SoundType, NodeJS.Timeout>>(new Map())

  // Fade audio in/out
  const fadeAudio = useCallback((
    audio: HTMLAudioElement,
    targetVolume: number,
    duration: number,
    onComplete?: () => void
  ) => {
    const startVolume = audio.volume
    const volumeDiff = targetVolume - startVolume
    const steps = 30
    const stepDuration = duration / steps
    let currentStep = 0

    const fade = () => {
      currentStep++
      const progress = currentStep / steps
      // Ease-in-out curve
      const easeProgress = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2

      audio.volume = Math.max(0, Math.min(1, startVolume + volumeDiff * easeProgress))

      if (currentStep < steps) {
        setTimeout(fade, stepDuration)
      } else {
        onComplete?.()
      }
    }

    fade()
  }, [])

  // Play a sound
  const playSound = useCallback((type: SoundType) => {
    if (!isEnabled || isMuted) return

    const config = SOUND_CONFIGS[type]
    let audio = audioRefs.current.get(type)

    if (!audio) {
      audio = new Audio(config.src)
      audio.loop = config.loop
      audioRefs.current.set(type, audio)
    }

    const targetVolume = config.volume * masterVolume
    audio.volume = config.fadeIn ? 0 : targetVolume

    audio.play().catch(() => {
      // Audio play failed (likely user hasn't interacted with page yet)
      console.log('Audio playback requires user interaction')
    })

    if (config.fadeIn) {
      fadeAudio(audio, targetVolume, config.fadeIn)
    }
  }, [isEnabled, isMuted, masterVolume, fadeAudio])

  // Stop a sound
  const stopSound = useCallback((type: SoundType) => {
    const audio = audioRefs.current.get(type)
    if (!audio) return

    const config = SOUND_CONFIGS[type]

    // Clear any existing fade timeout
    const existingTimeout = fadeTimeouts.current.get(type)
    if (existingTimeout) clearTimeout(existingTimeout)

    if (config.fadeOut) {
      fadeAudio(audio, 0, config.fadeOut, () => {
        audio.pause()
        audio.currentTime = 0
      })
    } else {
      audio.pause()
      audio.currentTime = 0
    }
  }, [fadeAudio])

  // Play thunder sound (for lightning strikes)
  const playThunder = useCallback(() => {
    if (!isEnabled || isMuted) return

    const config = SOUND_CONFIGS.thunder
    const audio = new Audio(config.src)
    audio.volume = config.volume * masterVolume

    // Random delay for realistic effect
    setTimeout(() => {
      audio.play().catch(() => {})
    }, 100 + Math.random() * 500)
  }, [isEnabled, isMuted, masterVolume])

  // Toggle sound on/off
  const toggleSound = useCallback(() => {
    setIsEnabled(prev => {
      if (prev) {
        // Stopping - fade out all sounds
        audioRefs.current.forEach((_, type) => stopSound(type))
      }
      return !prev
    })
  }, [stopSound])

  // Handle weather/time changes
  useEffect(() => {
    if (!isEnabled || isMuted) return

    const targetSounds = getSoundsForWeather(condition, timeOfDay)
    const currentSounds = Array.from(audioRefs.current.keys())

    // Stop sounds that should no longer play
    currentSounds.forEach(sound => {
      if (!targetSounds.includes(sound)) {
        stopSound(sound)
      }
    })

    // Start sounds that should play
    targetSounds.forEach(sound => {
      const audio = audioRefs.current.get(sound)
      if (!audio || audio.paused) {
        playSound(sound)
      }
    })
  }, [condition, timeOfDay, isEnabled, isMuted, playSound, stopSound])

  // Update volumes when master volume changes
  useEffect(() => {
    audioRefs.current.forEach((audio, type) => {
      const config = SOUND_CONFIGS[type]
      audio.volume = config.volume * masterVolume
    })
  }, [masterVolume])

  // Auto-start sounds on first user interaction (browser autoplay policy)
  useEffect(() => {
    if (!isEnabled || isMuted) return

    const startOnInteraction = () => {
      const targetSounds = getSoundsForWeather(condition, timeOfDay)
      targetSounds.forEach(sound => {
        const audio = audioRefs.current.get(sound)
        if (!audio || audio.paused) {
          playSound(sound)
        }
      })
      // Remove listeners after first interaction
      document.removeEventListener('click', startOnInteraction)
      document.removeEventListener('keydown', startOnInteraction)
      document.removeEventListener('touchstart', startOnInteraction)
    }

    document.addEventListener('click', startOnInteraction)
    document.addEventListener('keydown', startOnInteraction)
    document.addEventListener('touchstart', startOnInteraction)

    return () => {
      document.removeEventListener('click', startOnInteraction)
      document.removeEventListener('keydown', startOnInteraction)
      document.removeEventListener('touchstart', startOnInteraction)
    }
  }, [isEnabled, isMuted, condition, timeOfDay, playSound])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      audioRefs.current.forEach(audio => {
        audio.pause()
        audio.currentTime = 0
      })
      audioRefs.current.clear()
      fadeTimeouts.current.forEach(timeout => clearTimeout(timeout))
      fadeTimeouts.current.clear()
    }
  }, [])

  return {
    isEnabled,
    isMuted,
    masterVolume,
    toggleSound,
    setMasterVolume,
    playThunder,
  }
}

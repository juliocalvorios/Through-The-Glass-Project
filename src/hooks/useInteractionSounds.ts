'use client'

import { useRef, useCallback, useEffect, useState } from 'react'

interface SoundConfig {
  src: string
  volume: number
  loop?: boolean
  // For sounds that need to play only a portion
  startTime?: number
  endTime?: number
}

const INTERACTION_SOUNDS: Record<string, SoundConfig> = {
  // Curtains - separate files for open and close
  curtainOpen: {
    src: '/sounds/curtains-open.mp3',
    volume: 0.55,
  },
  curtainClose: {
    src: '/sounds/curtains-close.mp3',
    volume: 0.55,
  },
  // Lamp
  lamp: {
    src: '/sounds/lamp-string.mp3',
    volume: 0.6,
  },
  // Wall light switch
  lightSwitch: {
    src: '/sounds/light-switch-382712.mp3',
    volume: 0.7,
  },
  // Clock ticking (looped)
  clockTick: {
    src: '/sounds/slow-cinematic-clock-ticking-405471.mp3',
    volume: 0.15,
    loop: true,
  },
  // Book sound (skip first 0.6s)
  bookDrop: {
    src: '/sounds/book-sound.mp3',
    volume: 0.55,
    startTime: 0.65,
  },
  // Weather switch whoosh (skip first 0.8s)
  weatherSwitch: {
    src: '/sounds/whoose-switch-effect.mp3',
    volume: 0.55,
    startTime: 0.8,
  },
}

type SoundName = keyof typeof INTERACTION_SOUNDS

interface UseInteractionSoundsReturn {
  playSound: (name: SoundName) => void
  stopSound: (name: SoundName) => void
  isPlaying: (name: SoundName) => boolean
  startClockTick: () => void
  stopClockTick: () => void
  setMasterVolume: (volume: number) => void
  isEnabled: boolean
  setEnabled: (enabled: boolean) => void
}

export function useInteractionSounds(initialEnabled = true): UseInteractionSoundsReturn {
  const [isEnabled, setEnabled] = useState(initialEnabled)
  const [masterVolume, setMasterVolume] = useState(0.5)
  const audioRefs = useRef<Map<SoundName, HTMLAudioElement>>(new Map())
  const timeoutRefs = useRef<Map<SoundName, NodeJS.Timeout>>(new Map())

  const playSound = useCallback((name: SoundName) => {
    if (!isEnabled) return

    const config = INTERACTION_SOUNDS[name]

    // Create or reuse audio element
    let audio = audioRefs.current.get(name)
    if (!audio) {
      audio = new Audio(config.src)
      audioRefs.current.set(name, audio)
    }

    // Clear any existing timeout for this sound
    const existingTimeout = timeoutRefs.current.get(name)
    if (existingTimeout) {
      clearTimeout(existingTimeout)
      timeoutRefs.current.delete(name)
    }

    // Reset and configure
    audio.currentTime = config.startTime || 0
    audio.volume = config.volume * masterVolume
    audio.loop = config.loop || false

    // If there's an end time, set up auto-stop
    if (config.endTime !== undefined && !config.loop) {
      const duration = (config.endTime - (config.startTime || 0)) * 1000
      const timeout = setTimeout(() => {
        audio!.pause()
        audio!.currentTime = config.startTime || 0
        timeoutRefs.current.delete(name)
      }, duration)
      timeoutRefs.current.set(name, timeout)
    }

    audio.play().catch(() => {
      // Audio requires user interaction first
    })
  }, [isEnabled, masterVolume])

  const stopSound = useCallback((name: SoundName) => {
    const audio = audioRefs.current.get(name)
    if (audio) {
      audio.pause()
      const config = INTERACTION_SOUNDS[name]
      audio.currentTime = config.startTime || 0
    }

    // Clear timeout if any
    const timeout = timeoutRefs.current.get(name)
    if (timeout) {
      clearTimeout(timeout)
      timeoutRefs.current.delete(name)
    }
  }, [])

  const isPlaying = useCallback((name: SoundName): boolean => {
    const audio = audioRefs.current.get(name)
    return audio ? !audio.paused : false
  }, [])

  const startClockTick = useCallback(() => {
    playSound('clockTick')
  }, [playSound])

  const stopClockTick = useCallback(() => {
    stopSound('clockTick')
  }, [stopSound])

  // Update volumes when master volume changes
  useEffect(() => {
    audioRefs.current.forEach((audio, name) => {
      const config = INTERACTION_SOUNDS[name]
      audio.volume = config.volume * masterVolume
    })
  }, [masterVolume])

  // Stop all sounds when disabled
  useEffect(() => {
    if (!isEnabled) {
      audioRefs.current.forEach((audio) => {
        audio.pause()
      })
    }
  }, [isEnabled])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      audioRefs.current.forEach((audio) => {
        audio.pause()
      })
      audioRefs.current.clear()
      timeoutRefs.current.forEach((timeout) => clearTimeout(timeout))
      timeoutRefs.current.clear()
    }
  }, [])

  return {
    playSound,
    stopSound,
    isPlaying,
    startClockTick,
    stopClockTick,
    setMasterVolume,
    isEnabled,
    setEnabled,
  }
}

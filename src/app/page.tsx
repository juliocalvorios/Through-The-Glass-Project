'use client'

import { useState, useId, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AnalogClock,
  DayNightToggle,
  NordicWindow,
  Stars,
  Aurora,
  Clouds,
  ThreeSnow,
  ThreeRain,
  ThreeSun,
  ThreeFog,
  Bookshelf,
} from '@/components'
import { useLocation, useWeather, useTime, useAmbientSound, useInteractionSounds } from '@/hooks'
import { TimeOfDay, WeatherCondition } from '@/types'

export default function Home() {
  const { location, isLoading: locationLoading } = useLocation()
  const { data: weather, isLoading: weatherLoading } = useWeather(location)
  const time = useTime()

  const isLoading = locationLoading || weatherLoading

  // Override para demo/testing
  const [timeOverride, setTimeOverride] = useState<TimeOfDay | null>(null)
  const [conditionOverride, setConditionOverride] = useState<WeatherCondition | null>(null)
  const [curtainsOpen, setCurtainsOpen] = useState(true)

  // Estado actual (real o override)
  const currentTimeOfDay = timeOverride || time.timeOfDay
  const currentCondition = conditionOverride || weather?.condition || 'clear'
  const isNight = currentTimeOfDay === 'night' || currentTimeOfDay === 'dusk'

  // Ambient sound system
  const { isEnabled: soundEnabled, toggleSound, playThunder } = useAmbientSound(
    currentCondition,
    currentTimeOfDay,
    { enabled: true }
  )

  // Interaction sounds (curtains, switch, clock ticking, lamp)
  const {
    playSound,
    startClockTick,
    stopClockTick,
    setEnabled: setInteractionSoundsEnabled
  } = useInteractionSounds(true)


  // Sync interaction sounds with ambient sound toggle
  useEffect(() => {
    setInteractionSoundsEnabled(soundEnabled)
  }, [soundEnabled, setInteractionSoundsEnabled])

  // Toggle día/noche (with sound)
  const handleTimeToggle = () => {
    playSound('lightSwitch')
    if (timeOverride) {
      setTimeOverride(null)
    } else {
      setTimeOverride(isNight ? 'day' : 'night')
    }
  }

  // Toggle cortinas (with sound)
  const handleCurtainsToggle = () => {
    if (curtainsOpen) {
      playSound('curtainClose')
    } else {
      playSound('curtainOpen')
    }
    setCurtainsOpen(!curtainsOpen)
  }

  // Play lamp sound
  const playLampSound = () => {
    playSound('lamp')
  }

  // Colores de la cabaña de madera roja
  const cabinColors = {
    wall: isNight ? '#1a0d0d' : '#8B4A4A',
    wallLight: isNight ? '#2a1515' : '#A05858',
    wallDark: isNight ? '#120808' : '#6B3636',
    plank: isNight ? '#251212' : '#7A4040',
    groove: isNight ? '#0a0505' : '#4A2525',
  }

  // Loading screen
  if (isLoading) {
    return (
      <main className="relative min-h-screen w-full overflow-hidden flex items-center justify-center bg-neutral-800">
        <div className="w-8 h-8 border-2 border-neutral-600 border-t-neutral-400 rounded-full animate-spin" />
      </main>
    )
  }

  return (
    <main
      className="relative min-h-screen w-full overflow-hidden flex items-center justify-center"
      style={{
        background: cabinColors.wall,
        transition: 'background 1s ease',
      }}
    >
      {/* Pared de madera de cabaña - tablones horizontales */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Tablones de madera */}
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={`plank-${i}`}
            className="absolute left-0 right-0"
            style={{
              top: `${i * 5}%`,
              height: '5.5%',
              background: `linear-gradient(
                90deg,
                ${cabinColors.plank} 0%,
                ${cabinColors.wallLight} 20%,
                ${cabinColors.wall} 40%,
                ${cabinColors.wallLight} 60%,
                ${cabinColors.plank} 80%,
                ${cabinColors.wall} 100%
              )`,
            }}
          >
            {/* Ranura entre tablones */}
            <div
              className="absolute bottom-0 left-0 right-0"
              style={{
                height: '2px',
                background: cabinColors.groove,
                boxShadow: `0 1px 2px ${cabinColors.groove}`,
              }}
            />
          </div>
        ))}

        {/* Textura de veta de madera SVG superpuesta */}
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: isNight ? 0.15 : 0.25 }}>
          <defs>
            <pattern id="woodGrainWall" patternUnits="userSpaceOnUse" width="200" height="20">
              <path
                d="M0,10 Q50,5 100,10 T200,10"
                stroke={isNight ? '#3a2020' : '#5A3030'}
                strokeWidth="0.5"
                fill="none"
                opacity="0.6"
              />
              <path
                d="M0,15 Q50,12 100,15 T200,15"
                stroke={isNight ? '#3a2020' : '#5A3030'}
                strokeWidth="0.3"
                fill="none"
                opacity="0.4"
              />
              <path
                d="M0,5 Q50,8 100,5 T200,5"
                stroke={isNight ? '#3a2020' : '#5A3030'}
                strokeWidth="0.3"
                fill="none"
                opacity="0.3"
              />
              {/* Nudos ocasionales */}
              <ellipse cx="150" cy="10" rx="3" ry="2" fill={isNight ? '#2a1515' : '#4A2828'} opacity="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#woodGrainWall)" />
        </svg>

        {/* Textura de ruido para más realismo */}
        <div
          className="absolute inset-0"
          style={{
            opacity: isNight ? 0.08 : 0.12,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            mixBlendMode: 'multiply',
          }}
        />
      </div>

      {/* Sombra en las esquinas (ambiente de cabaña) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at center, transparent 30%, ${isNight ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.25)'} 100%)
          `,
        }}
      />

      {/* Luz cálida de chimenea/vela en la noche */}
      {isNight && (
        <>
          <motion.div
            className="absolute pointer-events-none"
            style={{
              width: '100%',
              height: '60%',
              bottom: 0,
              left: 0,
              background: 'radial-gradient(ellipse at 50% 100%, rgba(255,140,60,0.12) 0%, transparent 50%)',
            }}
            animate={{
              opacity: [0.5, 0.7, 0.5, 0.6, 0.5],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          {/* Luz más intensa cerca de la ventana */}
          <motion.div
            className="absolute pointer-events-none"
            style={{
              width: 'min(500px, 90vw)',
              height: 'min(300px, 50vh)',
              bottom: '10%',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'radial-gradient(ellipse at center bottom, rgba(255,160,80,0.1) 0%, transparent 60%)',
            }}
            animate={{
              opacity: [0.6, 0.9, 0.6, 0.8, 0.6],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </>
      )}

      {/* Luz del sol entrando (día despejado) */}
      {!isNight && currentCondition === 'clear' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="absolute pointer-events-none"
          style={{
            width: '80vw',
            height: '80vh',
            background: 'radial-gradient(ellipse at 60% 40%, rgba(255,250,220,0.15) 0%, transparent 60%)',
          }}
        />
      )}

      {/* Reloj analógico en la pared (arriba derecha) - oculto en móvil pequeño */}
      <div className="absolute top-8 right-4 sm:top-12 sm:right-6 md:top-20 md:right-8 z-30 hidden sm:block">
        <AnalogClock
          weather={weather}
          timeOfDay={currentTimeOfDay}
          condition={currentCondition}
          onHoverStart={startClockTick}
          onHoverEnd={stopClockTick}
        />
      </div>

      {/* Lámpara de techo (izquierda) - oculta en móvil pequeño */}
      <div className="absolute top-0 left-4 sm:left-8 md:left-16 z-30 hidden sm:block">
        <DayNightToggle
          timeOfDay={currentTimeOfDay}
          isOverride={timeOverride !== null}
          onToggle={handleTimeToggle}
          onPlaySound={playLampSound}
        />
      </div>

      {/* Selector de clima estilo cabaña - centrado debajo de la ventana */}
      <div
        className="absolute z-30"
        style={{
          bottom: 'max(calc(50vh - min(32.5vh, 275px) - 135px), 20px)',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <WeatherSelector
          currentCondition={currentCondition}
          isOverride={conditionOverride !== null}
          onSelect={(c) => setConditionOverride(c === conditionOverride ? null : c)}
          onHoverIcon={() => playSound('weatherSwitch')}
          isNight={isNight}
        />
      </div>

      {/* Sound Toggle Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        onClick={toggleSound}
        className="absolute top-4 left-4 sm:top-8 sm:left-8 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-all"
        style={{
          background: isNight ? 'rgba(42, 24, 24, 0.8)' : 'rgba(107, 58, 58, 0.8)',
          border: `1px solid ${isNight ? '#1a0f0f' : '#4A2525'}`,
          boxShadow: soundEnabled
            ? `0 0 12px ${isNight ? 'rgba(212,165,116,0.4)' : 'rgba(201,168,108,0.4)'}`
            : '0 2px 8px rgba(0,0,0,0.3)',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
      >
        <SoundIcon enabled={soundEnabled} isNight={isNight} />
      </motion.button>

      {/* Mobile Night Toggle - only visible on small screens */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        onClick={handleTimeToggle}
        className="absolute top-4 right-4 z-30 w-8 h-8 rounded-lg flex items-center justify-center transition-all sm:hidden"
        style={{
          background: isNight ? 'rgba(42, 24, 24, 0.8)' : 'rgba(107, 58, 58, 0.8)',
          border: `1px solid ${isNight ? '#1a0f0f' : '#4A2525'}`,
          boxShadow: isNight
            ? '0 0 12px rgba(212,165,116,0.4)'
            : '0 2px 8px rgba(0,0,0,0.3)',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={isNight ? 'Switch to day' : 'Switch to night'}
      >
        <NightToggleIcon isNight={isNight} />
      </motion.button>

      {/* Crédito discreto - esquina inferior derecha */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute bottom-2 right-4 sm:bottom-4 sm:right-6 z-30 group cursor-default"
      >
        <span
          className="relative text-[10px] sm:text-xs tracking-wider"
          style={{
            color: isNight ? 'rgba(212,165,116,0.7)' : 'rgba(201,168,108,0.8)',
            fontFamily: 'Georgia, serif',
            textShadow: isNight ? '0 1px 3px rgba(0,0,0,0.8)' : '0 1px 2px rgba(0,0,0,0.3)',
          }}
        >
          <span className="transition-opacity duration-500 group-hover:opacity-0">
            Through the Glass
          </span>
          <span className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            by Julio Calvo
          </span>
        </span>
      </motion.div>

      {/* Estantería a la izquierda - oculta en móvil y tablet */}
      <div className="absolute bottom-4 left-6 z-30 hidden md:block">
        <Bookshelf
          timeOfDay={currentTimeOfDay}
          onBookHover={() => playSound('bookDrop')}
        />
      </div>

      {/* Interruptor de pared (luz y cortinas) */}
      <WallSwitch
        isNight={isNight}
        lightOn={!isNight}
        curtainsOpen={curtainsOpen}
        onLightToggle={handleTimeToggle}
        onCurtainsToggle={handleCurtainsToggle}
        isLightOverride={timeOverride !== null}
      />

      {/* La ventana Nordic Cozy */}
      <NordicWindow
        timeOfDay={currentTimeOfDay}
        condition={currentCondition}
        curtainsOpen={curtainsOpen}
        onCurtainsToggle={handleCurtainsToggle}
      >
        <WeatherEffects
          condition={currentCondition}
          timeOfDay={currentTimeOfDay}
          onLightningStrike={playThunder}
        />
      </NordicWindow>
    </main>
  )
}

// Wrapper para transiciones smooth
function FadeWrapper({ show, children }: { show: boolean; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: show ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: 'easeInOut' }}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    >
      {children}
    </motion.div>
  )
}

// Efectos del clima con transiciones smooth
function WeatherEffects({
  condition,
  timeOfDay,
  onLightningStrike,
}: {
  condition: WeatherCondition
  timeOfDay: TimeOfDay
  onLightningStrike?: () => void
}) {
  const isNight = timeOfDay === 'night' || timeOfDay === 'dusk'

  return (
    <AnimatePresence mode="wait">
      {/* Estrellas (noche clara) */}
      {isNight && condition !== 'storm' && condition !== 'rain' && condition !== 'fog' && (
        <FadeWrapper key="stars" show={true}>
          <Stars count={condition === 'cloudy' ? 20 : 50} showMoon={condition !== 'aurora'} />
        </FadeWrapper>
      )}

      {/* Aurora Boreal */}
      {condition === 'aurora' && isNight && (
        <FadeWrapper key="aurora" show={true}>
          <Stars count={60} showMoon={false} />
          <Aurora intensity="high" />
        </FadeWrapper>
      )}

      {/* Sol */}
      {!isNight && condition === 'clear' && (
        <FadeWrapper key="sun" show={true}>
          <ThreeSun intensity="bright" />
        </FadeWrapper>
      )}

      {/* Nubes */}
      {condition === 'cloudy' && (
        <FadeWrapper key="clouds" show={true}>
          <Clouds density="moderate" isNight={isNight} />
        </FadeWrapper>
      )}

      {/* Lluvia */}
      {condition === 'rain' && (
        <FadeWrapper key="rain" show={true}>
          <ThreeRain intensity="moderate" />
        </FadeWrapper>
      )}

      {/* Nieve */}
      {condition === 'snow' && (
        <FadeWrapper key="snow" show={true}>
          <ThreeSnow intensity="moderate" isNight={isNight} />
        </FadeWrapper>
      )}

      {/* Niebla */}
      {condition === 'fog' && (
        <FadeWrapper key="fog" show={true}>
          <ThreeFog intensity="moderate" isNight={isNight} />
        </FadeWrapper>
      )}

      {/* Tormenta */}
      {condition === 'storm' && (
        <FadeWrapper key="storm" show={true}>
          <ThreeRain intensity="heavy" isStorm />
        </FadeWrapper>
      )}
    </AnimatePresence>
  )
}

// Selector de clima estilo rústico/cabaña
function WeatherSelector({
  currentCondition,
  isOverride,
  onSelect,
  onHoverIcon,
  isNight,
}: {
  currentCondition: WeatherCondition
  isOverride: boolean
  onSelect: (c: WeatherCondition) => void
  onHoverIcon?: () => void
  isNight: boolean
}) {
  const conditions: { value: WeatherCondition; icon: React.ReactNode; label: string }[] = [
    {
      value: 'clear',
      icon: <SunIcon />,
      label: 'Clear'
    },
    {
      value: 'cloudy',
      icon: <CloudIcon />,
      label: 'Cloudy'
    },
    {
      value: 'rain',
      icon: <RainIcon />,
      label: 'Rain'
    },
    {
      value: 'snow',
      icon: <SnowIcon />,
      label: 'Snow'
    },
    {
      value: 'storm',
      icon: <StormIcon />,
      label: 'Storm'
    },
    {
      value: 'fog',
      icon: <FogIcon />,
      label: 'Fog'
    },
    {
      value: 'aurora',
      icon: <AuroraIcon />,
      label: 'Aurora'
    },
  ]

  // Colores del selector estilo madera
  const selectorColors = {
    bg: isNight ? '#2a1818' : '#6B3A3A',
    bgLight: isNight ? '#3a2222' : '#7A4545',
    border: isNight ? '#1a0f0f' : '#4A2525',
    accent: isNight ? '#D4A574' : '#C9A86C',
    text: isNight ? '#E8D5C4' : '#F5EBE0',
    selected: isNight ? 'rgba(212,165,116,0.25)' : 'rgba(201,168,108,0.3)',
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      {/* Marco de madera del selector */}
      <div
        className="relative p-0.5 sm:p-1 rounded-lg"
        style={{
          background: `linear-gradient(145deg, ${selectorColors.bgLight} 0%, ${selectorColors.bg} 50%, ${selectorColors.border} 100%)`,
          boxShadow: `
            inset 0 1px 0 rgba(255,255,255,0.1),
            0 4px 12px rgba(0,0,0,0.4),
            0 8px 24px rgba(0,0,0,0.2)
          `,
        }}
      >
        {/* Borde interior */}
        <div
          className="p-1.5 sm:p-2 md:p-3 rounded-md flex gap-0.5 sm:gap-1"
          style={{
            background: isNight
              ? 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%)'
              : 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.05) 100%)',
            border: `1px solid ${selectorColors.border}`,
          }}
        >
          {conditions.map(({ value, icon, label }) => {
            const isSelected = currentCondition === value
            return (
              <motion.button
                key={value}
                onClick={() => onSelect(value)}
                onMouseEnter={onHoverIcon}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-md flex items-center justify-center transition-colors"
                style={{
                  background: isSelected ? selectorColors.selected : 'transparent',
                  border: isSelected
                    ? `1px solid ${selectorColors.accent}`
                    : '1px solid transparent',
                  boxShadow: isSelected
                    ? `0 0 8px ${selectorColors.accent}40, inset 0 0 4px ${selectorColors.accent}20`
                    : 'none',
                }}
                title={label}
              >
                <div className="scale-75 sm:scale-90 md:scale-100" style={{ color: isSelected ? selectorColors.accent : selectorColors.text }}>
                  {icon}
                </div>
                {/* Indicador de override */}
                {isOverride && isSelected && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
                    style={{ background: selectorColors.accent }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Textura de madera sutil */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none rounded-lg overflow-hidden" style={{ opacity: 0.15 }}>
        <defs>
          <pattern id="selectorWoodGrain" patternUnits="userSpaceOnUse" width="60" height="8">
            <path
              d="M0,4 Q15,2 30,4 T60,4"
              stroke={isNight ? '#4a2828' : '#3A2020'}
              strokeWidth="0.5"
              fill="none"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#selectorWoodGrain)" />
      </svg>
    </motion.div>
  )
}

// Iconos SVG personalizados para el selector
function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  )
}

function CloudIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    </svg>
  )
}

function RainIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M16 13v8M8 13v8M12 15v8" />
      <path d="M18 8h-1.26A8 8 0 1 0 9 16h9a5 5 0 0 0 0-10z" />
    </svg>
  )
}

function SnowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20" />
      <path d="M2 12h20" />
      <path d="m4.93 4.93 14.14 14.14" />
      <path d="m19.07 4.93-14.14 14.14" />
    </svg>
  )
}

function StormIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9" />
      <polyline points="13 11 9 17 15 17 11 23" />
    </svg>
  )
}

function FogIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 14h16M4 10h16M4 18h16" />
    </svg>
  )
}

function AuroraIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 20c0-8 4-16 8-16s8 8 8 16" />
      <path d="M8 20c0-5 2-10 4-10s4 5 4 10" />
      <path d="M12 20v-6" />
    </svg>
  )
}

// Sound toggle icon
function SoundIcon({ enabled, isNight }: { enabled: boolean; isNight: boolean }) {
  const color = isNight ? '#E8D5C4' : '#F5EBE0'

  if (enabled) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill={color} fillOpacity="0.3" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      </svg>
    )
  }

  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  )
}

// Night toggle icon for mobile
function NightToggleIcon({ isNight }: { isNight: boolean }) {
  const color = isNight ? '#E8D5C4' : '#F5EBE0'

  if (isNight) {
    // Show sun icon when it's night (to switch to day)
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="4" fill={color} fillOpacity="0.3" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </svg>
    )
  }

  // Show moon icon when it's day (to switch to night)
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill={color} fillOpacity="0.3" />
    </svg>
  )
}

// Interruptor de pared estilo cabaña con 2 botones
function WallSwitch({
  isNight,
  lightOn,
  curtainsOpen,
  onLightToggle,
  onCurtainsToggle,
  isLightOverride,
}: {
  isNight: boolean
  lightOn: boolean
  curtainsOpen: boolean
  onLightToggle: () => void
  onCurtainsToggle: () => void
  isLightOverride: boolean
}) {
  const id = useId()
  const colors = {
    plate: isNight ? '#2a1818' : '#6B3A3A',
    plateLight: isNight ? '#3a2222' : '#7A4545',
    plateDark: isNight ? '#1a0f0f' : '#4A2525',
    switch: isNight ? '#3a2828' : '#8B5A5A',
    switchActive: isNight ? '#D4A574' : '#C9A86C',
    screw: isNight ? '#8B7355' : '#A67C52',
    text: isNight ? 'rgba(232,213,196,0.5)' : 'rgba(60,30,20,0.6)',
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="absolute z-50 hidden md:block"
      style={{
        left: 'calc(50vw - min(40vw, 350px) - 120px)',
        top: '42.5%',
      }}
    >
      {/* Placa del interruptor */}
      <div
        className="relative p-2 rounded-lg"
        style={{
          background: `linear-gradient(145deg, ${colors.plateLight} 0%, ${colors.plate} 50%, ${colors.plateDark} 100%)`,
          boxShadow: `
            inset 0 1px 0 rgba(255,255,255,0.08),
            0 4px 12px rgba(0,0,0,0.5),
            0 8px 24px rgba(0,0,0,0.3)
          `,
          width: '70px',
        }}
      >
        {/* Tornillo superior */}
        <div
          className="absolute rounded-full"
          style={{
            width: '8px',
            height: '8px',
            top: '6px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: `radial-gradient(ellipse at 30% 30%, ${colors.screw} 0%, #5a4030 100%)`,
            boxShadow: 'inset 0 -1px 2px rgba(0,0,0,0.4)',
          }}
        >
          {/* Ranura del tornillo */}
          <div
            className="absolute"
            style={{
              width: '6px',
              height: '1px',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) rotate(45deg)',
              background: '#3a2a20',
            }}
          />
        </div>

        {/* Contenedor de los interruptores */}
        <div className="flex flex-col gap-3 mt-4 mb-4">
          {/* Interruptor de luz */}
          <motion.button
            onClick={onLightToggle}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative rounded-md cursor-pointer"
            style={{
              height: '36px',
              background: `linear-gradient(180deg, ${colors.plateDark} 0%, ${colors.plate} 100%)`,
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)',
            }}
            title="Light"
          >
            {/* El switch que se mueve */}
            <motion.div
              animate={{ y: lightOn ? -2 : 2 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-1 rounded flex items-center justify-center"
              style={{
                background: lightOn
                  ? `linear-gradient(180deg, ${colors.switchActive} 0%, #b8956c 100%)`
                  : `linear-gradient(180deg, ${colors.switch} 0%, ${colors.plateDark} 100%)`,
                boxShadow: lightOn
                  ? `0 0 8px rgba(212,165,116,0.5), inset 0 1px 0 rgba(255,255,255,0.2)`
                  : 'inset 0 1px 2px rgba(0,0,0,0.3)',
              }}
            >
              {/* Icono de luz */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={lightOn ? '#2a1818' : colors.text} strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="4" />
                {lightOn && (
                  <>
                    <path d="M12 2v2" />
                    <path d="M12 20v2" />
                    <path d="M4.93 4.93l1.41 1.41" />
                    <path d="M17.66 17.66l1.41 1.41" />
                    <path d="M2 12h2" />
                    <path d="M20 12h2" />
                    <path d="M6.34 17.66l-1.41 1.41" />
                    <path d="M19.07 4.93l-1.41 1.41" />
                  </>
                )}
              </svg>
            </motion.div>

            {/* Indicador de override */}
            {isLightOverride && (
              <motion.div
                className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
                style={{ background: '#8B5CF6', boxShadow: '0 0 6px #8B5CF6' }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </motion.button>

          {/* Interruptor de cortinas */}
          <motion.button
            onClick={onCurtainsToggle}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative rounded-md cursor-pointer"
            style={{
              height: '36px',
              background: `linear-gradient(180deg, ${colors.plateDark} 0%, ${colors.plate} 100%)`,
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)',
            }}
            title="Curtains"
          >
            {/* El switch que se mueve */}
            <motion.div
              animate={{ y: curtainsOpen ? -2 : 2 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-1 rounded flex items-center justify-center"
              style={{
                background: curtainsOpen
                  ? `linear-gradient(180deg, ${colors.switchActive} 0%, #b8956c 100%)`
                  : `linear-gradient(180deg, ${colors.switch} 0%, ${colors.plateDark} 100%)`,
                boxShadow: curtainsOpen
                  ? `0 0 8px rgba(212,165,116,0.5), inset 0 1px 0 rgba(255,255,255,0.2)`
                  : 'inset 0 1px 2px rgba(0,0,0,0.3)',
              }}
            >
              {/* Icono de cortinas */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={curtainsOpen ? '#2a1818' : colors.text} strokeWidth="2" strokeLinecap="round">
                {curtainsOpen ? (
                  <>
                    <line x1="2" y1="3" x2="22" y2="3" />
                    <path d="M4 3v14c0 0 1-2 3-2" />
                    <path d="M20 3v14c0 0-1-2-3-2" />
                  </>
                ) : (
                  <>
                    <line x1="2" y1="3" x2="22" y2="3" />
                    <path d="M6 3v17" />
                    <path d="M10 3v17" />
                    <path d="M14 3v17" />
                    <path d="M18 3v17" />
                  </>
                )}
              </svg>
            </motion.div>
          </motion.button>
        </div>

        {/* Tornillo inferior */}
        <div
          className="absolute rounded-full"
          style={{
            width: '8px',
            height: '8px',
            bottom: '6px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: `radial-gradient(ellipse at 30% 30%, ${colors.screw} 0%, #5a4030 100%)`,
            boxShadow: 'inset 0 -1px 2px rgba(0,0,0,0.4)',
          }}
        >
          {/* Ranura del tornillo */}
          <div
            className="absolute"
            style={{
              width: '6px',
              height: '1px',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) rotate(-45deg)',
              background: '#3a2a20',
            }}
          />
        </div>

        {/* Textura de madera */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none rounded-lg overflow-hidden" style={{ opacity: 0.1 }}>
          <defs>
            <pattern id={`${id}-switchWoodGrain`} patternUnits="userSpaceOnUse" width="40" height="6">
              <path
                d="M0,3 Q10,1 20,3 T40,3"
                stroke={isNight ? '#4a2828' : '#3A2020'}
                strokeWidth="0.5"
                fill="none"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${id}-switchWoodGrain)`} />
        </svg>
      </div>
    </motion.div>
  )
}


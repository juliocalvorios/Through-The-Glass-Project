'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TimeOfDay } from '@/types'

interface CuckooClockProps {
  timeOfDay: TimeOfDay
  design: 1 | 2 | 3 | 4 | 5
}

export function CuckooClock({ timeOfDay, design }: CuckooClockProps) {
  const [isHovered, setIsHovered] = useState(false)
  const isNight = timeOfDay === 'night' || timeOfDay === 'dusk'

  // Get current time
  const now = new Date()
  const hours = now.getHours() % 12
  const minutes = now.getMinutes()
  const hourAngle = (hours + minutes / 60) * 30
  const minuteAngle = minutes * 6

  const designs = {
    // Design 1: Classic Alpine Cuckoo
    1: {
      name: 'Alpine Classic',
      wood: isNight ? '#2a1a1a' : '#5C3A2E',
      woodLight: isNight ? '#3a2525' : '#7A4A3A',
      woodDark: isNight ? '#1a0f0f' : '#3A2218',
      accent: isNight ? '#D4A574' : '#8B5A2B',
      roof: isNight ? '#1a2a1a' : '#2D4A2D',
    },
    // Design 2: Black Forest
    2: {
      name: 'Black Forest',
      wood: isNight ? '#1a1a1a' : '#2E2E2E',
      woodLight: isNight ? '#2a2a2a' : '#4A4A4A',
      woodDark: isNight ? '#0a0a0a' : '#1A1A1A',
      accent: isNight ? '#C9A86C' : '#B8860B',
      roof: isNight ? '#2a1a1a' : '#4A2A1A',
    },
    // Design 3: Swiss Chalet
    3: {
      name: 'Swiss Chalet',
      wood: isNight ? '#2a2015' : '#8B6914',
      woodLight: isNight ? '#3a3020' : '#A07828',
      woodDark: isNight ? '#1a1008' : '#6B4A0A',
      accent: isNight ? '#E8D5C4' : '#F5DEB3',
      roof: isNight ? '#3a1a1a' : '#8B0000',
    },
    // Design 4: Rustic Cabin
    4: {
      name: 'Rustic Cabin',
      wood: isNight ? '#2a1515' : '#6B3A3A',
      woodLight: isNight ? '#3a2020' : '#8B4A4A',
      woodDark: isNight ? '#1a0a0a' : '#4A2525',
      accent: isNight ? '#A08060' : '#CD853F',
      roof: isNight ? '#1a1a2a' : '#2F4F4F',
    },
    // Design 5: Nordic Pine
    5: {
      name: 'Nordic Pine',
      wood: isNight ? '#1a2520' : '#3A5A4A',
      woodLight: isNight ? '#2a3530' : '#4A6A5A',
      woodDark: isNight ? '#0a1510' : '#2A4A3A',
      accent: isNight ? '#F0E8D8' : '#FFFAF0',
      roof: isNight ? '#2a2a2a' : '#4A4A4A',
    },
  }

  const colors = designs[design]

  return (
    <motion.div
      className="relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
    >
      <svg width="120" height="180" viewBox="0 0 120 180">
        <defs>
          <linearGradient id={`wood-${design}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.woodDark} />
            <stop offset="30%" stopColor={colors.wood} />
            <stop offset="70%" stopColor={colors.wood} />
            <stop offset="100%" stopColor={colors.woodDark} />
          </linearGradient>
          <linearGradient id={`roof-${design}`} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={colors.roof} />
            <stop offset="100%" stopColor={colors.woodDark} />
          </linearGradient>
        </defs>

        {/* Roof */}
        <path
          d="M10 55 L60 10 L110 55 Z"
          fill={`url(#roof-${design})`}
          stroke={colors.woodDark}
          strokeWidth="2"
        />

        {/* Roof decoration based on design */}
        {design === 1 && (
          <>
            <path d="M60 10 L60 5" stroke={colors.accent} strokeWidth="2" />
            <circle cx="60" cy="3" r="3" fill={colors.accent} />
          </>
        )}
        {design === 2 && (
          <path d="M55 15 L60 8 L65 15" stroke={colors.accent} strokeWidth="1.5" fill="none" />
        )}
        {design === 3 && (
          <>
            <rect x="55" y="5" width="10" height="8" fill={colors.accent} rx="1" />
            <line x1="60" y1="5" x2="60" y2="0" stroke={colors.woodDark} strokeWidth="1" />
          </>
        )}
        {design === 4 && (
          <circle cx="60" cy="8" r="4" fill={colors.accent} stroke={colors.woodDark} strokeWidth="1" />
        )}
        {design === 5 && (
          <polygon points="60,5 55,15 65,15" fill={colors.accent} />
        )}

        {/* Main body */}
        <rect
          x="15"
          y="50"
          width="90"
          height="100"
          rx="4"
          fill={`url(#wood-${design})`}
          stroke={colors.woodDark}
          strokeWidth="2"
        />

        {/* Decorative frame */}
        <rect
          x="20"
          y="55"
          width="80"
          height="90"
          rx="2"
          fill="none"
          stroke={colors.accent}
          strokeWidth="1"
          opacity="0.5"
        />

        {/* Clock face */}
        <circle
          cx="60"
          cy="90"
          r="30"
          fill={isNight ? '#1a1510' : '#FFF8E7'}
          stroke={colors.accent}
          strokeWidth="2"
        />
        <circle
          cx="60"
          cy="90"
          r="27"
          fill="none"
          stroke={colors.woodDark}
          strokeWidth="1"
          opacity="0.3"
        />

        {/* Hour markers */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180)
          const x1 = 60 + Math.cos(angle) * 22
          const y1 = 90 + Math.sin(angle) * 22
          const x2 = 60 + Math.cos(angle) * 25
          const y2 = 90 + Math.sin(angle) * 25
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={colors.woodDark}
              strokeWidth={i % 3 === 0 ? 2 : 1}
            />
          )
        })}

        {/* Hour hand */}
        <motion.line
          x1="60"
          y1="90"
          x2="60"
          y2="72"
          stroke={colors.woodDark}
          strokeWidth="3"
          strokeLinecap="round"
          style={{
            transformOrigin: '60px 90px',
            transform: `rotate(${hourAngle}deg)`,
          }}
        />

        {/* Minute hand */}
        <motion.line
          x1="60"
          y1="90"
          x2="60"
          y2="66"
          stroke={colors.woodDark}
          strokeWidth="2"
          strokeLinecap="round"
          style={{
            transformOrigin: '60px 90px',
            transform: `rotate(${minuteAngle}deg)`,
          }}
        />

        {/* Center dot */}
        <circle cx="60" cy="90" r="3" fill={colors.accent} />

        {/* Cuckoo door */}
        <rect
          x="52"
          y="125"
          width="16"
          height="12"
          rx="2"
          fill={colors.woodLight}
          stroke={colors.woodDark}
          strokeWidth="1"
        />

        {/* Pendulum rod */}
        <line
          x1="60"
          y1="150"
          x2="60"
          y2="175"
          stroke={colors.woodDark}
          strokeWidth="2"
        />

        {/* Pendulum weight - different shapes per design */}
        {design === 1 && (
          <ellipse cx="60" cy="178" rx="8" ry="5" fill={colors.accent} />
        )}
        {design === 2 && (
          <rect x="52" y="173" width="16" height="6" rx="1" fill={colors.accent} />
        )}
        {design === 3 && (
          <polygon points="60,172 52,180 68,180" fill={colors.accent} />
        )}
        {design === 4 && (
          <circle cx="60" cy="177" r="6" fill={colors.accent} />
        )}
        {design === 5 && (
          <path d="M54 172 L60 180 L66 172 Z" fill={colors.accent} />
        )}

        {/* Side decorations based on design */}
        {design === 1 && (
          <>
            <circle cx="25" cy="145" r="4" fill={colors.accent} opacity="0.6" />
            <circle cx="95" cy="145" r="4" fill={colors.accent} opacity="0.6" />
          </>
        )}
        {design === 2 && (
          <>
            <rect x="18" y="140" width="8" height="12" rx="1" fill={colors.accent} opacity="0.5" />
            <rect x="94" y="140" width="8" height="12" rx="1" fill={colors.accent} opacity="0.5" />
          </>
        )}
        {design === 3 && (
          <>
            <path d="M20 135 Q25 145 20 155" stroke={colors.accent} strokeWidth="2" fill="none" />
            <path d="M100 135 Q95 145 100 155" stroke={colors.accent} strokeWidth="2" fill="none" />
          </>
        )}
        {design === 4 && (
          <>
            <line x1="20" y1="138" x2="20" y2="152" stroke={colors.accent} strokeWidth="3" />
            <line x1="100" y1="138" x2="100" y2="152" stroke={colors.accent} strokeWidth="3" />
          </>
        )}
        {design === 5 && (
          <>
            <polygon points="22,140 18,150 26,150" fill={colors.accent} opacity="0.6" />
            <polygon points="98,140 94,150 102,150" fill={colors.accent} opacity="0.6" />
          </>
        )}
      </svg>

      {/* Cuckoo Bird Animation */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute"
            style={{ top: '68%', left: '50%', transform: 'translateX(-50%)' }}
            initial={{ x: '-50%', y: 10, opacity: 0, scale: 0.5 }}
            animate={{ x: '-50%', y: -5, opacity: 1, scale: 1 }}
            exit={{ x: '-50%', y: 10, opacity: 0, scale: 0.5 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <svg width="24" height="20" viewBox="0 0 24 20">
              {/* Bird body */}
              <ellipse cx="12" cy="12" rx="8" ry="6" fill={colors.accent} />
              {/* Bird head */}
              <circle cx="18" cy="8" r="5" fill={colors.accent} />
              {/* Eye */}
              <circle cx="19" cy="7" r="1.5" fill={colors.woodDark} />
              <circle cx="19.5" cy="6.5" r="0.5" fill="white" />
              {/* Beak */}
              <polygon points="23,8 26,9 23,10" fill={isNight ? '#C9A86C' : '#FF8C00'} />
              {/* Wing */}
              <ellipse cx="10" cy="12" rx="4" ry="3" fill={colors.woodLight} />
              {/* Tail */}
              <polygon points="4,10 0,8 0,14 4,14" fill={colors.woodLight} />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Design name label */}
      <div
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap"
        style={{
          color: isNight ? 'rgba(232,213,196,0.7)' : 'rgba(60,30,20,0.7)',
          fontFamily: 'Georgia, serif',
        }}
      >
        {colors.name}
      </div>
    </motion.div>
  )
}

// Preview component to show all 5 designs
interface CuckooClockPreviewProps {
  timeOfDay: TimeOfDay
  isOpen: boolean
  onClose: () => void
  onSelect: (design: 1 | 2 | 3 | 4 | 5 | null) => void
}

export function CuckooClockPreview({ timeOfDay, isOpen, onClose, onSelect }: CuckooClockPreviewProps) {
  const isNight = timeOfDay === 'night' || timeOfDay === 'dusk'

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center"
      style={{
        zIndex: 99998,
        background: isNight
          ? 'radial-gradient(ellipse at center, rgba(26,15,15,0.95) 0%, rgba(0,0,0,0.98) 100%)'
          : 'radial-gradient(ellipse at center, rgba(74,37,37,0.9) 0%, rgba(0,0,0,0.95) 100%)'
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="relative p-8 rounded-xl"
        style={{
          background: isNight
            ? 'linear-gradient(145deg, #2a1818 0%, #1a0f0f 100%)'
            : 'linear-gradient(145deg, #6B3A3A 0%, #4A2525 100%)',
          boxShadow: '0 25px 80px rgba(0,0,0,0.6)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <h2
          className="text-xl font-medium text-center mb-8 tracking-wider"
          style={{
            color: isNight ? '#D4A574' : '#C9A86C',
            fontFamily: 'Georgia, serif',
          }}
        >
          Cuckoo Clock Designs
        </h2>

        {/* Clock grid */}
        <div className="flex gap-6 flex-wrap justify-center">
          {([1, 2, 3, 4, 5] as const).map((design) => (
            <motion.div
              key={design}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer p-4 rounded-lg transition-colors"
              style={{
                background: isNight ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.1)',
              }}
              onClick={() => onSelect(design)}
            >
              <CuckooClock timeOfDay={timeOfDay} design={design} />
            </motion.div>
          ))}
        </div>

        {/* Back to original button */}
        <div className="flex justify-center mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-lg text-sm"
            style={{
              background: isNight ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.15)',
              color: isNight ? '#E8D5C4' : '#F5EBE0',
              border: `1px solid ${isNight ? 'rgba(212,165,116,0.3)' : 'rgba(201,168,108,0.3)'}`,
            }}
            onClick={() => onSelect(null)}
          >
            Back to Original Clock
          </motion.button>
        </div>

        {/* Close hint */}
        <p
          className="text-center mt-4 text-sm opacity-60"
          style={{ color: isNight ? '#E8D5C4' : '#F5EBE0' }}
        >
          Hover to see the cuckoo! Click to select.
        </p>

        {/* Close button */}
        <motion.button
          className="absolute top-4 right-4 p-2"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke={isNight ? '#D4A574' : '#C9A86C'}
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'

interface CloudsProps {
  density?: 'light' | 'moderate' | 'heavy'
  isNight?: boolean
}

function CloudsComponent({ density = 'moderate', isNight = false }: CloudsProps) {
  const config = {
    light: { clouds: 3, opacity: 0.4 },
    moderate: { clouds: 5, opacity: 0.6 },
    heavy: { clouds: 7, opacity: 0.8 },
  }[density]

  // Cloud color based on time of day
  const cloudColor = isNight ? 'rgb(35, 40, 55)' : 'rgb(200, 205, 215)'
  const cloudShadow = isNight ? 'rgb(25, 30, 40)' : 'rgb(160, 165, 175)'

  // Cloud data with positions and sizes
  const clouds = [
    { top: '5%', left: '10%', scale: 1.2, delay: 0, duration: 45 },
    { top: '15%', left: '60%', scale: 0.8, delay: 2, duration: 50 },
    { top: '8%', left: '35%', scale: 1.0, delay: 5, duration: 55 },
    { top: '20%', left: '80%', scale: 0.7, delay: 8, duration: 40 },
    { top: '12%', left: '5%', scale: 0.9, delay: 10, duration: 48 },
    { top: '25%', left: '45%', scale: 0.6, delay: 12, duration: 52 },
    { top: '18%', left: '25%', scale: 1.1, delay: 15, duration: 46 },
  ].slice(0, config.clouds)

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Slight overcast tint */}
      <div
        className="absolute inset-0"
        style={{
          background: isNight
            ? 'linear-gradient(180deg, rgba(30,35,50,0.4) 0%, transparent 60%)'
            : 'linear-gradient(180deg, rgba(180,185,200,0.3) 0%, transparent 60%)',
        }}
      />

      {/* Individual clouds */}
      {clouds.map((cloud, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: cloud.top,
            left: cloud.left,
            transform: `scale(${cloud.scale})`,
          }}
          initial={{ x: '-10%' }}
          animate={{ x: '110%' }}
          transition={{
            duration: cloud.duration,
            delay: cloud.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {/* Cloud shape using multiple overlapping circles */}
          <div
            className="relative"
            style={{
              opacity: config.opacity,
              filter: 'blur(2px)',
            }}
          >
            {/* Main cloud body */}
            <div
              style={{
                width: 120,
                height: 50,
                background: cloudColor,
                borderRadius: '50px',
                position: 'relative',
              }}
            >
              {/* Cloud puffs */}
              <div
                style={{
                  position: 'absolute',
                  width: 60,
                  height: 60,
                  background: cloudColor,
                  borderRadius: '50%',
                  top: -25,
                  left: 15,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  width: 80,
                  height: 70,
                  background: cloudColor,
                  borderRadius: '50%',
                  top: -35,
                  left: 40,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  width: 50,
                  height: 50,
                  background: cloudColor,
                  borderRadius: '50%',
                  top: -20,
                  left: 75,
                }}
              />
              {/* Shadow/depth on bottom */}
              <div
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '40%',
                  bottom: 0,
                  left: 0,
                  background: `linear-gradient(180deg, transparent 0%, ${cloudShadow} 100%)`,
                  borderRadius: '0 0 50px 50px',
                  opacity: 0.5,
                }}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export const Clouds = memo(CloudsComponent)

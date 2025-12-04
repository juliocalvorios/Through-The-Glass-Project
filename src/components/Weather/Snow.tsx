'use client'

import { memo, useEffect, useRef, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'

interface SnowProps {
  intensity?: 'light' | 'moderate' | 'heavy'
}

interface Snowflake {
  x: number
  y: number
  z: number
  vy: number
  size: number
  opacity: number
  wobblePhase: number
  wobbleSpeed: number
}

function SnowComponent({ intensity = 'moderate' }: SnowProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Snowflake[]>([])
  const animationRef = useRef<number>()
  const windRef = useRef({ x: 0, target: 0 })

  // Reduced particle counts for performance
  const config = useMemo(() => ({
    light: { count: 60, baseSpeed: 0.3 },
    moderate: { count: 100, baseSpeed: 0.5 },
    heavy: { count: 150, baseSpeed: 0.7 },
  })[intensity], [intensity])

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Snowflake[] = []

    for (let i = 0; i < config.count; i++) {
      const z = Math.random()
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z,
        vy: (0.3 + Math.random() * 0.4) * config.baseSpeed * (0.4 + z * 0.6),
        size: 1.5 + z * 2.5,
        opacity: 0.4 + z * 0.5,
        wobblePhase: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.015 + Math.random() * 0.02,
      })
    }

    particlesRef.current = particles
  }, [config])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width: number
    let height: number

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2) // Cap at 2x
      width = rect.width
      height = rect.height
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.scale(dpr, dpr)
      initParticles(width, height)
    }

    resize()
    window.addEventListener('resize', resize)

    const animate = () => {
      ctx.clearRect(0, 0, width, height)

      // Update wind occasionally
      if (Math.random() < 0.003) {
        windRef.current.target = (Math.random() - 0.5) * 1.5
      }
      windRef.current.x += (windRef.current.target - windRef.current.x) * 0.01

      // Simple white fill for all particles
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'

      particlesRef.current.forEach(flake => {
        // Wobble
        flake.wobblePhase += flake.wobbleSpeed
        const wobble = Math.sin(flake.wobblePhase) * 0.5

        // Move
        flake.x += wobble + windRef.current.x * (1 - flake.z * 0.3)
        flake.y += flake.vy

        // Wrap
        if (flake.y > height + 5) {
          flake.y = -5
          flake.x = Math.random() * width
        }
        if (flake.x < -5) flake.x = width + 5
        if (flake.x > width + 5) flake.x = -5

        // Draw simple circle
        ctx.globalAlpha = flake.opacity
        ctx.beginPath()
        ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.globalAlpha = 1
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [config, initParticles])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Winter atmosphere */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, rgba(200, 220, 255, 0.05) 0%, transparent 50%)',
        }}
      />

      {/* Snow canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Simple snow accumulation */}
      <SnowAccumulation intensity={intensity} />
    </div>
  )
}

function SnowAccumulation({ intensity }: { intensity: string }) {
  const height = intensity === 'heavy' ? 20 : intensity === 'moderate' ? 12 : 8

  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height, opacity: 1 }}
      transition={{ duration: 5, ease: 'easeOut' }}
      style={{
        background: 'linear-gradient(to top, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.7) 60%, transparent 100%)',
        borderRadius: '100% 100% 0 0 / 50% 50% 0 0',
      }}
    />
  )
}

export const Snow = memo(SnowComponent)

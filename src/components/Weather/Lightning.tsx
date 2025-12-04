'use client'

import { memo, useEffect, useRef, useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LightningProps {
  frequency?: number
  onStrike?: () => void
}

interface LightningBolt {
  segments: { x: number; y: number }[]
  branches: { x: number; y: number }[][]
  alpha: number
}

function LightningComponent({ frequency = 5, onStrike }: LightningProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [flashIntensity, setFlashIntensity] = useState(0)
  const boltsRef = useRef<LightningBolt[]>([])
  const animationRef = useRef<number>()

  // Generate lightning bolt with simple subdivision
  const generateBolt = useCallback((
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    displacement: number
  ): { segments: { x: number; y: number }[]; branches: { x: number; y: number }[][] } => {
    const segments: { x: number; y: number }[] = [{ x: startX, y: startY }]
    const branches: { x: number; y: number }[][] = []

    // Simple recursive subdivision
    const subdivide = (
      x1: number, y1: number,
      x2: number, y2: number,
      disp: number,
      level: number
    ): { x: number; y: number }[] => {
      if (level > 5 || disp < 3) {
        return [{ x: x2, y: y2 }]
      }

      const mx = (x1 + x2) / 2 + (Math.random() - 0.5) * disp
      const my = (y1 + y2) / 2

      // Maybe add a branch
      if (level > 1 && level < 4 && Math.random() < 0.3) {
        const branchLen = (endY - startY) * 0.2
        const branchX = mx + (Math.random() - 0.5) * disp * 2
        const branchY = my + branchLen
        branches.push([
          { x: mx, y: my },
          { x: (mx + branchX) / 2 + (Math.random() - 0.5) * 20, y: (my + branchY) / 2 },
          { x: branchX, y: branchY }
        ])
      }

      const left = subdivide(x1, y1, mx, my, disp * 0.6, level + 1)
      const right = subdivide(mx, my, x2, y2, disp * 0.6, level + 1)

      return [...left, ...right]
    }

    segments.push(...subdivide(startX, startY, endX, endY, displacement, 0))
    return { segments, branches }
  }, [])

  // Draw bolt - NO blur filters!
  const drawBolt = useCallback((
    ctx: CanvasRenderingContext2D,
    segments: { x: number; y: number }[],
    alpha: number,
    lineWidth: number
  ) => {
    if (segments.length < 2) return

    // Glow layer (thicker, semi-transparent)
    ctx.beginPath()
    ctx.moveTo(segments[0].x, segments[0].y)
    for (let i = 1; i < segments.length; i++) {
      ctx.lineTo(segments[i].x, segments[i].y)
    }
    ctx.strokeStyle = `rgba(150, 180, 255, ${alpha * 0.4})`
    ctx.lineWidth = lineWidth * 4
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.stroke()

    // Core (bright white)
    ctx.beginPath()
    ctx.moveTo(segments[0].x, segments[0].y)
    for (let i = 1; i < segments.length; i++) {
      ctx.lineTo(segments[i].x, segments[i].y)
    }
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`
    ctx.lineWidth = lineWidth
    ctx.stroke()
  }, [])

  // Trigger lightning
  const triggerLightning = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const width = rect.width
    const height = rect.height

    const startX = width * (0.3 + Math.random() * 0.4)
    const endX = startX + (Math.random() - 0.5) * width * 0.2

    const { segments, branches } = generateBolt(startX, 0, endX, height, 80)

    boltsRef.current = [{
      segments,
      branches,
      alpha: 1,
    }]

    // Flash sequence
    const flash = async () => {
      setFlashIntensity(0.7)
      await new Promise(r => setTimeout(r, 50))
      setFlashIntensity(0.2)
      await new Promise(r => setTimeout(r, 40))
      setFlashIntensity(0.5)
      await new Promise(r => setTimeout(r, 60))
      setFlashIntensity(0)
    }

    flash()
    onStrike?.()

    // Fade out
    const fadeOut = () => {
      boltsRef.current = boltsRef.current
        .map(b => ({ ...b, alpha: b.alpha * 0.8 }))
        .filter(b => b.alpha > 0.02)

      if (boltsRef.current.length > 0) {
        requestAnimationFrame(fadeOut)
      }
    }
    setTimeout(fadeOut, 80)
  }, [generateBolt, onStrike])

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener('resize', resize)

    const animate = () => {
      const rect = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)

      boltsRef.current.forEach(bolt => {
        drawBolt(ctx, bolt.segments, bolt.alpha, 2)
        bolt.branches.forEach(branch => {
          drawBolt(ctx, branch, bolt.alpha * 0.6, 1)
        })
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [drawBolt])

  // Schedule strikes
  useEffect(() => {
    let timeout: NodeJS.Timeout

    const scheduleNext = () => {
      const delay = (frequency * 0.5 + Math.random() * frequency) * 1000
      timeout = setTimeout(() => {
        triggerLightning()
        scheduleNext()
      }, delay)
    }

    timeout = setTimeout(() => {
      triggerLightning()
      scheduleNext()
    }, 2000 + Math.random() * 2000)

    return () => clearTimeout(timeout)
  }, [frequency, triggerLightning])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Storm gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, rgba(20, 25, 40, 0.3) 0%, transparent 50%)',
        }}
      />

      {/* Flash overlay */}
      <AnimatePresence>
        {flashIntensity > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: flashIntensity }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.03 }}
            className="absolute inset-0 z-40"
            style={{
              background: `radial-gradient(ellipse at 50% 20%, rgba(200, 220, 255, ${flashIntensity}) 0%, transparent 70%)`,
            }}
          />
        )}
      </AnimatePresence>

      {/* Lightning canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-50"
      />
    </div>
  )
}

export const Lightning = memo(LightningComponent)

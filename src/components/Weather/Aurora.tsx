'use client'

import { memo, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface AuroraProps {
  intensity?: 'low' | 'medium' | 'high'
}

function AuroraComponent({ intensity = 'medium' }: AuroraProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Configuración según intensidad
  const config = {
    low: { waves: 2, opacity: 0.4, speed: 0.3 },
    medium: { waves: 3, opacity: 0.6, speed: 0.5 },
    high: { waves: 4, opacity: 0.8, speed: 0.7 },
  }[intensity]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Ajustar tamaño del canvas
    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()
    window.addEventListener('resize', resize)

    let animationId: number
    let time = 0

    // Colores de la aurora (verde esmeralda, cyan, magenta, azul)
    const auroraColors = [
      { r: 46, g: 204, b: 113, a: 0.6 },   // Verde esmeralda
      { r: 26, g: 188, b: 156, a: 0.5 },   // Turquesa
      { r: 52, g: 152, b: 219, a: 0.4 },   // Azul
      { r: 155, g: 89, b: 182, a: 0.5 },   // Púrpura
      { r: 46, g: 204, b: 113, a: 0.3 },   // Verde claro
    ]

    const animate = () => {
      const width = canvas.offsetWidth
      const height = canvas.offsetHeight

      // Limpiar con fade (deja estela)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.03)'
      ctx.fillRect(0, 0, width, height)

      // Dibujar ondas de aurora
      for (let w = 0; w < config.waves; w++) {
        const color = auroraColors[w % auroraColors.length]
        const waveOffset = w * 0.5
        const yBase = height * (0.2 + w * 0.15)

        ctx.beginPath()
        ctx.moveTo(0, height)

        // Crear forma ondulada
        for (let x = 0; x <= width; x += 5) {
          const noise1 = Math.sin((x * 0.008) + time * config.speed + waveOffset) * 40
          const noise2 = Math.sin((x * 0.015) + time * config.speed * 0.7 + waveOffset) * 25
          const noise3 = Math.sin((x * 0.003) + time * config.speed * 0.3 + waveOffset) * 60

          const y = yBase + noise1 + noise2 + noise3

          if (x === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }

        // Cerrar la forma
        ctx.lineTo(width, 0)
        ctx.lineTo(0, 0)
        ctx.closePath()

        // Gradiente vertical para la aurora
        const gradient = ctx.createLinearGradient(0, 0, 0, yBase + 100)
        gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`)
        gradient.addColorStop(0.3, `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a * config.opacity * 0.3})`)
        gradient.addColorStop(0.5, `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a * config.opacity})`)
        gradient.addColorStop(0.7, `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a * config.opacity * 0.5})`)
        gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`)

        ctx.fillStyle = gradient
        ctx.fill()
      }

      // Añadir "cortinas" verticales de luz
      const curtainCount = 8 + Math.floor(Math.random() * 4)
      for (let i = 0; i < curtainCount; i++) {
        const x = (width / curtainCount) * i + Math.sin(time * 0.5 + i) * 30
        const curtainHeight = height * (0.3 + Math.sin(time * 0.3 + i * 0.5) * 0.2)

        const curtainGradient = ctx.createLinearGradient(x, 0, x, curtainHeight)
        const hue = 140 + Math.sin(time * 0.2 + i) * 40 // Verde a cyan

        curtainGradient.addColorStop(0, `hsla(${hue}, 70%, 50%, 0)`)
        curtainGradient.addColorStop(0.3, `hsla(${hue}, 70%, 50%, ${0.1 * config.opacity})`)
        curtainGradient.addColorStop(0.6, `hsla(${hue}, 70%, 60%, ${0.2 * config.opacity})`)
        curtainGradient.addColorStop(1, `hsla(${hue}, 70%, 50%, 0)`)

        ctx.beginPath()
        ctx.moveTo(x - 15, 0)
        ctx.lineTo(x + 15, 0)
        ctx.lineTo(x + 10 + Math.sin(time + i) * 5, curtainHeight)
        ctx.lineTo(x - 10 + Math.sin(time + i) * 5, curtainHeight)
        ctx.closePath()
        ctx.fillStyle = curtainGradient
        ctx.fill()
      }

      time += 0.016
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [intensity, config])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Canvas para la aurora animada */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          mixBlendMode: 'screen',
          opacity: config.opacity,
        }}
      />

      {/* Capa de gradientes CSS adicionales para más profundidad */}
      <motion.div
        className="absolute inset-0"
        animate={{
          opacity: [0.3, 0.5, 0.3, 0.4, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 20% 20%, rgba(46, 204, 113, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 80% 30%, rgba(155, 89, 182, 0.12) 0%, transparent 50%),
            radial-gradient(ellipse 70% 45% at 50% 10%, rgba(52, 152, 219, 0.1) 0%, transparent 50%)
          `,
          mixBlendMode: 'screen',
        }}
      />

      {/* Ondas de color que se mueven */}
      <motion.div
        className="absolute inset-0"
        animate={{
          backgroundPosition: ['0% 0%', '100% 50%', '0% 100%', '0% 0%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          background: `
            linear-gradient(
              25deg,
              transparent 0%,
              transparent 30%,
              rgba(46, 204, 113, 0.08) 35%,
              rgba(26, 188, 156, 0.1) 40%,
              transparent 50%,
              transparent 100%
            )
          `,
          backgroundSize: '200% 200%',
          mixBlendMode: 'screen',
        }}
      />

      <motion.div
        className="absolute inset-0"
        animate={{
          backgroundPosition: ['100% 0%', '0% 50%', '100% 100%', '100% 0%'],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          background: `
            linear-gradient(
              -15deg,
              transparent 0%,
              transparent 40%,
              rgba(155, 89, 182, 0.06) 45%,
              rgba(52, 152, 219, 0.08) 50%,
              transparent 60%,
              transparent 100%
            )
          `,
          backgroundSize: '200% 200%',
          mixBlendMode: 'screen',
        }}
      />

      {/* Destellos ocasionales */}
      <motion.div
        className="absolute inset-0"
        animate={{
          opacity: [0, 0, 0.15, 0, 0, 0.1, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          times: [0, 0.3, 0.35, 0.4, 0.7, 0.75, 1],
        }}
        style={{
          background: 'radial-gradient(ellipse 40% 30% at 60% 20%, rgba(46, 204, 113, 0.3) 0%, transparent 70%)',
          mixBlendMode: 'screen',
        }}
      />
    </div>
  )
}

export const Aurora = memo(AuroraComponent)

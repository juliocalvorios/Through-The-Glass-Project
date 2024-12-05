'use client'

import { memo, useEffect, useRef } from 'react'
import * as THREE from 'three'

interface ThreeRainProps {
  intensity?: 'light' | 'moderate' | 'heavy'
  isStorm?: boolean
}

function ThreeRainComponent({ intensity = 'moderate', isStorm = false }: ThreeRainProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    rainLines: THREE.LineSegments
    flash: THREE.PointLight | null
    animationId: number
  } | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    const rainCount = {
      light: 1000,
      moderate: 2000,
      heavy: 4000,
    }[intensity]

    // Scene
    const scene = new THREE.Scene()

    // Camera angled to see rain falling
    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000)
    camera.position.set(0, 0, 100)
    camera.lookAt(0, 0, 0)

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)

    // Lightning flash (only for storm)
    let flash: THREE.PointLight | null = null
    if (isStorm) {
      flash = new THREE.PointLight(0x88aaff, 0, 500, 1.5)
      flash.position.set(0, 100, 50)
      scene.add(flash)
    }

    // Rain as line segments (not points!)
    const positions = new Float32Array(rainCount * 6) // 2 vertices per line
    const velocities: number[] = []

    for (let i = 0; i < rainCount; i++) {
      const x = (Math.random() - 0.5) * 300
      const y = Math.random() * 200 - 100
      const z = (Math.random() - 0.5) * 200

      // Line start
      positions[i * 6] = x
      positions[i * 6 + 1] = y
      positions[i * 6 + 2] = z

      // Line end (slightly below start - creates streak)
      const streakLength = 3 + Math.random() * 5
      positions[i * 6 + 3] = x + 0.3 // slight angle
      positions[i * 6 + 4] = y - streakLength
      positions[i * 6 + 5] = z

      velocities.push(0.4 + Math.random() * 0.4) // fall speed - much slower!
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const material = new THREE.LineBasicMaterial({
      color: isStorm ? 0x8899bb : 0xaabbdd,
      transparent: true,
      opacity: isStorm ? 0.5 : 0.4,
      linewidth: 1,
    })

    const rainLines = new THREE.LineSegments(geometry, material)
    scene.add(rainLines)

    sceneRef.current = {
      scene,
      camera,
      renderer,
      rainLines,
      flash,
      animationId: 0,
    }

    let flashCooldown = 0

    const animate = () => {
      if (!sceneRef.current) return
      const { renderer, scene, camera, rainLines, flash } = sceneRef.current

      // Move rain down
      const positions = rainLines.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < rainCount; i++) {
        const i6 = i * 6
        const speed = velocities[i]

        // Move both start and end points
        positions[i6 + 1] -= speed
        positions[i6 + 4] -= speed

        // Reset when below view
        if (positions[i6 + 1] < -100) {
          const newY = 100 + Math.random() * 50
          const streakLength = 3 + Math.random() * 5
          positions[i6 + 1] = newY
          positions[i6 + 4] = newY - streakLength

          // Randomize X position
          const newX = (Math.random() - 0.5) * 300
          positions[i6] = newX
          positions[i6 + 3] = newX + 0.3
        }
      }
      rainLines.geometry.attributes.position.needsUpdate = true

      // Lightning flash for storm
      if (isStorm && flash) {
        flashCooldown--
        if (flash.intensity > 0.5) {
          flash.intensity *= 0.85
          if (flash.intensity < 0.5) flash.intensity = 0
        } else if (flashCooldown <= 0 && Math.random() > 0.992) {
          flash.position.set(
            (Math.random() - 0.5) * 200,
            80 + Math.random() * 40,
            50
          )
          flash.intensity = 3 + Math.random() * 5
          flashCooldown = 30 + Math.random() * 90
        }
      }

      renderer.render(scene, camera)
      sceneRef.current.animationId = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      if (!containerRef.current || !sceneRef.current) return
      const { camera, renderer } = sceneRef.current
      const w = containerRef.current.clientWidth
      const h = containerRef.current.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId)
        sceneRef.current.renderer.dispose()
        sceneRef.current.rainLines.geometry.dispose()
        if (container.contains(sceneRef.current.renderer.domElement)) {
          container.removeChild(sceneRef.current.renderer.domElement)
        }
      }
      sceneRef.current = null
    }
  }, [intensity, isStorm])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 10 }}
    />
  )
}

export const ThreeRain = memo(ThreeRainComponent)

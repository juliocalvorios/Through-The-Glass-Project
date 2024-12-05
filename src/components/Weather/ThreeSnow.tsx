'use client'

import { memo, useEffect, useRef } from 'react'
import * as THREE from 'three'

interface ThreeSnowProps {
  intensity?: 'light' | 'moderate' | 'heavy'
  isNight?: boolean
}

function ThreeSnowComponent({ intensity = 'moderate', isNight = false }: ThreeSnowProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    snow: THREE.Points
    snowGeo: THREE.BufferGeometry
    animationId: number
  } | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    // Snow count based on intensity
    const snowCount = {
      light: 3000,
      moderate: 6000,
      heavy: 10000,
    }[intensity]

    // Scene setup - NO background, transparent
    const scene = new THREE.Scene()

    // Camera looking slightly down at the snow
    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000)
    camera.position.z = 1
    camera.rotation.x = 1.16
    camera.rotation.y = -0.12
    camera.rotation.z = 0.27

    // Renderer with transparency
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true, // Transparent background!
      powerPreference: 'high-performance'
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0) // Fully transparent
    container.appendChild(renderer.domElement)

    // Soft ambient light
    const ambient = new THREE.AmbientLight(isNight ? 0x334455 : 0x888899, 1)
    scene.add(ambient)

    // Snow particles
    const snowGeo = new THREE.BufferGeometry()
    const positions = new Float32Array(snowCount * 3)
    const sizes = new Float32Array(snowCount)
    const velocities: number[] = []

    for (let i = 0; i < snowCount; i++) {
      positions[i * 3] = Math.random() * 400 - 200     // x
      positions[i * 3 + 1] = Math.random() * 500 - 250 // y
      positions[i * 3 + 2] = Math.random() * 400 - 200 // z

      // Vary sizes for depth effect
      sizes[i] = Math.random() * 2 + 0.5

      // Store velocity for each flake
      velocities.push(0.3 + Math.random() * 0.5) // fall speed
      velocities.push((Math.random() - 0.5) * 0.3) // drift x
      velocities.push((Math.random() - 0.5) * 0.1) // drift z
    }

    snowGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    snowGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    // Create circular snowflake texture
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    const ctx = canvas.getContext('2d')!
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)')
    gradient.addColorStop(0.7, 'rgba(220, 235, 255, 0.3)')
    gradient.addColorStop(1, 'rgba(200, 220, 255, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 32, 32)

    const snowTexture = new THREE.CanvasTexture(canvas)

    const snowMaterial = new THREE.PointsMaterial({
      size: 3,
      map: snowTexture,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    })

    const snow = new THREE.Points(snowGeo, snowMaterial)
    scene.add(snow)

    // Store refs
    sceneRef.current = {
      scene,
      camera,
      renderer,
      snow,
      snowGeo,
      animationId: 0,
    }

    // Wind effect
    let windX = 0
    let windTarget = 0

    // Animation
    const animate = () => {
      if (!sceneRef.current) return

      const { snow, snowGeo, renderer, scene, camera } = sceneRef.current

      // Update wind occasionally
      if (Math.random() < 0.005) {
        windTarget = (Math.random() - 0.5) * 2
      }
      windX += (windTarget - windX) * 0.01

      // Move snow
      const positions = snowGeo.attributes.position.array as Float32Array
      for (let i = 0; i < snowCount; i++) {
        const i3 = i * 3
        const vel = i * 3

        // Fall down with slight drift
        positions[i3] += velocities[vel + 1] + windX * 0.1 // x drift + wind
        positions[i3 + 1] -= velocities[vel] // y fall
        positions[i3 + 2] += velocities[vel + 2] // z drift

        // Add wobble
        positions[i3] += Math.sin(Date.now() * 0.001 + i) * 0.02

        // Reset snowflake when it falls below view
        if (positions[i3 + 1] < -250) {
          positions[i3 + 1] = 250
          positions[i3] = Math.random() * 400 - 200
          positions[i3 + 2] = Math.random() * 400 - 200
        }

        // Wrap horizontally
        if (positions[i3] < -200) positions[i3] = 200
        if (positions[i3] > 200) positions[i3] = -200
      }
      snowGeo.attributes.position.needsUpdate = true

      renderer.render(scene, camera)
      sceneRef.current.animationId = requestAnimationFrame(animate)
    }

    animate()

    // Handle resize
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

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId)
        sceneRef.current.renderer.dispose()
        sceneRef.current.snowGeo.dispose()
        if (container.contains(sceneRef.current.renderer.domElement)) {
          container.removeChild(sceneRef.current.renderer.domElement)
        }
      }
      sceneRef.current = null
    }
  }, [intensity, isNight])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 10 }}
    />
  )
}

export const ThreeSnow = memo(ThreeSnowComponent)

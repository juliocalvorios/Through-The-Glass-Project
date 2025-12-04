'use client'

import { memo, useEffect, useRef } from 'react'
import * as THREE from 'three'

interface ThreeStormProps {
  intensity?: 'light' | 'moderate' | 'heavy'
  onFlash?: () => void
}

function ThreeStormComponent({ intensity = 'moderate', onFlash }: ThreeStormProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    rain: THREE.Points
    rainGeo: THREE.BufferGeometry
    flash: THREE.PointLight
    clouds: THREE.Mesh[]
    animationId: number
  } | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    // Rain count based on intensity
    const rainCount = {
      light: 5000,
      moderate: 10000,
      heavy: 15000,
    }[intensity]

    // Scene setup
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x0a0a12, 0.002)

    // Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000)
    camera.position.z = 1
    camera.rotation.x = 1.16
    camera.rotation.y = -0.12
    camera.rotation.z = 0.27

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance'
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x0a0a12, 0.3)
    container.appendChild(renderer.domElement)

    // Lighting
    const ambient = new THREE.AmbientLight(0x444455)
    scene.add(ambient)

    const directionalLight = new THREE.DirectionalLight(0x6677aa)
    directionalLight.position.set(0, 0, 1)
    scene.add(directionalLight)

    // Lightning flash light
    const flash = new THREE.PointLight(0x4488ff, 30, 500, 1.7)
    flash.position.set(200, 300, 100)
    scene.add(flash)

    // Rain particles
    const rainGeo = new THREE.BufferGeometry()
    const positions = new Float32Array(rainCount * 3)
    const velocities = new Float32Array(rainCount)

    for (let i = 0; i < rainCount; i++) {
      positions[i * 3] = Math.random() * 400 - 200     // x
      positions[i * 3 + 1] = Math.random() * 500 - 250 // y
      positions[i * 3 + 2] = Math.random() * 400 - 200 // z
      velocities[i] = 0.5 + Math.random() * 0.5
    }

    rainGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const rainMaterial = new THREE.PointsMaterial({
      color: 0xaaccff,
      size: 0.15,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    })

    const rain = new THREE.Points(rainGeo, rainMaterial)
    scene.add(rain)

    // Clouds - using simple planes with opacity
    const clouds: THREE.Mesh[] = []
    const cloudGeo = new THREE.PlaneGeometry(300, 300)
    const cloudMaterial = new THREE.MeshLambertMaterial({
      color: 0x222233,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide,
    })

    for (let i = 0; i < 15; i++) {
      const cloud = new THREE.Mesh(cloudGeo, cloudMaterial.clone())
      cloud.position.set(
        Math.random() * 800 - 400,
        400 + Math.random() * 100,
        Math.random() * 500 - 500
      )
      cloud.rotation.x = 1.16
      cloud.rotation.y = -0.12
      cloud.rotation.z = Math.random() * Math.PI * 2
      ;(cloud.material as THREE.MeshLambertMaterial).opacity = 0.3 + Math.random() * 0.3
      clouds.push(cloud)
      scene.add(cloud)
    }

    // Store refs
    sceneRef.current = {
      scene,
      camera,
      renderer,
      rain,
      rainGeo,
      flash,
      clouds,
      animationId: 0,
    }

    // Animation
    let flashCooldown = 0

    const animate = () => {
      if (!sceneRef.current) return

      const { flash, clouds, rain, rainGeo, renderer, scene, camera } = sceneRef.current

      // Rotate clouds slowly
      clouds.forEach((cloud) => {
        cloud.rotation.z -= 0.001
      })

      // Move rain
      const positions = rainGeo.attributes.position.array as Float32Array
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] -= 2 + Math.random() * 2 // y - falling
        positions[i] += Math.random() * 0.2 - 0.1 // x - slight drift

        // Reset rain drop when it falls below view
        if (positions[i + 1] < -250) {
          positions[i + 1] = 250
          positions[i] = Math.random() * 400 - 200
          positions[i + 2] = Math.random() * 400 - 200
        }
      }
      rainGeo.attributes.position.needsUpdate = true

      // Lightning flash
      flashCooldown--
      if (flash.power > 100) {
        flash.power *= 0.9
        if (flash.power < 100) {
          flash.power = 0
        }
      } else if (flashCooldown <= 0 && Math.random() > 0.97) {
        flash.position.set(
          Math.random() * 400 - 200,
          300 + Math.random() * 200,
          100
        )
        flash.power = 100 + Math.random() * 400
        flashCooldown = 30 + Math.random() * 60
        onFlash?.()
      }

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
        sceneRef.current.rainGeo.dispose()
        container.removeChild(sceneRef.current.renderer.domElement)
      }
      sceneRef.current = null
    }
  }, [intensity, onFlash])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
    />
  )
}

export const ThreeStorm = memo(ThreeStormComponent)

'use client'

import { memo, useEffect, useRef } from 'react'
import * as THREE from 'three'

interface ThreeAuroraProps {
  intensity?: 'low' | 'medium' | 'high'
}

function ThreeAuroraComponent({ intensity = 'medium' }: ThreeAuroraProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    auroras: THREE.Mesh[]
    animationId: number
  } | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    const config = {
      low: { bands: 2, particles: 300, speed: 0.3 },
      medium: { bands: 3, particles: 500, speed: 0.5 },
      high: { bands: 5, particles: 800, speed: 0.7 },
    }[intensity]

    // Scene
    const scene = new THREE.Scene()

    // Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000)
    camera.position.z = 300

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)

    // Aurora colors
    const auroraColors = [
      new THREE.Color(0x00ff88), // Green
      new THREE.Color(0x00ffcc), // Cyan-green
      new THREE.Color(0x88ff00), // Yellow-green
      new THREE.Color(0xff00ff), // Magenta
      new THREE.Color(0x00ccff), // Cyan
    ]

    // Create aurora bands using custom shader-like planes
    const auroras: THREE.Mesh[] = []

    for (let b = 0; b < config.bands; b++) {
      const bandHeight = 120 + Math.random() * 60
      const bandWidth = width * 1.5
      const segments = 64

      // Create a wavy plane
      const geometry = new THREE.PlaneGeometry(bandWidth, bandHeight, segments, 8)
      const positions = geometry.attributes.position.array as Float32Array

      // Store original positions for animation
      const originalY: number[] = []
      for (let i = 0; i < positions.length; i += 3) {
        originalY.push(positions[i + 1])
      }

      // Custom shader material for aurora effect
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color1: { value: auroraColors[b % auroraColors.length] },
          color2: { value: auroraColors[(b + 1) % auroraColors.length] },
          opacity: { value: 0.4 + Math.random() * 0.2 },
        },
        vertexShader: `
          uniform float time;
          varying vec2 vUv;
          varying float vWave;

          void main() {
            vUv = uv;
            vec3 pos = position;

            // Wave animation
            float wave = sin(pos.x * 0.02 + time) * 20.0;
            wave += sin(pos.x * 0.01 + time * 0.5) * 30.0;
            pos.y += wave;

            // Vertical curtain effect
            pos.z += sin(pos.x * 0.03 + time * 0.7) * 15.0;

            vWave = wave / 50.0;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 color1;
          uniform vec3 color2;
          uniform float opacity;
          uniform float time;
          varying vec2 vUv;
          varying float vWave;

          void main() {
            // Gradient from bottom to top
            float gradient = smoothstep(0.0, 1.0, vUv.y);

            // Mix colors based on position and wave
            vec3 color = mix(color1, color2, vUv.x + vWave * 0.5);

            // Fade out at edges
            float edgeFade = smoothstep(0.0, 0.2, vUv.x) * smoothstep(1.0, 0.8, vUv.x);

            // Vertical fade - stronger at bottom, fading at top
            float verticalFade = pow(1.0 - gradient, 0.5);

            // Shimmer effect
            float shimmer = sin(vUv.x * 50.0 + time * 2.0) * 0.1 + 0.9;

            float alpha = opacity * edgeFade * verticalFade * shimmer;

            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
      })

      const aurora = new THREE.Mesh(geometry, material)
      aurora.position.set(
        (Math.random() - 0.5) * 100,
        height * 0.15 + b * 30,
        -50 - b * 20
      )
      aurora.userData = { originalY, speed: 0.5 + Math.random() * 0.5 }
      auroras.push(aurora)
      scene.add(aurora)
    }

    // Add some stars in the background
    const starGeo = new THREE.BufferGeometry()
    const starPositions = new Float32Array(200 * 3)
    for (let i = 0; i < 200; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * width * 2
      starPositions[i * 3 + 1] = Math.random() * height * 0.8
      starPositions[i * 3 + 2] = -100 - Math.random() * 100
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))

    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.5,
      transparent: true,
      opacity: 0.6,
    })
    const stars = new THREE.Points(starGeo, starMat)
    scene.add(stars)

    sceneRef.current = {
      scene,
      camera,
      renderer,
      auroras,
      animationId: 0,
    }

    let time = 0

    const animate = () => {
      if (!sceneRef.current) return
      const { renderer, scene, camera, auroras } = sceneRef.current

      time += 0.01 * config.speed

      // Update aurora shaders
      auroras.forEach((aurora) => {
        const material = aurora.material as THREE.ShaderMaterial
        material.uniforms.time.value = time * aurora.userData.speed

        // Subtle horizontal drift
        aurora.position.x += Math.sin(time * 0.2) * 0.1
      })

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
        if (container.contains(sceneRef.current.renderer.domElement)) {
          container.removeChild(sceneRef.current.renderer.domElement)
        }
      }
      sceneRef.current = null
    }
  }, [intensity])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 10 }}
    />
  )
}

export const ThreeAurora = memo(ThreeAuroraComponent)

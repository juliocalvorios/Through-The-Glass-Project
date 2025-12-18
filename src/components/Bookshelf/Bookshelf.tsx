'use client'

import { useId, useState, useRef, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { TimeOfDay } from '@/types'

interface Book {
  id: number
  width: number
  height: number
  color: string
  colorDark: string
  hasGoldText: boolean
  tilt: number
  title?: string
  isInteractive?: boolean
}

interface BookshelfProps {
  timeOfDay: TimeOfDay
  onBookHover?: () => void
}

// Book contents
const bookContents = {
  1: {
    title: 'Tech Stack',
    subtitle: 'Built With',
    content: [
      'Next.js 14 • React 18',
      'TypeScript • Tailwind',
      'React Query • Three.js',
      'Framer Motion',
      '',
    ],
  },
  3: {
    title: 'About',
    subtitle: 'The Developer',
    content: [
      'Crafted with passion',
      'by Julio Calvo',
      '',
      '— Frontend Engineer —',
      '',
    ],
  },
  5: {
    title: 'Through the Glass',
    subtitle: 'A Nordic Window',
    content: [
      'Soft light through the pane,',
      'snowflakes dance, then fade away.',
      'Warmth within remains.',
      '',
      '— A Haiku —',
    ],
  },
}

export function Bookshelf({ timeOfDay, onBookHover }: BookshelfProps) {
  const id = useId()
  const [hoveredBook, setHoveredBook] = useState<number | null>(null)
  const [openBook, setOpenBook] = useState<number | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [glowingBook, setGlowingBook] = useState<number | null>(null)
  const isNight = timeOfDay === 'night' || timeOfDay === 'dusk'

  // Refs for debouncing hover to prevent flickering
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const currentHoverRef = useRef<number | null>(null)

  // Track mount state for portal
  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  // Random glow effect on interactive books
  useEffect(() => {
    const interactiveIds = [1, 3, 5]

    const triggerGlow = () => {
      const randomBook = interactiveIds[Math.floor(Math.random() * interactiveIds.length)]
      setGlowingBook(randomBook)

      // Clear glow after animation
      setTimeout(() => {
        setGlowingBook(null)
      }, 2000)
    }

    // Initial delay
    const initialDelay = setTimeout(triggerGlow, 2000)

    // Repeat every 5-8 seconds randomly
    const interval = setInterval(() => {
      triggerGlow()
    }, 5000 + Math.random() * 3000)

    return () => {
      clearTimeout(initialDelay)
      clearInterval(interval)
    }
  }, [])

  // Libros interactivos: 1, 3, 5 de la fila alta
  const interactiveBooks = [1, 3, 5]

  // Smart hover handlers that prevent flickering
  const handleMouseEnter = useCallback((bookId: number) => {
    if (!interactiveBooks.includes(bookId)) return

    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }

    currentHoverRef.current = bookId
    setHoveredBook(bookId)
    onBookHover?.()
  }, [onBookHover])

  const handleMouseLeave = useCallback((bookId: number) => {
    if (!interactiveBooks.includes(bookId)) return

    if (currentHoverRef.current === bookId) {
      hoverTimeoutRef.current = setTimeout(() => {
        if (currentHoverRef.current === bookId) {
          setHoveredBook(null)
          currentHoverRef.current = null
        }
      }, 150)
    }
  }, [])

  // Colores de la estantería (madera roja nórdica)
  const shelfColors = {
    wood: isNight ? '#2a1515' : '#8B3A3A',
    woodLight: isNight ? '#3a2020' : '#A04545',
    woodDark: isNight ? '#1a0a0a' : '#6B2D2D',
    woodAccent: isNight ? '#4a2828' : '#B85555',
  }

  // Modal colors matching Nordic theme
  const modalColors = {
    bg: isNight ? '#1a0f0f' : '#4A2525',
    bgLight: isNight ? '#2a1818' : '#6B3A3A',
    accent: isNight ? '#D4A574' : '#C9A86C',
    text: isNight ? '#E8D5C4' : '#F5EBE0',
    textMuted: isNight ? '#8B7355' : '#A08060',
  }

  // Libros fila 1 (arriba) - solo 1, 3, 5 son interactivos
  const booksRow1: Book[] = [
    { id: 1, width: 16, height: 85, color: isNight ? '#1a3a4a' : '#2E5A6B', colorDark: isNight ? '#0a2a3a' : '#1E4A5B', hasGoldText: true, tilt: -1, title: 'Stack', isInteractive: true },
    { id: 2, width: 14, height: 78, color: isNight ? '#3a1a1a' : '#8B2323', colorDark: isNight ? '#2a0a0a' : '#6B1313', hasGoldText: true, tilt: 0, title: 'Winter' },
    { id: 3, width: 18, height: 88, color: isNight ? '#2a2a1a' : '#5C5A30', colorDark: isNight ? '#1a1a0a' : '#4C4A20', hasGoldText: true, tilt: 1, title: 'About', isInteractive: true },
    { id: 4, width: 13, height: 75, color: isNight ? '#1a1a2a' : '#3A3A5C', colorDark: isNight ? '#0a0a1a' : '#2A2A4C', hasGoldText: true, tilt: -2, title: 'Poems' },
    { id: 5, width: 15, height: 82, color: isNight ? '#3a2a1a' : '#7A5A3A', colorDark: isNight ? '#2a1a0a' : '#6A4A2A', hasGoldText: true, tilt: 0, title: 'Glass', isInteractive: true },
  ]

  const booksRow2: Book[] = [
    { id: 6, width: 15, height: 80, color: isNight ? '#2a1a2a' : '#5C3A5C', colorDark: isNight ? '#1a0a1a' : '#4C2A4C', hasGoldText: true, tilt: 1, title: 'Aurora' },
    { id: 7, width: 17, height: 85, color: isNight ? '#1a2a2a' : '#3A5C5C', colorDark: isNight ? '#0a1a1a' : '#2A4C4C', hasGoldText: false, tilt: -1, title: 'Fjords' },
    { id: 8, width: 14, height: 76, color: isNight ? '#2a2a2a' : '#5A5A5A', colorDark: isNight ? '#1a1a1a' : '#4A4A4A', hasGoldText: true, tilt: 0, title: 'Vikings' },
    { id: 9, width: 16, height: 82, color: isNight ? '#3a1a2a' : '#7A3A5C', colorDark: isNight ? '#2a0a1a' : '#6A2A4C', hasGoldText: true, tilt: 2, title: 'Runes' },
  ]

  const booksRow3: Book[] = [
    { id: 10, width: 18, height: 88, color: isNight ? '#2a3a1a' : '#5A7A3A', colorDark: isNight ? '#1a2a0a' : '#4A6A2A', hasGoldText: false, tilt: -1, title: 'Forest' },
    { id: 11, width: 13, height: 72, color: isNight ? '#1a2a3a' : '#3A5A7A', colorDark: isNight ? '#0a1a2a' : '#2A4A6A', hasGoldText: true, tilt: 1, title: 'Snow' },
    { id: 12, width: 16, height: 84, color: isNight ? '#3a2a2a' : '#7A5A5A', colorDark: isNight ? '#2a1a1a' : '#6A4A4A', hasGoldText: true, tilt: 0, title: 'Myths' },
    { id: 13, width: 14, height: 78, color: isNight ? '#2a1a1a' : '#5A3A3A', colorDark: isNight ? '#1a0a0a' : '#4A2A2A', hasGoldText: false, tilt: -2, title: 'Fire' },
    { id: 14, width: 15, height: 80, color: isNight ? '#1a3a2a' : '#3A7A5A', colorDark: isNight ? '#0a2a1a' : '#2A6A4A', hasGoldText: true, tilt: 1, title: 'Stars' },
  ]

  // Renderizar un libro
  const renderBook = (book: Book, isTopRow: boolean = false) => {
    const isInteractive = isTopRow && interactiveBooks.includes(book.id)
    const isHovered = hoveredBook === book.id && isInteractive

    return (
      <motion.div
        key={book.id}
        className={`relative ${isInteractive ? 'cursor-pointer' : ''}`}
        style={{
          width: book.width,
          height: book.height,
          transformOrigin: 'bottom center',
        }}
        initial={{ rotate: book.tilt }}
        animate={{
          rotate: book.tilt,
          x: 0,
          y: isHovered ? -12 : 0,
          scale: 1,
        }}
        transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
        onMouseEnter={() => handleMouseEnter(book.id)}
        onMouseLeave={() => handleMouseLeave(book.id)}
        onClick={() => {
          if (isInteractive) {
            setOpenBook(book.id)
          }
        }}
      >
        {/* Lomo del libro */}
        <div
          className="absolute inset-0 rounded-sm"
          style={{
            background: `linear-gradient(90deg, ${book.colorDark} 0%, ${book.color} 15%, ${book.color} 85%, ${book.colorDark} 100%)`,
            boxShadow: isHovered
              ? '4px 6px 12px rgba(0,0,0,0.6)'
              : '1px 2px 4px rgba(0,0,0,0.3)',
          }}
        >
          {/* Detalles decorativos */}
          <div
            className="absolute left-1 right-1 top-2 h-0.5"
            style={{ background: book.hasGoldText ? '#D4AF37' : 'rgba(255,255,255,0.15)' }}
          />
          <div
            className="absolute left-1 right-1 bottom-2 h-0.5"
            style={{ background: book.hasGoldText ? '#D4AF37' : 'rgba(255,255,255,0.15)' }}
          />

          {/* Título (vertical) */}
          {book.hasGoldText && book.title && (
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap"
              style={{
                writingMode: 'vertical-rl',
                textOrientation: 'mixed',
                transform: 'rotate(180deg) translateX(50%)',
                fontSize: '6px',
                color: '#D4AF37',
                letterSpacing: '0.5px',
                textShadow: '0 0 2px rgba(0,0,0,0.5)',
                fontFamily: 'Georgia, serif',
              }}
            >
              {book.title}
            </div>
          )}

          {/* Indicador de interactivo - brillo sutil en el borde */}
          {isInteractive && glowingBook === book.id && (
            <motion.div
              className="absolute inset-0 rounded-sm pointer-events-none"
              initial={{ boxShadow: '0 0 0 1px rgba(212,175,55,0)' }}
              animate={{
                boxShadow: [
                  '0 0 0 1px rgba(212,175,55,0)',
                  '0 0 8px 1px rgba(212,175,55,0.5)',
                  '0 0 0 1px rgba(212,175,55,0)',
                ],
              }}
              transition={{
                duration: 2,
                ease: 'easeInOut',
              }}
            />
          )}
        </div>

        {/* Páginas visibles */}
        <div
          className="absolute right-0 top-1 bottom-1 w-1.5"
          style={{
            background: isNight
              ? 'linear-gradient(90deg, #b8b0a0 0%, #d8d0c0 100%)'
              : 'linear-gradient(90deg, #e0d8c8 0%, #f8f4ec 100%)',
            borderRadius: '0 2px 2px 0',
          }}
        />
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="relative"
      style={{ width: '180px', height: '320px' }}
    >
      {/* Alfombra debajo de la estantería */}
      <div
        className="absolute -bottom-4 left-1/2 -translate-x-1/2"
        style={{
          width: '200px',
          height: '20px',
          background: isNight
            ? 'radial-gradient(ellipse at center, #3a2020 0%, #2a1515 40%, #1a0a0a 100%)'
            : 'radial-gradient(ellipse at center, #8B4545 0%, #7A3535 40%, #5A2525 100%)',
          borderRadius: '50%',
          transform: 'translateX(-50%) perspective(100px) rotateX(60deg)',
          boxShadow: isNight
            ? '0 2px 8px rgba(0,0,0,0.5)'
            : '0 2px 8px rgba(0,0,0,0.3)',
        }}
      >
        <div
          className="absolute inset-2 rounded-full"
          style={{
            border: `1px solid ${isNight ? '#4a2828' : '#A05555'}`,
            opacity: 0.6,
          }}
        />
        <div
          className="absolute inset-4 rounded-full"
          style={{
            border: `1px dashed ${isNight ? '#5a3030' : '#B06060'}`,
            opacity: 0.4,
          }}
        />
      </div>

      {/* Estantería - estructura */}
      <svg width="180" height="320" viewBox="0 0 180 320" className="absolute inset-0">
        <defs>
          <linearGradient id={`${id}-shelfGrad`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={shelfColors.woodLight} />
            <stop offset="50%" stopColor={shelfColors.wood} />
            <stop offset="100%" stopColor={shelfColors.woodDark} />
          </linearGradient>

          <linearGradient id={`${id}-shelfGradH`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={shelfColors.woodDark} />
            <stop offset="20%" stopColor={shelfColors.wood} />
            <stop offset="80%" stopColor={shelfColors.wood} />
            <stop offset="100%" stopColor={shelfColors.woodDark} />
          </linearGradient>

          <pattern id={`${id}-woodGrain`} patternUnits="userSpaceOnUse" width="40" height="5">
            <rect width="40" height="5" fill={shelfColors.wood} />
            <path d="M0,2.5 Q10,1.5 20,2.5 T40,2.5" stroke={shelfColors.woodDark} strokeWidth="0.5" fill="none" opacity="0.4" />
          </pattern>
        </defs>

        <rect x="10" y="8" width="160" height="304" fill={shelfColors.woodDark} opacity="0.4" />
        <rect x="0" y="0" width="14" height="320" fill={`url(#${id}-shelfGrad)`} />
        <rect x="0" y="0" width="14" height="320" fill={`url(#${id}-woodGrain)`} opacity="0.5" />
        <rect x="12" y="0" width="2" height="320" fill={shelfColors.woodDark} opacity="0.3" />
        <rect x="166" y="0" width="14" height="320" fill={`url(#${id}-shelfGrad)`} />
        <rect x="166" y="0" width="14" height="320" fill={`url(#${id}-woodGrain)`} opacity="0.5" />
        <rect x="166" y="0" width="2" height="320" fill={shelfColors.woodDark} opacity="0.3" />
        <rect x="0" y="0" width="180" height="12" fill={shelfColors.woodAccent} />
        <rect x="0" y="0" width="180" height="3" fill={shelfColors.woodLight} opacity="0.5" />
        <rect x="0" y="9" width="180" height="3" fill={shelfColors.woodDark} opacity="0.4" />
        <rect x="10" y="95" width="160" height="10" fill={`url(#${id}-shelfGradH)`} />
        <rect x="10" y="95" width="160" height="2" fill={shelfColors.woodLight} opacity="0.4" />
        <rect x="10" y="103" width="160" height="2" fill={shelfColors.woodDark} opacity="0.3" />
        <rect x="10" y="190" width="160" height="10" fill={`url(#${id}-shelfGradH)`} />
        <rect x="10" y="190" width="160" height="2" fill={shelfColors.woodLight} opacity="0.4" />
        <rect x="10" y="198" width="160" height="2" fill={shelfColors.woodDark} opacity="0.3" />
        <rect x="10" y="285" width="160" height="10" fill={`url(#${id}-shelfGradH)`} />
        <rect x="10" y="285" width="160" height="2" fill={shelfColors.woodLight} opacity="0.4" />
        <rect x="10" y="293" width="160" height="2" fill={shelfColors.woodDark} opacity="0.3" />
        <rect x="0" y="308" width="180" height="12" fill={shelfColors.woodAccent} />
        <rect x="0" y="308" width="180" height="3" fill={shelfColors.woodLight} opacity="0.4" />
        <rect x="0" y="317" width="180" height="3" fill={shelfColors.woodDark} opacity="0.5" />
        <rect x="30" y="92" width="8" height="3" rx="1" fill={shelfColors.woodDark} />
        <rect x="142" y="92" width="8" height="3" rx="1" fill={shelfColors.woodDark} />
        <rect x="30" y="187" width="8" height="3" rx="1" fill={shelfColors.woodDark} />
        <rect x="142" y="187" width="8" height="3" rx="1" fill={shelfColors.woodDark} />
        <rect x="30" y="282" width="8" height="3" rx="1" fill={shelfColors.woodDark} />
        <rect x="142" y="282" width="8" height="3" rx="1" fill={shelfColors.woodDark} />
      </svg>

      {/* Libros - Fila 1 (arriba) - interactivos */}
      <div
        className="absolute flex items-end gap-0.5"
        style={{ bottom: '230px', left: '18px' }}
      >
        {booksRow1.map((book) => renderBook(book, true))}
      </div>

      {/* Libros - Fila 2 */}
      <div
        className="absolute flex items-end gap-0.5"
        style={{ bottom: '135px', left: '20px' }}
      >
        {booksRow2.map((book) => renderBook(book, false))}
      </div>

      {/* Libros - Fila 3 (abajo) */}
      <div
        className="absolute flex items-end gap-0.5"
        style={{ bottom: '40px', left: '18px' }}
      >
        {booksRow3.map((book) => renderBook(book, false))}
      </div>

      {/* Vela decorativa */}
      <div
        className="absolute"
        style={{ right: '30px', bottom: '228px' }}
      >
        <div className="relative" style={{ width: '12px', height: '25px' }}>
          <div
            className="absolute bottom-0 w-full"
            style={{
              height: '20px',
              background: isNight
                ? 'linear-gradient(90deg, #d8c8a8 0%, #f0e8d8 50%, #d8c8a8 100%)'
                : 'linear-gradient(90deg, #e8dcc8 0%, #fff8f0 50%, #e8dcc8 100%)',
              borderRadius: '2px 2px 0 0',
            }}
          />
          <div
            className="absolute"
            style={{
              bottom: '20px',
              left: '5px',
              width: '2px',
              height: '4px',
              background: '#2a2a2a',
            }}
          />
          {/* Llama */}
          {isNight && (
            <motion.div
              className="absolute"
              style={{
                bottom: '23px',
                left: '4px',
                width: '6px',
                height: '10px',
                background: 'linear-gradient(0deg, #FF8C00 0%, #FFD700 60%, #FFFACD 100%)',
                borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                filter: 'blur(0.5px)',
              }}
              animate={{
                scaleY: [1, 1.15, 0.95, 1.1, 1],
                scaleX: [1, 0.9, 1.05, 0.95, 1],
              }}
              transition={{
                duration: 0.4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}
        </div>
      </div>

      {/* Planta pequeña */}
      <div
        className="absolute"
        style={{ right: '22px', bottom: '132px' }}
      >
        <div className="relative" style={{ width: '20px', height: '30px' }}>
          <div
            className="absolute bottom-0 w-full"
            style={{
              height: '12px',
              background: isNight
                ? 'linear-gradient(180deg, #5a3a2a 0%, #3a2a1a 100%)'
                : 'linear-gradient(180deg, #8B5A3A 0%, #6A4A2A 100%)',
              borderRadius: '2px 2px 4px 4px',
              clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)',
            }}
          />
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{ bottom: '10px', width: '18px', height: '20px' }}
          >
            <div
              className="absolute"
              style={{
                width: '8px', height: '14px',
                background: isNight ? '#2a4a2a' : '#4A8A4A',
                borderRadius: '50%', transform: 'rotate(-20deg)',
                left: '0px', bottom: '0px',
              }}
            />
            <div
              className="absolute"
              style={{
                width: '8px', height: '16px',
                background: isNight ? '#3a5a3a' : '#5A9A5A',
                borderRadius: '50%', transform: 'rotate(15deg)',
                right: '0px', bottom: '0px',
              }}
            />
            <div
              className="absolute"
              style={{
                width: '6px', height: '12px',
                background: isNight ? '#2a5a2a' : '#4A9A4A',
                borderRadius: '50%', left: '50%',
                transform: 'translateX(-50%)', bottom: '4px',
              }}
            />
          </div>
        </div>
      </div>

      {/* Reloj de arena pequeño */}
      <div
        className="absolute"
        style={{ right: '22px', bottom: '38px' }}
      >
        <div className="relative" style={{ width: '18px', height: '28px' }}>
          {/* Marco superior */}
          <div
            className="absolute top-0 left-0 right-0"
            style={{
              height: '3px',
              background: isNight ? '#8B7355' : '#A08060',
              borderRadius: '2px',
            }}
          />
          {/* Bulbo superior */}
          <div
            className="absolute"
            style={{
              top: '3px',
              left: '2px',
              width: '14px',
              height: '10px',
              background: isNight
                ? 'linear-gradient(180deg, rgba(200,180,140,0.3) 0%, rgba(200,180,140,0.1) 100%)'
                : 'linear-gradient(180deg, rgba(220,200,160,0.4) 0%, rgba(220,200,160,0.15) 100%)',
              borderRadius: '6px 6px 2px 2px',
              border: `1px solid ${isNight ? '#6B5344' : '#8B7355'}`,
              borderBottom: 'none',
            }}
          >
            {/* Arena en el bulbo superior */}
            <div
              className="absolute bottom-0 left-1 right-1"
              style={{
                height: '4px',
                background: isNight ? '#C4A060' : '#D4B070',
                borderRadius: '0 0 2px 2px',
              }}
            />
          </div>
          {/* Cuello */}
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              top: '12px',
              width: '4px',
              height: '4px',
              background: isNight
                ? 'linear-gradient(180deg, rgba(200,180,140,0.2) 0%, rgba(200,180,140,0.1) 100%)'
                : 'linear-gradient(180deg, rgba(220,200,160,0.3) 0%, rgba(220,200,160,0.15) 100%)',
              border: `1px solid ${isNight ? '#6B5344' : '#8B7355'}`,
              borderTop: 'none',
              borderBottom: 'none',
            }}
          />
          {/* Bulbo inferior */}
          <div
            className="absolute"
            style={{
              top: '15px',
              left: '2px',
              width: '14px',
              height: '10px',
              background: isNight
                ? 'linear-gradient(180deg, rgba(200,180,140,0.1) 0%, rgba(200,180,140,0.3) 100%)'
                : 'linear-gradient(180deg, rgba(220,200,160,0.15) 0%, rgba(220,200,160,0.4) 100%)',
              borderRadius: '2px 2px 6px 6px',
              border: `1px solid ${isNight ? '#6B5344' : '#8B7355'}`,
              borderTop: 'none',
            }}
          >
            {/* Arena en el bulbo inferior */}
            <div
              className="absolute bottom-1 left-1 right-1"
              style={{
                height: '5px',
                background: isNight ? '#C4A060' : '#D4B070',
                borderRadius: '2px 2px 4px 4px',
              }}
            />
          </div>
          {/* Marco inferior */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: '3px',
              background: isNight ? '#8B7355' : '#A08060',
              borderRadius: '2px',
            }}
          />
        </div>
      </div>

      {/* OPEN BOOK MODAL - Using Portal to render outside component hierarchy */}
      {isMounted && createPortal(
        <AnimatePresence>
          {openBook && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center"
              style={{
                zIndex: 99999,
                background: isNight
                  ? 'radial-gradient(ellipse at center, rgba(26,15,15,0.95) 0%, rgba(0,0,0,0.98) 100%)'
                  : 'radial-gradient(ellipse at center, rgba(74,37,37,0.9) 0%, rgba(0,0,0,0.95) 100%)'
              }}
              onClick={() => setOpenBook(null)}
            >
              {/* Ambient glow */}
              <motion.div
                className="absolute pointer-events-none"
                style={{
                  width: '600px',
                  height: '400px',
                  background: `radial-gradient(ellipse at center, ${modalColors.accent}15 0%, transparent 60%)`,
                }}
                animate={{ opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />

              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="relative"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Main container - Nordic wooden panel style */}
                <div
                  className="relative overflow-hidden"
                  style={{
                    width: '420px',
                    padding: '2px',
                    background: `linear-gradient(145deg, ${modalColors.bgLight} 0%, ${modalColors.bg} 50%, ${adjustColor(modalColors.bg, -10)} 100%)`,
                    borderRadius: '12px',
                    boxShadow: `
                      0 25px 80px rgba(0,0,0,0.6),
                      0 10px 30px rgba(0,0,0,0.4),
                      inset 0 1px 0 rgba(255,255,255,0.08),
                      inset 0 -1px 0 rgba(0,0,0,0.3)
                    `,
                  }}
                >
                  {/* Wood grain texture overlay */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.1 }}>
                    <defs>
                      <pattern id={`${id}-modalWood`} patternUnits="userSpaceOnUse" width="80" height="12">
                        <path
                          d="M0,6 Q20,3 40,6 T80,6"
                          stroke={modalColors.accent}
                          strokeWidth="0.5"
                          fill="none"
                        />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#${id}-modalWood)`} />
                  </svg>

                  {/* Inner content area */}
                  <div
                    className="relative p-8"
                    style={{
                      background: `linear-gradient(180deg, ${modalColors.bg}ee 0%, ${adjustColor(modalColors.bg, -5)}ee 100%)`,
                      borderRadius: '10px',
                    }}
                  >
                    {/* Decorative corner accents */}
                    <div className="absolute top-4 left-4 w-6 h-6" style={{ borderTop: `2px solid ${modalColors.accent}40`, borderLeft: `2px solid ${modalColors.accent}40` }} />
                    <div className="absolute top-4 right-4 w-6 h-6" style={{ borderTop: `2px solid ${modalColors.accent}40`, borderRight: `2px solid ${modalColors.accent}40` }} />
                    <div className="absolute bottom-4 left-4 w-6 h-6" style={{ borderBottom: `2px solid ${modalColors.accent}40`, borderLeft: `2px solid ${modalColors.accent}40` }} />
                    <div className="absolute bottom-4 right-4 w-6 h-6" style={{ borderBottom: `2px solid ${modalColors.accent}40`, borderRight: `2px solid ${modalColors.accent}40` }} />

                    {/* Title section */}
                    <div className="text-center mb-6">
                      <motion.h2
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-2xl font-medium tracking-wider mb-2"
                        style={{
                          color: modalColors.accent,
                          fontFamily: 'Georgia, serif',
                          textShadow: `0 2px 10px ${modalColors.accent}40`
                        }}
                      >
                        {bookContents[openBook as keyof typeof bookContents]?.title}
                      </motion.h2>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-sm tracking-widest uppercase"
                        style={{
                          color: modalColors.textMuted,
                          fontFamily: 'Georgia, serif',
                        }}
                      >
                        {bookContents[openBook as keyof typeof bookContents]?.subtitle}
                      </motion.p>
                    </div>

                    {/* Decorative divider */}
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="flex items-center justify-center gap-3 mb-6"
                    >
                      <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, transparent 0%, ${modalColors.accent}60 100%)` }} />
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z" fill={modalColors.accent} fillOpacity="0.6" />
                      </svg>
                      <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${modalColors.accent}60 0%, transparent 100%)` }} />
                    </motion.div>

                    {/* Content */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="space-y-3 text-center py-4"
                    >
                      {bookContents[openBook as keyof typeof bookContents]?.content.map((line, i) => (
                        <motion.p
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + i * 0.1 }}
                          className="text-base"
                          style={{
                            color: line ? modalColors.text : 'transparent',
                            fontFamily: 'Georgia, serif',
                            lineHeight: '2',
                            letterSpacing: '0.5px',
                          }}
                        >
                          {line || '\u00A0'}
                        </motion.p>
                      ))}
                    </motion.div>

                    {/* Bottom decorative divider */}
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                      className="flex items-center justify-center gap-3 mt-6"
                    >
                      <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, transparent 0%, ${modalColors.accent}40 100%)` }} />
                      <div className="w-2 h-2 rounded-full" style={{ background: modalColors.accent, opacity: 0.4 }} />
                      <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${modalColors.accent}40 0%, transparent 100%)` }} />
                    </motion.div>
                  </div>

                  {/* Close button - just X */}
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="absolute top-3 right-3 p-2"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setOpenBook(null)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={modalColors.accent} strokeWidth="2" strokeLinecap="round">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </motion.div>
  )
}

// Helper function to adjust color brightness
function adjustColor(color: string, amount: number): string {
  const hex = color.replace('#', '')
  const r = Math.max(0, Math.min(255, parseInt(hex.substring(0, 2), 16) + amount))
  const g = Math.max(0, Math.min(255, parseInt(hex.substring(2, 4), 16) + amount))
  const b = Math.max(0, Math.min(255, parseInt(hex.substring(4, 6), 16) + amount))
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import styles from './SplashScreenPage.module.css'
import Splash from '../../components/SplashLogo/SplashLogo'

export default function SplashScreenPage() {
  const navigate = useNavigate()

  const [whiteBackground, setWhiteBackground] = useState(false)
  const [start, setStart] = useState(false)

  const overlayRef = useRef(null)
  const tlRef = useRef(null)
  const startedRef = useRef(false)

  const STRIPES = 7
  const AUTO_START_MS = 5000  // Esperar 5s antes de animar

  // Auto—start tras 5s
  useEffect(() => {
    const t = setTimeout(() => setStart(true), AUTO_START_MS)
    return () => clearTimeout(t)
  }, [])

  // Click o teclado para iniciar
  const triggerStart = () => setStart(true)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') setStart(true)
  }

  useLayoutEffect(() => {
    if (!start || startedRef.current) return
    startedRef.current = true

    const overlay = overlayRef.current
    const onContinue = () => navigate('/warning')

    setWhiteBackground(true)

    const stripes = overlay.querySelectorAll(`.${styles.stripe}`)
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const tl = gsap.timeline({ onComplete: onContinue })

    tl.set(overlay, { opacity: 1, pointerEvents: 'auto' })

    if (mq.matches) {
      tl.to(overlay, { backgroundColor: '#fff', duration: 0.25, ease: 'none' })
    } else {
      tl.fromTo(
        stripes,
        { xPercent: 100 },
        { xPercent: 0, duration: 1.0, ease: 'power2.out', stagger: 0.1 }
      )
    }

    tlRef.current = tl

    return () => {
      tlRef.current?.kill()
      tlRef.current = null
    }
  }, [start, navigate])

  return (
    <main className={`${styles.splashScreenPage} ${whiteBackground ? styles.whiteBackground : ''}`} role="main" aria-labelledby="splash-title" onClick={triggerStart} onKeyDown={handleKeyDown} tabIndex={0}>
      <Splash />
      <h1 id="splash-title" className={styles.bigTitle}>TRACKMETRO</h1>

      {/* Overlay de rayas blancas */}
      <div
        ref={overlayRef}
        className={styles.overlay}
        style={{ '--n': STRIPES }}
        aria-hidden="true"
      >
        {Array.from({ length: STRIPES }).map((_, i) => (
          <div key={i} className={styles.stripe} />
        ))}
      </div>
    </main>
  )
}

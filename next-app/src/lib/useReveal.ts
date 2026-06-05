'use client'

import { useEffect, useRef } from 'react'

/**
 * Adds class "revealed" to every element with class "reveal" inside
 * the given container ref when it scrolls into view.
 * Works on desktop (window scroll) and mobile (any scroll container).
 */
export function useReveal() {
  const containerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return

    const targets = document.querySelectorAll('.reveal')
    if (!targets.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )

    targets.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return containerRef
}

/**
 * Counts from 0 to `end` over `duration` ms once the element is visible.
 * Returns [ref, displayValue].
 */
export function useCountUp(end: number, duration = 1800, suffix = '') {
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()
          const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1)
            // easeOutQuart
            const eased = 1 - Math.pow(1 - progress, 4)
            el.textContent = Math.round(eased * end).toLocaleString('en-IN') + suffix
            if (progress < 1) requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [end, duration, suffix])

  return ref
}

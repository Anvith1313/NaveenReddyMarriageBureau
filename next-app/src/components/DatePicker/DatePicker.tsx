'use client'

import { useRef, useEffect, useCallback, useState } from 'react'
import s from './datepicker.module.css'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const IH = 44   // item height px
const VIS = 5   // visible rows

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

// ── WheelCol ──────────────────────────────────────────────────────────────────

interface ColRef {
  idx: number
  items: string[]
  y: number
  dragging: boolean
  didDrag: boolean
  sy: number
  spy: number
  ly: number
  lt: number
  vy: number
  raf: number | null
}

function useWheelCol(
  elRef: React.RefObject<HTMLDivElement | null>,
  items: string[],
  initIdx: number,
  onChange: (i: number) => void,
) {
  const state = useRef<ColRef>({
    idx: Math.max(0, Math.min(items.length - 1, initIdx)),
    items,
    y: -Math.max(0, Math.min(items.length - 1, initIdx)) * IH,
    dragging: false, didDrag: false,
    sy: 0, spy: 0, ly: 0, lt: 0, vy: 0, raf: null,
  })

  const renderRef = useRef<() => void>(() => {})

  const snap = useCallback((i: number) => {
    const st = state.current
    i = Math.max(0, Math.min(st.items.length - 1, i))
    if (i !== st.idx) { st.idx = i; onChange(i) }
    const tgt = -i * IH
    if (st.raf) cancelAnimationFrame(st.raf)
    const start = st.y, t0 = performance.now(), dur = 280
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / dur)
      const e = 1 - Math.pow(1 - t, 3)
      st.y = start + (tgt - start) * e
      renderRef.current()
      if (t < 1) st.raf = requestAnimationFrame(step)
      else { st.y = tgt; renderRef.current() }
    }
    st.raf = requestAnimationFrame(step)
  }, [onChange])

  const ds = useCallback((y: number) => {
    const st = state.current
    st.dragging = true; st.didDrag = false
    st.sy = y; st.spy = st.y; st.ly = y; st.lt = Date.now(); st.vy = 0
    if (st.raf) { cancelAnimationFrame(st.raf); st.raf = null }
  }, [])

  const dm = useCallback((y: number) => {
    const st = state.current
    if (!st.dragging) return
    const now = Date.now(), dt = Math.max(1, now - st.lt)
    if (Math.abs(y - st.sy) > 3) st.didDrag = true
    st.vy = (y - st.ly) / dt * 16; st.ly = y; st.lt = now
    st.y = st.spy + (y - st.sy)
    const mn = -(st.items.length - 1) * IH, mx = 0
    if (st.y > mx) st.y = mx + (st.y - mx) * 0.3
    if (st.y < mn) st.y = mn + (st.y - mn) * 0.3
    renderRef.current()
  }, [])

  const de = useCallback(() => {
    const st = state.current
    if (!st.dragging) return
    st.dragging = false
    snap(Math.round(-(st.y + st.vy * 5) / IH))
  }, [snap])

  // Expose setIdx so parent can update the column programmatically
  const setIdx = useCallback((i: number, animate = true) => {
    const st = state.current
    i = Math.max(0, Math.min(st.items.length - 1, i))
    st.idx = i
    if (animate) { snap(i) } else { st.y = -i * IH; renderRef.current() }
  }, [snap])

  // Expose updateItems so parent can swap the items array (e.g. days in month)
  const updateItems = useCallback((newItems: string[], keepIdx: number) => {
    const st = state.current
    st.items = newItems
    const clamped = Math.max(0, Math.min(newItems.length - 1, keepIdx))
    st.idx = clamped
    st.y = -clamped * IH

    const el = elRef.current
    if (!el) return
    const track = el.querySelector('.dwp-track') as HTMLElement | null
    if (!track) return
    const cOff = Math.floor(VIS / 2) * IH
    track.style.paddingTop = `${cOff}px`
    track.style.paddingBottom = `${cOff}px`
    track.innerHTML = newItems.map((v, idx) => `<div class="dwp-item" data-i="${idx}">${v}</div>`).join('')
    renderRef.current()
  }, [elRef])

  useEffect(() => {
    const el = elRef.current
    if (!el) return

    const cOff = Math.floor(VIS / 2) * IH
    el.className = 'dwp-col'
    el.innerHTML = `
      <div class="dwp-mask-t"></div>
      <div class="dwp-mask-b"></div>
      <div class="dwp-sel-bar"></div>
      <div class="dwp-track" style="padding-top:${cOff}px;padding-bottom:${cOff}px">
        ${state.current.items.map((v, i) => `<div class="dwp-item" data-i="${i}">${v}</div>`).join('')}
      </div>`

    const track = el.querySelector('.dwp-track') as HTMLElement

    renderRef.current = () => {
      const st = state.current
      track.style.transform = `translateY(${st.y}px)`
      const itemEls = track.querySelectorAll<HTMLElement>('.dwp-item')
      itemEls.forEach((itemEl, i) => {
        const dist = i * IH + st.y
        const t = Math.max(-1, Math.min(1, dist / (IH * 2.5)))
        const rotX = -t * 38
        const op = Math.max(0.18, 1 - Math.abs(t) * 0.72)
        const sel = Math.abs(dist) < IH * 0.6
        itemEl.style.transform = `perspective(500px) rotateX(${rotX}deg)`
        itemEl.style.opacity = String(op)
        itemEl.style.color = sel ? '#7B1F2E' : 'rgba(0,0,0,0.35)'
        itemEl.style.fontWeight = sel ? '600' : '400'
        itemEl.style.fontSize = sel ? '1.1rem' : '0.9rem'
      })
    }
    renderRef.current()

    // Touch
    const onTS = (e: TouchEvent) => ds(e.touches[0].clientY)
    const onTM = (e: TouchEvent) => { e.preventDefault(); dm(e.touches[0].clientY) }
    const onTE = () => de()
    el.addEventListener('touchstart', onTS, { passive: true })
    el.addEventListener('touchmove', onTM, { passive: false })
    el.addEventListener('touchend', onTE, { passive: true })

    // Mouse
    const onMD = (e: MouseEvent) => { e.preventDefault(); ds(e.clientY) }
    const onMM = (e: MouseEvent) => { if (state.current.dragging) dm(e.clientY) }
    const onMU = () => { if (state.current.dragging) de() }
    el.addEventListener('mousedown', onMD)
    document.addEventListener('mousemove', onMM)
    document.addEventListener('mouseup', onMU)

    // Wheel scroll
    const onW = (e: WheelEvent) => { e.preventDefault(); snap(state.current.idx + (e.deltaY > 0 ? 1 : -1)) }
    el.addEventListener('wheel', onW, { passive: false })

    // Click
    const onClick = (e: MouseEvent) => {
      const target = (e.target as Element).closest?.('.dwp-item') as HTMLElement | null
      if (target && !state.current.didDrag) snap(+target.dataset.i!)
    }
    el.addEventListener('click', onClick)

    return () => {
      el.removeEventListener('touchstart', onTS)
      el.removeEventListener('touchmove', onTM)
      el.removeEventListener('touchend', onTE)
      el.removeEventListener('mousedown', onMD)
      document.removeEventListener('mousemove', onMM)
      document.removeEventListener('mouseup', onMU)
      el.removeEventListener('wheel', onW)
      el.removeEventListener('click', onClick)
      if (state.current.raf) cancelAnimationFrame(state.current.raf)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { setIdx, updateItems, getIdx: () => state.current.idx }
}

// ── DatePicker ────────────────────────────────────────────────────────────────

interface Props {
  value: string        // ISO "YYYY-MM-DD" or ""
  onChange: (v: string) => void
  id?: string
  placeholder?: string
  minYear?: number
  maxYear?: number
}

export default function DatePicker({
  value,
  onChange,
  id,
  placeholder = 'Select date',
  minYear = 1940,
  maxYear = new Date().getFullYear() - 18,
}: Props) {
  const [open, setOpen] = useState(false)

  // Parse initial value
  const parsed = value ? new Date(value + 'T00:00:00') : null
  const initY = parsed?.getFullYear() ?? 1990
  const initM = parsed?.getMonth() ?? 0
  const initD = (parsed?.getDate() ?? 1) - 1

  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => String(maxYear - i))
  const initYIdx = years.indexOf(String(initY))

  // Current values tracked in refs to avoid stale closures
  const curYear = useRef(initY)
  const curMonth = useRef(initM)
  const curDay = useRef(initD)  // 0-based day index

  const dayElRef = useRef<HTMLDivElement>(null)
  const moElRef  = useRef<HTMLDivElement>(null)
  const yrElRef  = useRef<HTMLDivElement>(null)

  const rebuildDays = useCallback((year: number, month: number, keepDayIdx: number) => {
    const n = daysInMonth(year, month)
    const days = Array.from({ length: n }, (_, i) => String(i + 1).padStart(2, '0'))
    dayCol.updateItems(days, Math.min(keepDayIdx, n - 1))
    curDay.current = Math.min(keepDayIdx, n - 1)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const dayCol = useWheelCol(dayElRef, Array.from({ length: daysInMonth(initY, initM) }, (_, i) => String(i + 1).padStart(2, '0')), initD, (i) => { curDay.current = i })
  const moCol  = useWheelCol(moElRef, MONTHS, initM, (i) => { curMonth.current = i; rebuildDays(curYear.current, i, curDay.current) })
  const yrCol  = useWheelCol(yrElRef, years, Math.max(0, initYIdx), (i) => { curYear.current = +years[i]; rebuildDays(curYear.current, curMonth.current, curDay.current) })

  // Sync when value prop changes externally
  useEffect(() => {
    if (!value) return
    const d = new Date(value + 'T00:00:00')
    const yIdx = years.indexOf(String(d.getFullYear()))
    if (yIdx >= 0) yrCol.setIdx(yIdx, false)
    moCol.setIdx(d.getMonth(), false)
    curYear.current = d.getFullYear()
    curMonth.current = d.getMonth()
    rebuildDays(d.getFullYear(), d.getMonth(), d.getDate() - 1)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  function handleSet() {
    const y = curYear.current
    const m = String(curMonth.current + 1).padStart(2, '0')
    const d = String(curDay.current + 1).padStart(2, '0')
    onChange(`${y}-${m}-${d}`)
    setOpen(false)
  }

  function handleClear() {
    onChange('')
    setOpen(false)
  }

  const displayVal = parsed
    ? `${String(parsed.getDate()).padStart(2, '0')} ${MONTHS[parsed.getMonth()]} ${parsed.getFullYear()}`
    : ''

  return (
    <div className={s.root}>
      <button
        type="button"
        id={id}
        className={`${s.trigger} ${value ? s.triggerFilled : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-haspopup="dialog"
        aria-expanded={open ? 'true' : 'false'}
      >
        <span className={s.triggerText}>{displayVal || placeholder}</span>
        <svg className={s.triggerIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      </button>

      {open && (
        <>
          <div className={s.backdrop} onClick={() => setOpen(false)} />
          <div className={s.panel} role="dialog" aria-modal="true" aria-label="Select date of birth">
            <div className={s.panelHdr}>
              <div className={s.panelTitle}>Date of Birth</div>
            </div>

            <div className={s.wheelRow}>
              <div ref={dayElRef} />
              <div ref={moElRef} />
              <div ref={yrElRef} />
            </div>

            <div className={s.actions}>
              <button type="button" className={s.btnClear}  onClick={handleClear}>Clear</button>
              <button type="button" className={s.btnCancel} onClick={() => setOpen(false)}>Cancel</button>
              <button type="button" className={s.btnSet}    onClick={handleSet}>Set</button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

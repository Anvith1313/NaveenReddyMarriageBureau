'use client'

import { useState, useEffect } from 'react'
import s from './datepicker.module.css'

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]
const DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa']

interface Props {
  value: string          // ISO "YYYY-MM-DD"
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
  minYear = 1950,
  maxYear = new Date().getFullYear() - 18,
}: Props) {
  const parsed = value ? new Date(value + 'T00:00:00') : null
  const today = new Date()

  const [open, setOpen] = useState(false)
  const [viewYear, setViewYear] = useState(parsed?.getFullYear() ?? maxYear)
  const [viewMonth, setViewMonth] = useState(parsed?.getMonth() ?? today.getMonth())
  const [pending, setPending] = useState<{ y: number; m: number; d: number } | null>(
    parsed ? { y: parsed.getFullYear(), m: parsed.getMonth(), d: parsed.getDate() } : null
  )

  // Sync if external value changes
  useEffect(() => {
    if (value) {
      const d = new Date(value + 'T00:00:00')
      setViewYear(d.getFullYear())
      setViewMonth(d.getMonth())
      setPending({ y: d.getFullYear(), m: d.getMonth(), d: d.getDate() })
    }
  }, [value])

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  function handleSet() {
    if (!pending) return
    const mm = String(pending.m + 1).padStart(2, '0')
    const dd = String(pending.d).padStart(2, '0')
    onChange(`${pending.y}-${mm}-${dd}`)
    setOpen(false)
  }

  function handleClear() {
    setPending(null)
    onChange('')
    setOpen(false)
  }

  // Build calendar grid
  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  // Pad to full rows
  while (cells.length % 7 !== 0) cells.push(null)

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
        aria-expanded={open}
      >
        <span className={s.triggerText}>{displayVal || placeholder}</span>
        <svg className={s.triggerIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      </button>

      {open && (
        <>
          <div className={s.backdrop} onClick={() => setOpen(false)} />
          <div className={s.panel} role="dialog" aria-modal="true" aria-label="Pick a date">
            {/* Selected date header */}
            <div className={s.panelHdr}>
              <div className={s.panelYear}>{pending?.y ?? viewYear}</div>
              <div className={s.panelDate}>
                {pending
                  ? `${DAYS[(new Date(pending.y, pending.m, pending.d).getDay())]}, ${pending.d} ${MONTHS[pending.m].slice(0, 3)}`
                  : 'Pick a date'}
              </div>
            </div>

            {/* Month/year navigation */}
            <div className={s.navRow}>
              <button type="button" className={s.navBtn} onClick={prevMonth} aria-label="Previous month">‹</button>
              <span className={s.navLabel}>{MONTHS[viewMonth]} {viewYear}</span>
              <button type="button" className={s.navBtn} onClick={nextMonth} aria-label="Next month">›</button>
            </div>

            {/* Day headers */}
            <div className={s.grid}>
              {DAYS.map(d => (
                <div key={d} className={s.dayName}>{d}</div>
              ))}
              {cells.map((day, i) => {
                if (!day) return <div key={`e-${i}`} />
                const isSelected = pending?.y === viewYear && pending?.m === viewMonth && pending?.d === day
                const isToday = today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === day
                return (
                  <button
                    key={day}
                    type="button"
                    className={`${s.day} ${isSelected ? s.daySelected : ''} ${isToday && !isSelected ? s.dayToday : ''}`}
                    onClick={() => setPending({ y: viewYear, m: viewMonth, d: day })}
                  >
                    {day}
                  </button>
                )
              })}
            </div>

            {/* Year quick-select */}
            <div className={s.yearRow}>
              <select
                className={s.yearSelect}
                value={viewYear}
                onChange={e => setViewYear(+e.target.value)}
                aria-label="Select year"
              >
                {Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i).map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className={s.actions}>
              <button type="button" className={s.btnClear} onClick={handleClear}>Clear</button>
              <button type="button" className={s.btnCancel} onClick={() => setOpen(false)}>Cancel</button>
              <button type="button" className={s.btnSet} onClick={handleSet} disabled={!pending}>Set</button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

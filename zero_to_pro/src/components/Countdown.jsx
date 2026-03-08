import { useState, useEffect } from 'react'

function formatCountdown(ms) {
  if (ms <= 0) return 'Disponible'
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  const h = Math.floor(m / 60)
  const d = Math.floor(h / 24)

  if (d > 0) return `${d}j ${h % 24}h ${m % 60}m`
  if (h > 0) return `${h}h ${m % 60}m ${s % 60}s`
  return `${m}m ${s % 60}s`
}

export default function Countdown({ targetDate, className = '' }) {
  const [remaining, setRemaining] = useState(new Date(targetDate) - new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(new Date(targetDate) - new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  if (remaining <= 0) return null

  return (
    <span className={`countdown ${className}`}>
      <span className="countdown-dot" />
      {formatCountdown(remaining)}
    </span>
  )
}

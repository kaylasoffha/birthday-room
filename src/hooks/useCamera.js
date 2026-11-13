import { useEffect, useState } from 'react'

export default function useCamera(enabled = true) {
  const [stream, setStream] = useState(null)
  const [error, setError] = useState(() =>
    navigator.mediaDevices?.getUserMedia ? null : 'unsupported',
  )

  useEffect(() => {
    if (!enabled || !navigator.mediaDevices?.getUserMedia) return

    let cancelled = false
    let current = null

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'user' }, audio: false })
      .then((s) => {
        if (cancelled) {
          s.getTracks().forEach((t) => t.stop())
          return
        }
        current = s
        setStream(s)
      })
      .catch(() => {
        if (!cancelled) setError('denied')
      })

    return () => {
      cancelled = true
      current?.getTracks().forEach((t) => t.stop())
      setStream(null)
    }
  }, [enabled])

  return { stream, error }
}
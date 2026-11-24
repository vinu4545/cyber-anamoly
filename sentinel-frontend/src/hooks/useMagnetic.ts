import { useRef, useState, useEffect } from 'react'

interface MagneticOptions {
  maxDistance?: number
  power?: number
  disabled?: boolean
}

export function useMagnetic<T extends HTMLElement = HTMLElement>({
  maxDistance = 6,
  power = 0.2,
  disabled = false,
}: MagneticOptions = {}) {
  const ref = useRef<T | null>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (disabled) {
      setPosition({ x: 0, y: 0 })
      return
    }

    const element = ref.current
    if (!element) return

    // Disable magnetic pull on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const deltaX = e.clientX - centerX
      const deltaY = e.clientY - centerY

      // Calculate magnetic displacement capped at maxDistance
      const pullX = Math.max(-maxDistance, Math.min(maxDistance, deltaX * power))
      const pullY = Math.max(-maxDistance, Math.min(maxDistance, deltaY * power))

      setPosition({ x: pullX, y: pullY })
    }

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 })
    }

    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [maxDistance, power, disabled])

  return { ref, x: position.x, y: position.y }
}

import { useState, useRef, type MouseEvent } from 'react'

interface TiltOptions {
  maxTilt?: number // default 6deg
  disabled?: boolean
}

export function useTilt3D<T extends HTMLElement = HTMLElement>({
  maxTilt = 6,
  disabled = false,
}: TiltOptions = {}) {
  const ref = useRef<T | null>(null)
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, sheenX: 50, sheenY: 50 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: MouseEvent<T>) => {
    if (disabled) return
    const element = ref.current
    if (!element) return

    const rect = element.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const width = rect.width
    const height = rect.height

    const normX = (x / width) * 2 - 1 // -1 to 1
    const normY = (y / height) * 2 - 1 // -1 to 1

    const rotateY = normX * maxTilt
    const rotateX = -normY * maxTilt

    setTilt({
      rotateX,
      rotateY,
      sheenX: (x / width) * 100,
      sheenY: (y / height) * 100,
    })
  }

  const handleMouseEnter = () => {
    if (!disabled) setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setTilt({ rotateX: 0, rotateY: 0, sheenX: 50, sheenY: 50 })
  }

  return {
    ref,
    tilt,
    isHovered,
    handlers: {
      onMouseMove: handleMouseMove,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    },
  }
}

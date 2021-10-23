import React, { useRef } from 'react'

function useElementSize() {
  const ref = useRef()
  const [size, setSize] = useState({ x: 0, y: 0 })
  
}

function useInputRect() {
  const ref = useRef()
  const check = (clientX, clientY) => {
    if (!ref.current) {
      return { inBounds: false, x: 0, y: 0, width: 0, height: 0 }
    }
    const rect = ref.current.getBoundingClientRect()
    const localX = clientX - rect.left
    const localY = clientY - rect.top
    const inBounds = rect.width > 0 && rect.height > 0 && localX >= 0 && localX <= rect.width && localY >= 0 && localY <= rect.height
    return { inBounds, x: localX, y: localY, width: rect.width, height: rect.height }
  }
  return [ref, check]
}

export { useInputRect }

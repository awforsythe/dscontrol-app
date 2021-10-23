import React, { useRef, useState, useEffect } from 'react'

function useElementRect() {
  const ref = useRef()
  const [rect, setRect] = useState(null)
  const update = () => {
    if (ref.current) {
      setRect(ref.current.getBoundingClientRect())
    }
  }
  useEffect(() => {
    update()
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('resize', update)
    }
  }, [])
  return [ref, rect]
}

export { useElementRect }

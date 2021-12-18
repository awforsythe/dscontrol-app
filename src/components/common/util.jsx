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

function useGlobalKeyDownHandler(onKeyDown) {
  useEffect(() => {
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  })
}

function useGlobalDragHandler(onDrag) {
  const [isDragging, setIsDragging] = useState(false)
  const handleGlobalMouseUp = (event) => setIsDragging(false)
  const handleGlobalMouseMove = (event) => onDrag(event)
  const removeGlobalEventListeners = () => {
    window.removeEventListener('mousemove', handleGlobalMouseMove)
    window.removeEventListener('mouseup', handleGlobalMouseUp)
  }
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleGlobalMouseMove)
      window.addEventListener('mouseup', handleGlobalMouseUp)
    } else {
      removeGlobalEventListeners()
    }
    return removeGlobalEventListeners
  }, [isDragging])

  const onMouseDown = (event) => {
    if (!isDragging) {
      setIsDragging(true)
      onDrag(event)
    }
  }
  return [isDragging, onMouseDown]
}

export { useElementRect, useGlobalKeyDownHandler, useGlobalDragHandler }

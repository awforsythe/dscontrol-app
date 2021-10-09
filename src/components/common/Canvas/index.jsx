import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'

import './style.less'

function Canvas(props) {
  // Maintain our canvas size to match 1:1 with the parent div
  const [size, setSize] = useState({ x: 100, y: 100 })
  
  // Capture a reference to the canvas element, and resize it to fit the parent
  const elem = useRef()
  function handleResize() {
    if (elem.current && elem.current.parentElement) {
      setSize({
        x: elem.current.parentElement.clientWidth,
        y: elem.current.parentElement.clientHeight,
      })
    }
  }
  useEffect(handleResize, [elem.current])

  // Resize the drawing buffer whenever the window size changes
  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Get a new 2D drawing context whenever our element ref or size changes
  const ctx = useRef()
  useEffect(() => {
    ctx.current = null
    if (elem.current) {
      ctx.current = elem.current.getContext('2d')
      ctx.current.lineWidth = 10
      ctx.current.strokeStyle = '#c29f9f'
      ctx.current.beginPath()
      ctx.current.moveTo(0, 0)
      ctx.current.lineTo(size.x, size.y)
      ctx.current.moveTo(size.x, 0)
      ctx.current.lineTo(0, size.y)
      ctx.current.stroke()
    }
  }, [elem.current, size])

  return (
    <div className="canvas-container">
      <canvas
        className="canvas"
        ref={elem}
        style={{ width: '100%', height: size.y }}
        width={size.x}
        height={size.y}
      />
    </div>
  )

}
Canvas.propTypes = {
}

export default Canvas

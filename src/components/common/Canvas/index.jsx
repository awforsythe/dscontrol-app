import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'

import CanvasRegion from './CanvasRegion'
import { getChildRegions, computeRegionRects } from './util'

import './style.less'

function Canvas(props) {
  // Maintain our canvas size to match 1:1 with the parent div
  const [size, setSize] = useState({ x: 16, y: 16 })
  
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
    }
  }, [elem.current, size])

  const { orientation, children } = props
  useEffect(() => {
    if (ctx.current) {
      ctx.current.clearRect(0, 0, size.x, size.y)
      const ownRect = { x: 0, y: 0, width: size.x, height: size.y }
      const childRegions = getChildRegions(children)
      const regionRects = computeRegionRects(orientation, ownRect, childRegions)
      for (let regionIndex = 0; regionIndex < childRegions.length; regionIndex++) {
        const regionProps = childRegions[regionIndex].props
        regionProps.draw(ctx.current, regionRects[regionIndex])
      }
    }
  }, [ctx.current, size, orientation, children.length])

  return (
    <div className="canvas-container">
      <canvas
        className="canvas"
        ref={elem}
        style={{ width: '100%', height: size.y }}
        width={size.x}
        height={size.y}
      />
      {children}
    </div>
  )
}
Canvas.propTypes = {
  orientation: PropTypes.oneOf(['horizontal', 'vertical']).isRequired,
  children: PropTypes.any,
}

Canvas.Region = CanvasRegion

export default Canvas

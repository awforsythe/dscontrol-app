import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'

import { useGlobalDragHandler } from '../common/util'

function getPadding(elem, dir) {
  return parseInt(window.getComputedStyle(elem).getPropertyValue(`padding-${dir}`).replace('px', ''))
}


function RangeBar(props) {
  const { normalizedPosition, normalizedDuration } = props
  const leftOffsetPercentage =  (normalizedPosition * 100.0).toFixed(4)
  const widthPercentage = (normalizedDuration * 100.0).toFixed(4)

  const containerRef = useRef(null)
  const barRef = useRef(null)
  const [dragStart, setDragStart] = useState({
    initialized: false,
    mouseX: 0,
    paddingLeft: 0,
    paddingRight: 0,
    barX: 0,
  })

  const { onDrag } = props
  const [isDragging, startDragging] = useGlobalDragHandler((event) => {
    if (event.type === 'mousedown') {
      // If this is the start of a drag, cache the starting X position of the bar and the mouse cursor
      if (containerRef.current && barRef.current) {
        setDragStart({
          initialized: true,
          mouseX: event.clientX,
          paddingLeft: getPadding(containerRef.current, 'left'),
          paddingRight: getPadding(containerRef.current, 'right'),
          barX: barRef.current.getBoundingClientRect().x,
        })
      }
    } else {
      // If the mouse is being moved while dragging, make sure we have valid drag start state
      if (dragStart.initialized && containerRef.current && barRef.current) {
        // Get the bounding rects for the bar and the container div it sits within
        const containerRect = containerRef.current.getBoundingClientRect()
        const barRect = barRef.current.getBoundingClientRect()

        // Determine the minimum and maximum clientX that the bar can have while remaining in the container
        const barMinX = containerRect.left + dragStart.paddingLeft
        const barMaxX = containerRect.right - dragStart.paddingRight - barRect.width

        // Determine the total width of the area within the container that the bar can move within
        const containerTrackWidth = barMaxX - barMinX + barRect.width

        // Figure out how far the cursor has moved to the left or right since drag start, and shift the bar's clientX accordingly
        const mouseDeltaX = event.clientX - dragStart.mouseX
        const newBarX = dragStart.barX + mouseDeltaX
        const clampedBarX = Math.min(barMaxX, Math.max(barMinX, newBarX))

        // Convert that screen coordinate to a new [0..1] playback position representing the start of the visible range
        const newNormalizedPosition = (clampedBarX - barMinX) / containerTrackWidth
        onDrag(newNormalizedPosition)
      }
    }
  })

  return (
    <div
      className="range-bar-container"
      ref={containerRef}
    >
      <div
        className="range-bar"
        ref={barRef}
        style={{
          left: `${leftOffsetPercentage}%`,
          width: `${widthPercentage}%`,
        }}
        onMouseDown={startDragging}
      />
    </div>
  )
}
RangeBar.propTypes = {
  normalizedPosition: PropTypes.number.isRequired,
  normalizedDuration: PropTypes.number.isRequired,
  onDrag: PropTypes.func.isRequired,
}

export default RangeBar

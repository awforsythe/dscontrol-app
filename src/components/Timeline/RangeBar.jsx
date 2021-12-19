import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'

import { useGlobalDragHandler } from '../common/util'

function getPadding(elem, dir) {
  return parseInt(window.getComputedStyle(elem).getPropertyValue(`padding-${dir}`).replace('px', ''))
}

function useRangeBarDivs() {
  const containerRef = useRef(null)
  const startHandleRef = useRef(null)
  const innerRef = useRef(null)
  const endHandleRef = useRef(null)

  function initDragState(event) {
    // If we don't have a valid, return initial/null state without computing bounding rects etc.
    if (!event || !event.target) {
      return { mode: null }
    }

    // If we're processing an actual event, get the horizontal extent of the 'rail' the bar rides in
    const container = containerRef.current.getBoundingClientRect()
    const railStartX = container.left + getPadding(containerRef.current, 'left')
    const railEndX = container.right - getPadding(containerRef.current, 'right')

    // Get bounding boxes for each of our three bar elements: start handle, inner region, and end handle
    const startHandle = startHandleRef.current.getBoundingClientRect()
    const inner = innerRef.current.getBoundingClientRect()
    const endHandle = endHandleRef.current.getBoundingClientRect()

    // If we're dragging the start handle, adjust the start position while keeping the end position fixed
    if (event.target === startHandleRef.current) {
      const startX = startHandle.x
      const minX = railStartX
      const maxX = inner.right - startHandle.width
      return {
        mode: 'adjust-start',
        mouseX: event.clientX,
        toNormalizedRange: (mouseDeltaX, existingStart, existingDuration) => {
          const newElemX = Math.min(maxX, Math.max(minX, startX + mouseDeltaX))
          const newNormalizedStartPosition = (newElemX - railStartX) / (railEndX - railStartX)
          return [newNormalizedStartPosition, existingStart + existingDuration]
        },
      }
    }

    // If dragging the bar itself, adjust the start position while keeping the _duration_ fixed
    if (event.target === innerRef.current) {
      const startX = inner.x
      const minX = railStartX + startHandle.width
      const maxX = railEndX - endHandle.width - inner.width
      return {
        mode: 'scroll',
        mouseX: event.clientX,
        toNormalizedRange: (mouseDeltaX, existingStart, existingDuration) => {
          const newElemX = Math.min(maxX, Math.max(minX, startX + mouseDeltaX))
          const newNormalizedStartPosition = (newElemX - startHandle.width - railStartX) / (railEndX - railStartX)
          return [newNormalizedStartPosition, newNormalizedStartPosition + existingDuration]
        },
      }
    }
    
    // If dragging the end handle, adjust the duration / end position while keeping the start position fixed
    if (event.target === endHandleRef.current) {
      const startX = endHandle.x
      const minX = inner.left
      const maxX = railEndX - endHandle.width
      return {
        mode: 'adjust-end',
        mouseX: event.clientX,
        toNormalizedRange: (mouseDeltaX, existingStart, existingDuration) => {
          const newElemX = Math.min(maxX, Math.max(minX, startX + mouseDeltaX))
          const newNormalizedEndPosition = (newElemX + endHandle.width - railStartX) / (railEndX - railStartX)
          return [existingStart, newNormalizedEndPosition]
        },
      }
    }

    // Failsafe in case of bad event: no drag state to act upon
    return { mode: null }
  }

  return [containerRef, startHandleRef, innerRef, endHandleRef, initDragState]
}

function RangeBar(props) {
  const { normalizedPosition, normalizedDuration } = props
  const leftOffsetPercentage =  (normalizedPosition * 100.0).toFixed(4)
  const widthPercentage = (normalizedDuration * 100.0).toFixed(4)

  const [containerRef, startHandleRef, innerRef, endHandleRef, initDragState] = useRangeBarDivs()
  const [dragState, setDragState] = useState(initDragState(null))

  const { onAdjustRange } = props
  const [isDragging, startDragging] = useGlobalDragHandler((event) => {
    if (event.type === 'mousedown') {
      setDragState(initDragState(event))
    } else if (dragState.mode) {
      const mouseDeltaX = event.clientX - dragState.mouseX
      const [newStart, newEnd] = dragState.toNormalizedRange(mouseDeltaX, normalizedPosition, normalizedDuration)
      onAdjustRange(newStart, newEnd)
    }
  })

  return (
    <div
      className="range-bar-container"
      ref={containerRef}
    >
      <div
        className="range-bar"
        style={{
          left: `${leftOffsetPercentage}%`,
          width: `${widthPercentage}%`,
        }}
      >
        <div className="range-bar-handle"
          ref={startHandleRef}
          onMouseDown={startDragging}
        />
        <div className="range-bar-inner"
          ref={innerRef}
          onMouseDown={startDragging}
        />
        <div className="range-bar-handle"
          ref={endHandleRef}
          onMouseDown={startDragging}
        />
      </div>
    </div>
  )
}
RangeBar.propTypes = {
  normalizedPosition: PropTypes.number.isRequired,
  normalizedDuration: PropTypes.number.isRequired,
  onAdjustRange: PropTypes.func.isRequired,
}

export default RangeBar

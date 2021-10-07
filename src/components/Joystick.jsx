import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Container = styled.div`
  margin: 20px;
  position: relative;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  background-size: ${props => parseInt(props.size / 2)}px ${props => parseInt(props.size / 2)}px;
  background-image:
    repeating-linear-gradient(#ccc 0 1px, transparent 1px 100%),
    repeating-linear-gradient(90deg, #ccc 0 1px, transparent 1px 100%);
`
const Ring = styled.div`
  box-sizing: border-box;
  position: absolute;
  left: ${props => props.pad}px;
  top: ${props => props.pad}px;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border: 1px solid #ccc;
  border-radius: ${props => props.size}px;
`
const Stick = styled.div`
  box-sizing: border-box;
  position: absolute;
  left: ${props => props.pad}px;
  top: ${props => props.pad}px;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border: 3px solid #ccc;
  background-color: rgba(192, 192, 192, 0.375);
  border-radius: ${props => props.size}px;
`
const makeRingSize = (size, ratio) => {
  const ownSize = parseInt(size * ratio)
  const pad = parseInt((size - ownSize) / 2)
  return { size: ownSize, pad: pad }
}

function Joystick(props) {
  const [dragState, setDragState] = useState(null)

  // Size our circular elements based on the overall size of the div
  const { size } = props
  const outerRingRatio = 0.6
  const innerRingRatio = 1.0 - outerRingRatio
  const outer = makeRingSize(size, outerRingRatio)
  const inner = makeRingSize(size, innerRingRatio)

  // Track mouse position internally using the coordinate space of the containing box, normalized
  // so that (0, 0) is the top-left corner and (1, 1) is the bottom-right
  const containerRef = useRef()
  function clientToContainer(clientX, clientY) {
    if (!containerRef.current) {
      return { x: 0.0, y: 0.0 }
    }
    const rect = containerRef.current.getBoundingClientRect()
    return {
      x: (clientX - rect.left) / size,
      y: (clientY - rect.top) / size,
    }
  }
  const stickToContainer = (stickX, stickY) => ({
    x: (1.0 + stickX) / 2.0,
    y: (1.0 - stickY) / 2.0,
  })
  const containerToStick = (containerX, containerY) => ({
    x: 2.0 * containerX - 1.0,
    y: -2.0 * containerY + 1.0,
  })

  // Convert from polar to linear coordinates to get an x/y offset: this is in the coordinate
  // system of stick input, e.g. (0, 1) is north, (1, 0) is east, (-1, 0) is west, etc.
  const { angle, distance } = props
  const clampedDistance = Math.min(1.0, Math.max(0.0, distance))
  const stickX = clampedDistance * Math.cos(angle)
  const stickY = clampedDistance * Math.sin(angle)

  // Convert the current stick position into normalized container coordinates
  const stickPos = stickToContainer(stickX, stickY)
  const stickStyle = {
    left: stickPos.x * outer.size,
    top: stickPos.y * outer.size,
  }

  // When we start dragging the stick, cache current position/offsets as drag state
  function handleMouseDownCapture(event) {
    const cursorPos = clientToContainer(event.clientX, event.clientY)
    const grabOffset = {
      x: stickPos.x - cursorPos.x,
      y: stickPos.y - cursorPos.y,
    }
    setDragState({ startPos: cursorPos, offsetToStick: grabOffset })
  }

  // While dragging, update our target stick position every time the mouse moves
  const { onChange } = props
  function handleGlobalMouseMove(event) {
    if (dragState && containerRef.current) {
      const cursorPos = clientToContainer(event.clientX, event.clientY)
      const targetContainerPos = {
        x: cursorPos.x + dragState.offsetToStick.x,
        y: cursorPos.y + dragState.offsetToStick.y,
      }
      const targetStickPos = containerToStick(targetContainerPos.x, targetContainerPos.y)
      const targetAngle = Math.atan2(targetStickPos.y, targetStickPos.x)
      const targetDistanceSq = targetStickPos.x * targetStickPos.x + targetStickPos.y * targetStickPos.y
      const targetDistance = targetDistanceSq > 0.00001 ? Math.sqrt(targetDistanceSq) / outerRingRatio : 0.0
      const clampedTargetDistance = Math.min(1.0, Math.max(0.0, targetDistance))
      onChange(targetAngle, clampedTargetDistance)
    }
  }

  // When the mouse is released, stop dragging
  function handleGlobalMouseUp(event) {
    setDragState(null)
    onChange(0.0, 0.0)
  }

  const registerGlobalListeners = () => {
    window.addEventListener('mousemove', handleGlobalMouseMove)
    window.addEventListener('mouseup', handleGlobalMouseUp)
  }
  const unregisterGlobalListeners = () => {
    window.removeEventListener('mousemove', handleGlobalMouseMove)
      window.removeEventListener('mouseup', handleGlobalMouseUp)
  }

  useEffect(() => {
    if (dragState) {
      registerGlobalListeners()
    } else {
      unregisterGlobalListeners()
    }
    return unregisterGlobalListeners
  }, [dragState])

  return (
    <Container ref={containerRef} size={size}>
      <Ring {...outer} />
      <Ring {...inner} />
      <Stick
        {...inner}
        style={stickStyle}
        onMouseDownCapture={handleMouseDownCapture}
      />
    </Container>
  )
}
Joystick.propTypes = {
  size: PropTypes.number.isRequired,
  angle: PropTypes.number.isRequired,
  distance: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default Joystick

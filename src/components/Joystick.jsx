import React from 'react'
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
const ringSize = (size, ratio) => {
  const ownSize = parseInt(size * ratio)
  const pad = parseInt((size - ownSize) / 2)
  return { size: ownSize, pad: pad }
}

function Joystick(props) {
  const { size, angle, distance } = props

  // Size our circular elements based on the overall size of the div
  const outerRingRatio = 0.6
  const outer = ringSize(size, outerRingRatio)
  const inner = ringSize(size, 1.0 - outerRingRatio)

  // Convert from polar to linear coordinates to get an x/y offset
  const clampedDistance = Math.min(1.0, Math.max(0.0, distance))
  const x = clampedDistance * Math.cos(angle)
  const y = clampedDistance * Math.sin(angle)
  const stickStyle = {
    left: inner.pad + (x * outer.size * 0.5),
    top: inner.pad + (y * outer.size * 0.5),
  }
  return (
    <Container size={size}>
      <Ring {...outer} />
      <Ring {...inner} />
      <Stick {...inner} style={stickStyle} />
    </Container>
  )
}
Joystick.propTypes = {
  size: PropTypes.number.isRequired,
  angle: PropTypes.number.isRequired,
  distance: PropTypes.number.isRequired,
}

export default Joystick

import React from 'react'
import PropTypes from 'prop-types'

function Joystick(props) {
  const { angle, distance } = props
  const clampedDistance = Math.min(1.0, Math.max(0.0, distance))
  const x = clampedDistance * Math.cos(angle)
  const y = clampedDistance * Math.sin(angle)
  return (
    <ul>
      <li><b>x:</b> {x}</li>
      <li><b>y:</b> {y}</li>
    </ul>
  )
}
Joystick.propTypes = {
  angle: PropTypes.number,
  distance: PropTypes.number,
}

export default Joystick

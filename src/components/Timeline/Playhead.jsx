import React from 'react'
import PropTypes from 'prop-types'

function Playhead(props) {
  const { normalizedPosition } = props
  const isVisible = normalizedPosition >= 0.0 && normalizedPosition <= 1.0
  const leftOffsetPercentage = isVisible ? (normalizedPosition * 100.0).toFixed(4) : (normalizedPosition < 0.0 ? '0%' : '100%')
  return (
    <div
      className="timeline-playhead"
      style={{
        visibility: isVisible ? 'visible' : 'hidden',
        left: `${leftOffsetPercentage}%`,
      }}
    />
  )
}
Playhead.propTypes = {
  normalizedPosition: PropTypes.number.isRequired,
}

export default Playhead

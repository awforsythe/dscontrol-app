import React from 'react'
import PropTypes from 'prop-types'

function Playhead(props) {
  const { isVisible, xOffset } = props
  return (
    <div
      className="timeline-playhead"
      style={{
        visibility: isVisible ? 'visible' : 'hidden',
        left: xOffset,
      }}
    />
  )
}
Playhead.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  xOffset: PropTypes.number.isRequired,
}

export default Playhead

import React from 'react'
import PropTypes from 'prop-types'

function RangeBar(props) {
  const { normalizedPosition, normalizedDuration } = props
  const leftOffsetPercentage =  (normalizedPosition * 100.0).toFixed(4)
  const widthPercentage = (normalizedDuration * 100.0).toFixed(4)
  return (
    <div className="range-bar-container">
      <div
        className="range-bar"
        style={{
          left: `${leftOffsetPercentage}%`,
          width: `${widthPercentage}%`,
        }}
      />
    </div>
  )
}
RangeBar.propTypes = {
  normalizedPosition: PropTypes.number.isRequired,
  normalizedDuration: PropTypes.number.isRequired,
}

export default RangeBar

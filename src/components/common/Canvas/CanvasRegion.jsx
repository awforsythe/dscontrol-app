import React from 'react'
import PropTypes from 'prop-types'

function CanvasRegion(props) {
  return null
}
CanvasRegion.propTypes = {
  orientation: PropTypes.oneOf(['horizontal', 'vertical']).isRequired,
  fixed: PropTypes.number,
  ratio: PropTypes.number,
  draw: PropTypes.func.isRequired,
}

export default CanvasRegion

import React from 'react'
import PropTypes from 'prop-types'

import Canvas from './common/Canvas'

function Timeline(props) {
  const { duration, visibleRangeStartTime, visibleRangeEndTime, playbackTime } = props
  function handleDraw(ctx, size) {
    let color = '#'
    for (let i = 0; i < 6; i++) {
      const chars = '0123456789abcdef'
      color += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    ctx.fillStyle = color
    ctx.fillRect(0, 0, size.x, size.y)
  }
  return (
    <div className="timeline">
      <div className="timeline-top">
        <Canvas draw={handleDraw}>
          <p>top</p>
        </Canvas>
      </div>
      <div className="timeline-middle">
        <Canvas draw={handleDraw} />
      </div>
      <div className="timeline-bottom">
        <Canvas draw={handleDraw} />
      </div>
    </div>
  )
}
Timeline.propTypes = {
  duration: PropTypes.number.isRequired,
  visibleRangeStartTime: PropTypes.number.isRequired,
  visibleRangeEndTime: PropTypes.number.isRequired,
  playbackTime: PropTypes.number.isRequired,
}

export default Timeline

import React from 'react'
import PropTypes from 'prop-types'

import Canvas from './common/Canvas'

function Timeline(props) {
  const { duration, visibleRangeStartTime, visibleRangeEndTime, playbackTime } = props
  function handleDraw(ctx, rect) {
    let color = '#'
    for (let i = 0; i < 6; i++) {
      const chars = '0123456789abcdef'
      color += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    ctx.fillStyle = color
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height)
    console.log('draw', { ctx, rect })
  }
  return (
    <div className="timeline">
      <Canvas orientation="vertical">
        <Canvas.Region orientation="horizontal" fixed={30} draw={handleDraw} />
        <Canvas.Region orientation="horizontal" ratio={1.0} draw={handleDraw} />
        <Canvas.Region orientation="horizontal" fixed={50} draw={handleDraw} />
      </Canvas>
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

import React, { useRef } from 'react'
import PropTypes from 'prop-types'

import Canvas from '../common/Canvas'

import './style.less'

function useInputRect() {
  const ref = useRef()
  const check = (clientX, clientY) => {
    if (!ref.current) {
      return { inBounds: false, x: 0, y: 0, width: 0, height: 0 }
    }
    const rect = ref.current.getBoundingClientRect()
    const localX = clientX - rect.left
    const localY = clientY - rect.top
    const inBounds = rect.width > 0 && rect.height > 0 && localX >= 0 && localX <= rect.width && localY >= 0 && localY <= rect.height
    return { inBounds, x: localX, y: localY, width: rect.width, height: rect.height }
  }
  return [ref, check]
}

function Timeline(props) {
  const { duration, visibleRangeStartTime, visibleRangeEndTime, playbackTime, onJog } = props
  const [bottomRef, checkBottomRect] = useInputRect()

  function drawOverlay(ctx, size) {
    const visibleDuration = visibleRangeEndTime - visibleRangeStartTime
    const progress = (playbackTime - visibleRangeStartTime) / visibleDuration
    const x = parseInt(size.x * progress)
    ctx.fillStyle = '#cc4444'
    ctx.fillRect(x, 0, 2, size.y)
  }
  function handleOverlayClick(event) {
    const bottom = checkBottomRect(event.clientX, event.clientY)
    if (bottom.inBounds) {
      const visibleDuration = visibleRangeEndTime - visibleRangeStartTime
      const newPlaybackTime = visibleRangeStartTime + (bottom.x / bottom.width) * visibleDuration
      onJog(newPlaybackTime)
    }
  }
  return (
    <div className="timeline">
      <div className="timeline-top">
      </div>
      <div className="timeline-middle">
      </div>
      <div ref={bottomRef} className="timeline-bottom">
        this is the bottom of the timeline and the playhead should be rendered on top of it,
        let's just see whether that is actually the case
      </div>
      <div className="timeline-overlay">
        <Canvas draw={drawOverlay} onClick={handleOverlayClick} />
      </div>
    </div>
  )
}
Timeline.propTypes = {
  duration: PropTypes.number.isRequired,
  visibleRangeStartTime: PropTypes.number.isRequired,
  visibleRangeEndTime: PropTypes.number.isRequired,
  playbackTime: PropTypes.number.isRequired,
  onJog: PropTypes.func.isRequired,
}

export default Timeline

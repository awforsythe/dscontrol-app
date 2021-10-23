import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { useElementRect } from '../common/util'
import Playhead from './Playhead'

import './style.less'

function Timeline(props) {
  const { duration, visibleRangeStartTime, visibleRangeEndTime, playbackTime, onJog } = props
  const [bottomRef, bottomRect] = useElementRect()
  const [isScrubbing, setIsScrubbing] = useState(false)

  const visibleDuration = visibleRangeEndTime - visibleRangeStartTime
  const progress = (playbackTime - visibleRangeStartTime) / visibleDuration

  function scrubTo(clientX) {
    if (bottomRect) {
      const targetProgress = (clientX - bottomRect.left) / bottomRect.width
      const visibleDuration = visibleRangeEndTime - visibleRangeStartTime
      const newPlaybackTime = visibleRangeStartTime + targetProgress * visibleDuration
      onJog(newPlaybackTime)
    }
  }

  function handleGlobalMouseMove(event) {
    scrubTo(event.clientX)
  }

  function handleGlobalMouseUp() {
    setIsScrubbing(false)
  }

  function removeGlobalEventListeners() {
    window.removeEventListener('mousemove', handleGlobalMouseMove)
    window.removeEventListener('mouseup', handleGlobalMouseUp)
  }

  useEffect(() => {
    if (isScrubbing) {
      window.addEventListener('mousemove', handleGlobalMouseMove)
      window.addEventListener('mouseup', handleGlobalMouseUp)
    } else {
      removeGlobalEventListeners()
    }
    return removeGlobalEventListeners
  }, [isScrubbing])

  function handleBottomMouseDown(event) {
    setIsScrubbing(true)
    scrubTo(event.clientX)
  }

  return (
    <div className="timeline">
      <div className="timeline-top">
      </div>
      <div className="timeline-middle">
      </div>
      <div className="timeline-bottom" ref={bottomRef} onMouseDown={handleBottomMouseDown}>
      </div>
      <div className="timeline-overlay">
        <Playhead normalizedPosition={progress} isScrubbing={isScrubbing} />
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

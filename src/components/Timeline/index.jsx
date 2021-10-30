import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { useElementRect } from '../common/util'
import RangeBar from './RangeBar'
import Playhead from './Playhead'

import './style.less'

function Timeline(props) {
  const { children, isPlaying, duration, visibleRangeStartTime, visibleRangeEndTime, playbackTime, onJog } = props
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

  const handleGlobalMouseMove = (event) => scrubTo(event.clientX)
  const handleGlobalMouseUp = () => setIsScrubbing(false)
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

  function handleScrubAreaMouseDown(event) {
    if (!isScrubbing) {
      setIsScrubbing(true)
      scrubTo(event.clientX)
    }
  }

  return (
    <div className="timeline">
      <div
        className="timeline-top"
        onMouseDown={handleScrubAreaMouseDown}
      >
      </div>
      <div className="timeline-middle">
        {children}
      </div>
      <div
        className="timeline-bottom"
        ref={bottomRef}
        onMouseDown={handleScrubAreaMouseDown}
      >
      </div>
      <Playhead normalizedPosition={progress} isScrubbing={!isPlaying && isScrubbing} />
      <RangeBar normalizedPosition={visibleRangeStartTime / duration} normalizedDuration={visibleDuration / duration} />
    </div>
  )
}
Timeline.propTypes = {
  children: PropTypes.any,
  isPlaying: PropTypes.bool.isRequired,
  duration: PropTypes.number.isRequired,
  visibleRangeStartTime: PropTypes.number.isRequired,
  visibleRangeEndTime: PropTypes.number.isRequired,
  playbackTime: PropTypes.number.isRequired,
  onJog: PropTypes.func.isRequired,
}

export default Timeline

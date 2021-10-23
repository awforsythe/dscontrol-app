import React from 'react'
import PropTypes from 'prop-types'

import { useElementRect } from '../common/util'
import Playhead from './Playhead'

import './style.less'

function Timeline(props) {
  const { duration, visibleRangeStartTime, visibleRangeEndTime, playbackTime, onJog } = props
  const [bottomRef, bottomRect] = useElementRect()

  const visibleDuration = visibleRangeEndTime - visibleRangeStartTime
  const progress = (playbackTime - visibleRangeStartTime) / visibleDuration

  function handleBottomClick(event) {
    if (bottomRect) {
      const targetProgress = (event.clientX - bottomRect.left) / bottomRect.width
      const visibleDuration = visibleRangeEndTime - visibleRangeStartTime
      const newPlaybackTime = visibleRangeStartTime + targetProgress * visibleDuration
      onJog(newPlaybackTime)
    }
  }
  return (
    <div className="timeline">
      <div className="timeline-top">
      </div>
      <div className="timeline-middle">
      </div>
      <div className="timeline-bottom" ref={bottomRef} onClick={handleBottomClick}>
        this is the bottom of the timeline and the playhead should be rendered on top of it,
        let's just see whether that is actually the case
      </div>
      <div className="timeline-overlay">
        <Playhead normalizedPosition={progress} />
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

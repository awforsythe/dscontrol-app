import React from 'react'
import PropTypes from 'prop-types'

import Canvas from '../common/Canvas'
import { useInputRect } from '../util'

import Playhead from './Playhead'

import './style.less'

function Timeline(props) {
  const { duration, visibleRangeStartTime, visibleRangeEndTime, playbackTime, onJog } = props
  const [bottomRef, checkBottomRect] = useInputRect()

  const visibleDuration = visibleRangeEndTime - visibleRangeStartTime
  const progress = (playbackTime - visibleRangeStartTime) / visibleDuration

  function handleBottomClick(event) {
    console.log('bottomclick')
    const bottom = checkBottomRect(event.clientX, event.clientY)
    if (bottom.inBounds) {
      console.log('invounds')
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
      <div className="timeline-bottom" ref={bottomRef} onClick={handleBottomClick}>
        this is the bottom of the timeline and the playhead should be rendered on top of it,
        let's just see whether that is actually the case
      </div>
      <div className="timeline-overlay">
        <Playhead
          isVisible={progress >= 0.0 && progress <= 1.0}
          xOffset={`${(progress * 100.0).toFixed(4)}%`}
        />
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

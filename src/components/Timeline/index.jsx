import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { useElementRect, useGlobalDragHandler } from '../common/util'
import RangeBar from './RangeBar'
import Playhead from './Playhead'

import './style.less'

function Timeline(props) {
  const { children, isPlaying, duration, visibleRangeStartTime, visibleRangeEndTime, playbackTime, onJog } = props
  const [bottomRef, bottomRect] = useElementRect()

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

  const [isScrubbing, startScrubbing] = useGlobalDragHandler((event) => {
    if (!isPlaying) {
      scrubTo(event.clientX)
    }
  })

  const { onAdjustVisibleRange } = props
  return (
    <div className="timeline">
      <div
        className="timeline-top"
        onMouseDown={startScrubbing}
      >
      </div>
      <div className="timeline-middle">
        {children}
      </div>
      <div
        className="timeline-bottom"
        ref={bottomRef}
        onMouseDown={startScrubbing}
      >
      </div>
      <Playhead
        normalizedPosition={progress}
        isScrubbing={!isPlaying && isScrubbing}
      />
      <RangeBar
        normalizedPosition={visibleRangeStartTime / duration}
        normalizedDuration={visibleDuration / duration}
        onAdjustRange={(newNormalizedStartPosition, newNormalizedEndPosition) => {
          const newStartTime = newNormalizedStartPosition * duration
          const newEndTime = newNormalizedEndPosition * duration
          onAdjustVisibleRange(newStartTime, newEndTime)
        }}
      />
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
  onAdjustVisibleRange: PropTypes.func.isRequired,
}

export default Timeline

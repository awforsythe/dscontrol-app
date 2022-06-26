import React from 'react'
import PropTypes from 'prop-types'

import { useElementRect, useGlobalDragHandler } from '../common/util'
import RangeBar from './RangeBar'
import Playhead from './Playhead'

import './style.less'

function Timeline({prefs, ...props}) {
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

  function onWheel(event) {
    const [action, isFaster] = prefs.resolveAction(event.shiftKey, event.altKey)
    if (action === 'zoom') {
      console.log('zoom' + (isFaster ? ' faster' : ''))
    } else if (action === 'scroll') {
      console.log('scroll' + (isFaster ? ' faster' : ''))
    } else if (action === 'scrub') {
      console.log('scrub' + (isFaster ? ' faster' : ''))
    }
  }

  const { onAdjustVisibleRange } = props
  return (
    <div className="timeline" onWheel={onWheel}>
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
        isPlaying={isPlaying}
        normalizedPlaybackPosition={Math.max(0.0, Math.min(1.0, playbackTime / duration))}
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
  prefs: PropTypes.object.isRequired,
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

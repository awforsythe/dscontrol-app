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

  function handleZoom(event, isFaster) {
    // Determine the playback time over which the mouse cursor is centered: we want to
    // keep this time at the same screen location as we zoom in or out
    const rect = event.currentTarget.getBoundingClientRect()
    const normalizedX = (event.clientX - rect.x) / rect.width
    const rangeDuration = visibleRangeEndTime - visibleRangeStartTime

    // Determine the magnitude of the change in our visible playback range as it
    // shrinks (if zooming in) or grows (if zooming out)
    const zoomIn = event.deltaY < 0
    const absDelta = 1.0 * (isFaster ? 3 : 1)

    // Split the change proportionally
    const leftDelta = normalizedX * absDelta
    const rightDelta = absDelta - leftDelta
    const newStart = Math.max(0.0, visibleRangeStartTime + leftDelta * (zoomIn ? 1 : -1))
    const newEnd = Math.min(duration, visibleRangeEndTime + rightDelta * (zoomIn ? -1 : 1))

    const minRangeDuration = 0.2
    const newRangeDuration = newEnd - newStart
    if (zoomIn)  {
      if (newRangeDuration >= minRangeDuration) {
        onAdjustVisibleRange(newStart, newEnd)
      } else {
        const centerTime = visibleRangeStartTime + (rangeDuration * normalizedX)
        const clampedStart = centerTime - (minRangeDuration * normalizedX)
        const clampedEnd = clampedStart + minRangeDuration
        onAdjustVisibleRange(clampedStart, clampedEnd)
      }
    } else {
      onAdjustVisibleRange(newStart, newEnd)
    }
  }

  function handleScroll(event, isFaster) {
    // Shift the visible range left or right, clamped to the bounds of the sequence
    const scrollForward = event.deltaY > 0
    const delta = 0.2 * (isFaster ? 3 : 1)
    const rangeDuration = visibleRangeEndTime - visibleRangeStartTime
    if (scrollForward) { 
      // Move the right edge forward, stopping if we hit the end of the sequence
      const newRangeEnd = Math.min(duration, visibleRangeEndTime + delta)
      const newRangeStart = newRangeEnd - rangeDuration
      onAdjustVisibleRange(newRangeStart, newRangeEnd)
    } else {
      // Move the left edge backward, stopping if we hit the end of the sequence
      const newRangeStart = Math.max(0.0, visibleRangeStartTime - delta)
      const newRangeEnd = newRangeStart + rangeDuration
      onAdjustVisibleRange(newRangeStart, newRangeEnd)
    }
  }

  function handleScrub(event, isFaster) {
    // Shift the playhead left or right, clamped to the total duration
    const scrubForward = event.deltaY > 0
    const delta = 0.2 * (isFaster ? 3 : 1) * (scrubForward ? 1 : -1)
    const newPosition = Math.max(0.0, Math.min(duration, playbackTime + delta))
    onJog(newPosition)
  }

  function onWheel(event) {
    const [action, isFaster] = prefs.resolveAction(event.shiftKey, event.altKey)    
    if (action === 'zoom') {
      handleZoom(event, isFaster)
    } else if (action === 'scroll') {
      handleScroll(event, isFaster)
    } else if (action === 'scrub') {
      handleScrub(event, isFaster)
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

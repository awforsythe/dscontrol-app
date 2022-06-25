import { makeObservable, observable, action } from 'mobx'

class Playback {
  _sequence = null
  isPlaying = false
  position = 0.0
  visibleRange = { start: 0.0, end: 0.0 }

  constructor(sequence) {
    this._sequence = sequence
    this.visibleRange.end = this._sequence.duration
    this._sequence.onLoad = () => {
      this.stop()
      const rangeDuration = this.visibleRange.end - this.visibleRange.start
      this.visibleRange.start = 0.0
      this.visibleRange.end = this._sequence.duration
      if (rangeDuration > 0.0 && rangeDuration < this._sequence.duration) {
        this.visibleRange.end = rangeDuration
      }
      this.position = 0.0
    }
    makeObservable(this, {
      isPlaying: observable,
      position: observable,
      visibleRange: observable,
      play: action,
      stop: action,
      toggle: action,
      scrubTo: action,
      adjustVisibleRange: action,
      tick: action,
    })
  }

  play() {
    this.isPlaying = true
  }
  
  stop() {
    this.isPlaying = false
  }

  toggle() {
    if (this.isPlaying) {
      this.stop()
    } else {
      if (this.position >= this._sequence.duration) {
        this.position = 0.0
      }
      this.play()
    }
  }

  scrubTo(newPosition) {
    this.position = Math.min(this._sequence.duration, Math.max(0.0, newPosition))
  }

  adjustVisibleRange(newStart, newEnd) {
    const needsSwap = newStart > newEnd
    const actualNewStart = needsSwap ? newEnd : newStart
    const actualNewEnd = needsSwap ? newStart : newEnd
    const clampedNewStart = Math.max(0.0, actualNewStart)
    const clampedNewEnd = Math.min(this._sequence.duration, actualNewEnd)
    this.visibleRange = { start: clampedNewStart, end: clampedNewEnd }
  }

  tick(deltaSeconds) {
    if (this.isPlaying) {
      // Update the current playback position
      this.position += deltaSeconds

      // If we've hit the end of the sequence, stop playback
      if (this.position >= this._sequence.duration) {
        this.position = this._sequence.duration
        this.stop()
      }
      
      // Otherwise, if we've moved out of the visible playback range, shift the range
      // to automatically track the playhead
      if (this.isPlaying && !this._playheadIsVisible()) {
        this._shiftVisibleRangeToPlayhead()
      }
    }
  }

  _playheadIsVisible() {
    return this.position >= this.visibleRange.start && this.position <= this.visibleRange.end
  }

  _shiftVisibleRangeToPlayhead() {
    const rangeDuration = this.visibleRange.end - this.visibleRange.start
    if (this.position < this.visibleRange.start) {
      // Shift the left edge of the playback range back toward the playhead, shrinking
      // the range if necessary
      this.visibleRange.start = this.position
      this.visibleRange.end = Math.min(this.position + rangeDuration, this._sequence.duration)
    } else {
      // Shift the right edge of the playback range by up to one range-bar-length,
      // stopping short if we're less than that length from the end of the sequence,
      // but keeping the width of the range bar constant
      if (this.position + rangeDuration >= this._sequence.duration) {
        this.visibleRange.end = this._sequence.duration
      } else {
        this.visibleRange.end = this.position + rangeDuration
      }
      this.visibleRange.start = this.visibleRange.end - rangeDuration
    }
  }
} 

export default Playback

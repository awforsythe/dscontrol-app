import { makeObservable, observable, action } from 'mobx'

class Playback {
  _sequence = null
  isPlaying = false
  position = 0.0

  constructor(sequence) {
    this._sequence = sequence
    makeObservable(this, {
      isPlaying: observable,
      position: observable,
      play: action,
      stop: action,
      toggle: action,
      scrubTo: action,
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
    } else if (this.position < this._sequence.duration) {
      this.play()
    }
  }

  scrubTo(newPosition) {
    this.position = newPosition
  }

  tick(deltaSeconds) {
    if (this.isPlaying) {
      this.position += deltaSeconds
      if (this.position >= this._sequence.duration) {
        this.position = this._sequence.duration
        this.stop()
      }
    }
  }
}

export default Playback

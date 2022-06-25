import { makeObservable, observable, action } from 'mobx'

class Playback {
  isPlaying = false
  position = 0.0
  duration = 20.0

  constructor() {
    makeObservable(this, {
      isPlaying: observable,
      position: observable,
      duration: observable,
      play: action,
      stop: action,
      toggle: action,
      scrubTo: action,
      setDuration: action,
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
    } else if (this.position < this.duration) {
      this.play()
    }
  }

  scrubTo(newPosition) {
    this.position = newPosition
  }

  setDuration(newDuration) {
    this.duration = newDuration
  }

  tick(deltaSeconds) {
    if (this.isPlaying) {
      this.position += deltaSeconds
      if (this.position >= this.duration) {
        this.position = this.duration
        this.stop()
      }
    }
  }
}

export default Playback

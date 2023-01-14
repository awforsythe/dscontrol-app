import { makeObservable, observable, computed, action } from 'mobx'

export class SequenceParseError extends Error {
}

class Sequence {
  name = 'seq_001'
  duration = 20.0
  events = {}
  onLoad = null

  constructor() {
    makeObservable(this, {
      name: observable,
      duration: observable,
      events: observable,
      tracks: computed,
      load: action,
    })
  }

  get tracks() {
    // A sequence contains an array of events objects, each consisting of a timestamp
    // labeled 'at', plus one or more control-specific payloads, labeled 'left_stick',
    // 'right_stick', 'button_a', 'button_b', etc. - collate all the events by control,
    // so e.g. eventsByControl.left_stick contains all the left-stick events as an
    // array of { time, data } objects
    let eventsByControl = {}
    for (const event of this.events) {
      const time = event.at
      const controls = Object.keys(event).filter((x) => x !== 'at')
      if (typeof time !== 'number' || controls.length === 0) {
        throw new SequenceParseError('invalid event', event)
      }
      for (const control of controls) {
        let controlEvents = eventsByControl[control]
        if (controlEvents === undefined) {
          controlEvents = []
          eventsByControl[control] = controlEvents
        }
        controlEvents.push({ time, data: event[control] })
      }
    }

    // Sort all events by timestamp
    for (const control in eventsByControl) {
      eventsByControl[control].sort((a, b) => a.time - b.time)
    }

    let stickTracksByControl = {}
    let buttonTracksByControl = {}
    for (const control in eventsByControl) {
      if (control.endsWith('_stick') && control.length > 6) {
        const stickName = control.slice(0, s.lastIndexOf('_stick'))
        let track = stickTracksByControl[stickName]
        if (track === undefined) {
          track = []
          stickTracksByControl[stickName] = track
        }
      } else if (control.startsWith('button_') && control.length > 7) {
        const buttonName = control.slice(7)
        let track = buttonTracksByControl[buttonName]
        if (track === undefined) {
          track = []
          buttonTracksByControl[buttonName] = track
        }
      } else {
        throw new SequenceParseError(`invalid control ${control}`)
      }
    }

    /*
    const sortTracks = (order, a, b) => {
      const indexA = order.indexOf(a)
      const indexB = order.indexOf(b)
      if (indexA >= 0 && indexB >= 0) return indexA - indexB
      else if (indexA >= 0) return -1
      else if (indexB >= 0) return 1
      else return a.localeCompare(b)
    }
    const stickNames = Object.keys(stickTracksByControl).sort((a, b) => (
      sortTracks(['left', 'right'], a, b)
    ))
    const buttonNames = Object.keys(stickTracksByControl).sort((a, b) => (
      sortTracks(['a', 'b', 'x', 'y', 'lb', 'lt', 'rb', 'rt'], a, b)
    ))
    */    


    return []
  }

  load(newName, newDuration, newEvents) {
    this.name = newName
    this.duration = newDuration
    this.events = newEvents
    this.tracks // evaluate tracks to validate events
    if (this.onLoad) {
      this.onLoad()
    }
  }
}

export default Sequence

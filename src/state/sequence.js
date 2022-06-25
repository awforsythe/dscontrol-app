import { makeObservable, observable, action } from 'mobx'

class Sequence {
  name = 'seq_001'
  duration = 20.0

  constructor() {
    makeObservable(this, {
      name: observable,
      duration: observable,
      load: action,
    })
  }

  load(newName, newDuration) {
    this.name = newName
    this.duration = newDuration
  }
}

export default Sequence

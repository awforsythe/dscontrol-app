import Sequence from './sequence'
import Playback from './playback'

class Store {
  sequence = new Sequence()
  playback = new Playback(this.sequence)
}

export default Store

import Prefs from './prefs'
import Sequence from './sequence'
import Playback from './playback'

class Store {
  prefs = new Prefs()
  sequence = new Sequence()
  playback = new Playback(this.sequence)
}

export default Store

import { makeObservable, observable, action } from 'mobx'

const ACTION_ZOOM = 'zoom'
const ACTION_SCROLL = 'scroll'
const ACTION_SCRUB = 'scrub'

const MODIFIER_ACTION = 'action'
const MODIFIER_FASTER = 'faster'

class TimelinePrefs {
  wheelAction = ACTION_ZOOM
  shiftWheelModifier = { type: MODIFIER_ACTION, action: ACTION_SCROLL }
  altWheelModifier = { type: MODIFIER_FASTER }
  shiftAltWheelModifier = null
  
  constructor() {
    makeObservable(this, {
      wheelAction: observable,
      shiftWheelModifier: observable,
      altWheelModifier: observable,
      shiftAltWheelModifier: observable,
    })
  }
  
  resolveAction(hasShift, hasAlt) {
    let action = this.wheelAction
    let usingShiftAltAction = false
    if (hasShift && hasAlt && this.shiftAltWheelModifier && this.shiftAltWheelModifier.type === MODIFIER_ACTION) {
      action = this.shiftAltWheelModifier.action
      usingShiftAltAction = true
    } else if (hasShift && this.shiftWheelModifier && this.shiftWheelModifier.type === MODIFIER_ACTION) {
      action = this.shiftWheelModifier.action
    } else if (hasAlt && this.altWheelModifier && this.altWheelModifier.type === MODIFIER_ACTION) {
      action = this.altWheelModifier.action
    }

    let isFaster = false
    if (hasShift && hasAlt && this.shiftAltWheelModifier && this.shiftAltWheelModifier.type === MODIFIER_FASTER) {
      isFaster = true
    } else if (hasShift && this.shiftWheelModifier && this.shiftWheelModifier.type === MODIFIER_FASTER && !usingShiftAltAction) {
      isFaster = true
    } else if (hasAlt && this.altWheelModifier && this.altWheelModifier.type === MODIFIER_FASTER && !usingShiftAltAction) {
      isFaster = true
    }

    return [action, isFaster]
  }
}

export default TimelinePrefs

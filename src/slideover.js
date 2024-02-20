import Dropdown from './dropdown.js'
import { transition } from './transition'

export default class extends Dropdown {
  static targets = ['overlay', 'close']

  openValueChanged() {
    transition(this.overlayTarget, this.openValue)
    transition(this.menuTarget, this.openValue)
    if (this.hasCloseTarget) transition(this.closeTarget, this.openValue)
  }
}

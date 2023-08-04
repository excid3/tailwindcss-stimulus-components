import Dropdown from './dropdown.js'
import { toggleWithState } from './transition'

export default class extends Dropdown {
  static targets = ['menu', 'overlay', 'close']

  openValueChanged() {
    toggleWithState(this.overlayTarget, this.openValue)
    toggleWithState(this.menuTarget, this.openValue)
    if (this.hasCloseTarget) toggleWithState(this.closeTarget, this.openValue)
  }
}

import { Controller } from '@hotwired/stimulus'
import { toggleWithState } from "./transition"

export default class extends Controller {
  static targets = ['toggleable']
  static values = {
    open: { type: Boolean, default: false }
  }

  toggle(event) {
    this.openValue = !this.openValue
  }

  hide() {
    this.openValue = false
  }

  show() {
    this.openValue = true
  }

  openValueChanged() {
    this.toggleableTargets.forEach(target => {
      toggleWithState(target, this.openValue)
    })
  }
}

import { Controller } from '@hotwired/stimulus'
import { toggleWithState } from "./transition"

export default class extends Controller {
  static targets = ['toggleable']
  static values = {
    open: { type: Boolean, default: false }
  }

  toggle(event) {
    this.openValue = !this.openValue
    this.animate()
  }

  hide() {
    this.openValue = false
    this.animate()
  }

  show() {
    this.openValue = true
    this.animate()
  }

  animate() {
    this.toggleableTargets.forEach(target => {
      toggleWithState(target, this.openValue)
    })
  }
}

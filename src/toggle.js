import { Controller } from '@hotwired/stimulus'
import { transition } from "./transition.js"

export default class extends Controller {
  static targets = ['toggleable']
  static values = {
    open: { type: Boolean, default: false }
  }

  toggle(event) {
    this.openValue = !this.openValue
    this.animate()
  }

  // Sets open to value of checkbox or radio
  toggleInput(event) {
    this.openValue = event.target.checked
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
      transition(target, this.openValue)
    })
  }
}

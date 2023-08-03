import { Controller } from '@hotwired/stimulus'
import { toggleWithState } from "./transition"

export default class extends Controller {
  static targets = ['menu', 'button']
  static values = { open: Boolean, default: false }

  connect() {
    if (this.hasButtonTarget) {
      this.buttonTarget.addEventListener("keydown", this._onMenuButtonKeydown)
      this.buttonTarget.setAttribute("aria-haspopup", "true")
    }
  }

  disconnect() {
    if (this.hasButtonTarget) {
      this.buttonTarget.removeEventListener("keydown", this._onMenuButtonKeydown)
      this.buttonTarget.removeAttribute("aria-haspopup")
    }
  }

  openValueChanged() {
    toggleWithState(this.menuTarget, this.openValue)
  }

  show() {
     this.openValue = true;
  }

  hide(event) {
    if (event.target.nodeType && this.element.contains(event.target) === false && this.openValue) {
      this.openValue = false
    }
  }

  toggle() {
    this.openValue = !this.openValue
  }
}

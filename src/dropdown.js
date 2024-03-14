import { Controller } from '@hotwired/stimulus'
import { transition } from "./transition"

export default class extends Controller {
  static targets = ['menu', 'button', 'menuItem']
  static values = { open: Boolean, default: false }

  connect() {
    document.addEventListener("turbo:before-cache", this.beforeCache.bind(this))

    if (this.hasButtonTarget) {
      this.buttonTarget.addEventListener("keydown", this._onMenuButtonKeydown)
      this.buttonTarget.setAttribute("aria-haspopup", "true")
    }
  }

  disconnect() {
    document.removeEventListener("turbo:before-cache", this.beforeCache.bind(this))

    if (this.hasButtonTarget) {
      this.buttonTarget.removeEventListener("keydown", this._onMenuButtonKeydown)
      this.buttonTarget.removeAttribute("aria-haspopup")
    }
  }

  openValueChanged() {
    transition(this.menuTarget, this.openValue)

    if (this.openValue === true && this.hasMenuItemTarget) {
      this.menuItemTargets[0].focus()
    }
  }

  show() {
     this.openValue = true
  }

  close() {
    this.openValue = false
  }

  hide(event) {
    if (event.target.nodeType && this.element.contains(event.target) === false && this.openValue) {
      this.openValue = false
    }
  }

  toggle() {
    this.openValue = !this.openValue
  }

  nextItem() {
    const nextIndex = Math.min(this.currentItemIndex + 1, this.menuItemTargets.length - 1)
    this.menuItemTargets[nextIndex].focus()
  }

  previousItem() {
    const previousIndex = Math.max(this.currentItemIndex - 1, 0)
    this.menuItemTargets[previousIndex].focus()
  }

  get currentItemIndex() {
    return this.menuItemTargets.indexOf(document.activeElement)
  }

  // Ensures the menu is hidden before Turbo caches the page
  beforeCache() {
    this.openValue = false
    this.menuTarget.classList.add("hidden")
  }
}

import { Controller } from '@hotwired/stimulus'
import { transition } from './transition.js'

export default class extends Controller {
  static targets = ['menu', 'button', 'menuItem']
  static values = {
    open: { type: Boolean, default: false },
    closeOnEscape: { type: Boolean, default: true },
    closeOnClickOutside: { type: Boolean, default: true }
  }
  static classes = ['enter', 'enterFrom', 'enterTo', 'leave', 'leaveFrom', 'leaveTo', 'toggle']

  connect() {
    this.boundBeforeCache = this.beforeCache.bind(this)
    document.addEventListener('turbo:before-cache', this.boundBeforeCache)
  }

  disconnect() {
    document.removeEventListener('turbo:before-cache', this.boundBeforeCache)
  }

  openValueChanged() {
    transition(this.menuTarget, this.openValue, this.transitionOptions)

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

  // Closes dropdown from outside click or keyboard
  hide(event) {
    // if the event is a click and the target is not inside the dropdown, then close it
    if (
      this.closeOnClickOutsideValue &&
      event.target.nodeType &&
      this.element.contains(event.target) === false &&
      this.openValue
    ) {
      this.openValue = false
    }

    // if the event is a keydown and the key is escape, then close it
    if (this.closeOnEscapeValue && event.key === 'Escape' && this.openValue) {
      this.openValue = false
    }
  }

  toggle() {
    this.openValue = !this.openValue
  }

  nextItem(event) {
    event.preventDefault()

    this.menuItemTargets[this.nextIndex].focus()
  }

  previousItem(event) {
    event.preventDefault()

    this.menuItemTargets[this.previousIndex].focus()
  }

  // getters and setters
  get currentItemIndex() {
    return this.menuItemTargets.indexOf(document.activeElement)
  }

  get nextIndex() {
    return Math.min(this.currentItemIndex + 1, this.menuItemTargets.length - 1)
  }

  get previousIndex() {
    return Math.max(this.currentItemIndex - 1, 0)
  }

  get transitionOptions() {
    // once the Class API default values are available, we can simplify this
    return {
      enter: this.hasEnterClass ? this.enterClass : 'transition ease-out duration-100',
      enterFrom: this.hasEnterFromClass ? this.enterFromClass : 'transform opacity-0 scale-95',
      enterTo: this.hasEnterToClass ? this.enterToClass : 'transform opacity-100 scale-100',
      leave: this.hasLeaveClass ? this.leaveClass : 'transition ease-in duration-75',
      leaveFrom: this.hasLeaveFromClass ? this.leaveFromClass : 'transform opacity-100 scale-100',
      leaveTo: this.hasLeaveToClass ? this.leaveToClass : 'transform opacity-0 scale-95',
      toggleClass: this.hasToggleClass ? this.toggleClass : 'hidden',
    }
  }

  // Ensures the menu is hidden before Turbo caches the page
  beforeCache() {
    this.openValue = false
    this.menuTarget.classList.add("hidden")
  }
}

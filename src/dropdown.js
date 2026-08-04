import { Controller } from '@hotwired/stimulus'
import { transition } from './transition.js'

let nextDropdownId = 0

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

    this.setupAccessibility()
  }

  disconnect() {
    document.removeEventListener('turbo:before-cache', this.boundBeforeCache)
  }

  // Labels the menu and its button so screen readers announce the dropdown
  // and its state. Any attribute you set yourself is left alone.
  setupAccessibility() {
    if (!this.hasMenuTarget) return

    if (!this.menuTarget.id) this.menuTarget.id = `dropdown-menu-${++nextDropdownId}`
    if (!this.menuTarget.hasAttribute('role')) this.menuTarget.setAttribute('role', 'menu')

    const button = this.buttonElement
    if (!button) return

    if (!button.id) button.id = `${this.menuTarget.id}-button`
    if (!button.hasAttribute('aria-haspopup')) button.setAttribute('aria-haspopup', 'true')
    if (!this.menuTarget.hasAttribute('aria-labelledby')) this.menuTarget.setAttribute('aria-labelledby', button.id)

    button.setAttribute('aria-controls', this.menuTarget.id)
    button.setAttribute('aria-expanded', this.openValue)
  }

  menuItemTargetConnected(item) {
    if (!item.hasAttribute('role')) item.setAttribute('role', 'menuitem')
    if (!item.hasAttribute('tabindex')) item.setAttribute('tabindex', '-1')
  }

  openValueChanged() {
    transition(this.menuTarget, this.openValue, this.transitionOptions)

    this.buttonElement?.setAttribute('aria-expanded', this.openValue)

    if (this.openValue === true) {
      if (this.hasMenuItemTarget) this.menuItemTargets[0].focus()
    } else {
      this.returnFocus()
    }
  }

  // Focus would be lost to the body when the menu closes underneath it, so send
  // it back to the button. Only when focus is still inside the menu, otherwise
  // we'd steal it from whatever the user clicked to close the dropdown.
  returnFocus() {
    if (!this.hasMenuTarget || !this.menuTarget.contains(document.activeElement)) return

    this.buttonElement?.focus()
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

  // The button target if it was declared, otherwise the control that toggles the menu
  get buttonElement() {
    if (this.hasButtonTarget) return this.buttonTarget

    const selector = `button, [role="button"], [data-action*="${this.identifier}#toggle"], [data-action*="${this.identifier}#show"]`
    return Array.from(this.element.querySelectorAll(selector)).find(
      (element) => !this.hasMenuTarget || !this.menuTarget.contains(element)
    )
  }

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
      enter: this.hasEnterClass ? this.enterClasses.join(' ') : 'transition ease-out duration-100',
      enterFrom: this.hasEnterFromClass ? this.enterFromClasses.join(' ') : 'transform opacity-0 scale-95',
      enterTo: this.hasEnterToClass ? this.enterToClasses.join(' ') : 'transform opacity-100 scale-100',
      leave: this.hasLeaveClass ? this.leaveClasses.join(' ') : 'transition ease-in duration-75',
      leaveFrom: this.hasLeaveFromClass ? this.leaveFromClasses.join(' ') : 'transform opacity-100 scale-100',
      leaveTo: this.hasLeaveToClass ? this.leaveToClasses.join(' ') : 'transform opacity-0 scale-95',
      toggleClass: this.hasToggleClass ? this.toggleClasses.join(' ') : 'hidden',
    }
  }

  // Ensures the menu is hidden before Turbo caches the page
  beforeCache() {
    this.openValue = false
    this.menuTarget.classList.add(this.transitionOptions.toggleClass)
  }
}

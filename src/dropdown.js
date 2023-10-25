import { Controller } from '@hotwired/stimulus'
import { transition } from './transition'

export default class extends Controller {
  static targets = ['menu', 'button', 'menuItem']
  static values = { open: Boolean, default: false }

  // lifecycle
  connect() {
    this.#initializeDropdownActions()
  }

  disconnect() {
    // lets make sure we don't cache with Turbo any open dropdowns
    this.openValue = false
  }

  // callbacks
  openValueChanged() {
    transition(this.menuTarget, this.openValue)

    if (this.openValue === true && this.hasMenuItemTarget) {
      this.menuItemTargets[0].focus()
    }
  }

  // actions
  show() {
    this.openValue = true
  }

  hide(event) {
    if (event.target.nodeType && this.element.contains(event.target) === false && this.openValue) {
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

  // private

  #initializeDropdownActions() {
    // this will set the necessary actions on the dropdown element for it to work
    // data-action="click->dropdown#toggle click@window->dropdown#hide keydown.up->dropdown#previousItem keydown.down->dropdown#nextItem"
    // Note: If existing actions are already specified by the user, they will be preserved and augmented without any redundancy.

    const actions = this.element.dataset.action ? this.element.dataset.action.split(' ') : []
    actions.push('click->dropdown#toggle')
    actions.push('click@window->dropdown#hide')
    actions.push('keydown.up->dropdown#previousItem')
    actions.push('keydown.down->dropdown#nextItem')
    this.element.dataset.action = [...new Set(actions)].join(' ')
  }
}

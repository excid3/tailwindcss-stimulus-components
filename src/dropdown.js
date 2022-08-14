// Visit The Stimulus Handbook for more details
// https://stimulusjs.org/handbook/introduction

// This example controller works with specially annotated HTML like:

// <div class="relative"
//      data-controller="dropdown"
//      data-action="click->dropdown#toggle click@window->dropdown#hide"
//      data-dropdown-active-target="#dropdown-button"
//      data-dropdown-active-class="bg-teal-600"
//      data-dropdown-invisible-class="opacity-0 scale-95"
//      data-dropdown-visible-class="opacity-100 scale-100"
//      data-dropdown-entering-class="ease-out duration-100"
//      data-dropdown-enter-timeout="100"
//      data-dropdown-leaving-class="ease-in duration-75"
//      data-dropdown-leave-timeout="75">
//  <div data-action="click->dropdown#toggle click@window->dropdown#hide" role="button" data-dropdown-target="button" tabindex="0" class="inline-block select-none">
//    Open Dropdown
//  </div>
//  <div data-dropdown-target="menu" class="absolute pin-r mt-2 transform transition hidden opacity-0 scale-95">
//    <div class="bg-white shadow rounded border overflow-hidden">
//      Content
//    </div>
//  </div>
// </div>

import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ['menu', 'button']
  static values = {
    open: Boolean,
    enterTimeout: { type: Number, default: 300 },
    leaveTimeout: { type: Number, default: 300 }
  }

  static classes = ['toggle', 'visible', 'invisible', 'active', 'entering', 'leaving']

  connect() {
    if (this.hasButtonTarget) {
      this.buttonTarget.addEventListener("keydown", this._onMenuButtonKeydown)
    }

    this.element.setAttribute("aria-haspopup", "true")
  }

  disconnect() {
    if (this.hasButtonTarget) {
      this.buttonTarget.removeEventListener("keydown", this._onMenuButtonKeydown)
    }
  }

  toggle() {
    this.openValue = !this.openValue
  }

  openValueChanged() {
    if (this.openValue) {
      this._show()
    } else {
      this._hide()
    }
  }

  _show(cb) {
    setTimeout(
      (() => {
        this.menuTarget.classList.remove(this._toggleClasses)
        this.element.setAttribute("aria-expanded", "true")

        if (this.hasActiveClass) {
          this.element.classList.add(...this.activeClasses)
        }

        if (this.hasEnteringClass) {
          this.menuTarget.classList.add(...this.enteringClasses)
        }

        if (this.hasInvisibleClass) {
          this.menuTarget.classList.remove(...this.invisibleClasses)
        }

        if (this.hasVisibileClass) {
          this.menuTarget.classList.add(...this.visibleClasses)
        }

        setTimeout(
          (() => {
            if (this.hasEnteringClass) {
              this.menuTarget.classList.remove(...this.enteringClasses)
            }
          }).bind(this),
          this.enterTimeoutValue,
        )

        if (typeof cb == 'function') cb()
      }).bind(this),
    )
  }

  _hide(cb) {
    setTimeout(
      (() => {
        if (this.hasActiveClass) {
          this.element.classList.remove(...this.activeClasses)
        }

        if (this.hasInvisibleClass) {
          this.menuTarget.classList.add(...this.invisibleClasses)
        }
        if (this.hasVisibleClass) {
          this.menuTarget.classList.remove(...this.visibleClasses)
        }
        if (this.hasLeavingClass) {
          this.menuTarget.classList.add(...this.leavingClasses)
        }

        setTimeout(
          (() => {
            if (this.hasLeavingClass) {
              this.menuTarget.classList.remove(...this.leavingClasses)
            }

            if (typeof cb == 'function') cb()

            this.menuTarget.classList.add(...this._toggleClasses)
          }).bind(this), this.leaveTimeoutValue)
      }).bind(this),
    )
  }

  _onMenuButtonKeydown = event => {
    switch (event.code) {
      case 'Enter':
      case 'Space':
        event.preventDefault()
        this.toggle()
    }
  }

  show(){
     this.openValue = true;
  }

  hide(event) {
    if (this.element.contains(event.target) === false && this.openValue) {
      this.openValue = false
    }
  }

  get _toggleClasses() {
    return this.hasToggleClass ? this.toggleClasses : ['hidden']
  }
}

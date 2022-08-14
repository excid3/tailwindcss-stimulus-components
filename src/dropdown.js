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

import {Controller} from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ['menu', 'button']
  static values = {
    open: Boolean,
    enterTimeout: {type: Number, default: 300},
    leaveTimeout: {type: Number, default: 300}
  }

  static classes = ['toggle', 'visible', 'invisible', 'active', 'entering', 'leaving']

  connect() {
    if (this.hasButtonTarget) {
      this.buttonTarget.addEventListener("keydown", this._onMenuButtonKeydown)
    }

    if (this.hasButtonTarget) {
      this.buttonTarget.setAttribute('aria-haspopup', 'true')
    } else {
      // this is probably wrong, but for backward compatibility
      this.element.setAttribute('aria-haspopup', 'true')
    }

    // this listens for keyboard events so we can handle things once the menu is open
    this._keyboardListener = this._keyboardListener.bind(this)
    this.focusCaptured = false
    this.activeIndex = 0
  }

  disconnect() {
    if (this.hasButtonTarget) {
      this.buttonTarget.removeEventListener("keydown", this._onMenuButtonKeydown)
    }

    document?.removeEventListener('keydown', this._keyboardListener)
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
    // we attach here because we don't need it unless the dropdown is open
    document.addEventListener('keydown', this._keyboardListener)

    // we do this so the dropdown exists and we can apply transitions to it
    // hidden elements don't allow transitions to be applied
    this.menuTarget.classList.add('invisible')
    this.menuTarget.classList.remove('hidden')

    setTimeout(
      (() => {
        if (this.hasButtonTarget) {
          this.buttonTarget.setAttribute('aria-expanded', 'true')
        } else {
          this.element.setAttribute("aria-expanded", "true")
        }

        this.menuTarget.classList.remove(...this.toggleClasses)
        this.menuTarget.classList.remove('invisible')

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
    document.removeEventListener('keydown', this._keyboardListener)

    setTimeout(
      (() => {
        if (this.hasButtonTarget) {
          this.buttonTarget.setAttribute('aria-expanded', 'false')
        } else {
          this.buttonTarget.setAttribute('aria-expanded', 'false')
        }

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

  show() {
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

  _onMenuButtonKeydown = event => {
    console.log("event key: ", event.key)
    console.log("event keyCode: ", event.keyCode)
    switch (event.code) {
      case 'Enter':
      case 'Space': // space
        event.preventDefault()
        this.toggle()
    }
  }

  // private: handle keyboard events regarding closing the menu and moving around the dropdown
  _keyboardListener(event) {
    if (this._menuItems.length === 0) {
      return
    }

    switch (event.key) {
      case 'Tab':
        event.preventDefault()
        if (!this.focusCaptured) {
          this._focusFirstElement()
        } else {
          this._arrowDown()
        }
        break
      case 'Escape':
        this.openValue = false
        break
      case 'ArrowUp':
        this._arrowUp()
        event.preventDefault()
        break
      case "ArrowDown":
        this._arrowDown()
        event.preventDefault()
        break
    }
  }

  // private: get the menu items that aren't disabled
  get _menuItems() {
    return [...this.menuTarget.querySelectorAll(
      'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])')]
      .filter(el => !el.hasAttribute('disabled') && !el.hasAttribute('aria-hidden'))
  }

// private: focus the first element in the menu
  _focusFirstElement() {
    this._menuItems[0].focus()
    this.focusCaptured = true
  }

// private: focus the last element in the menu
  _focusLastElement() {
    const lastItemIndex = this._menuItems.length - 1
    this._menuItems[lastItemIndex].focus()

    this.activeIndex = lastItemIndex
  }

// private: move one element down in the menu and wrap if necessary
  _arrowDown() {
    if (!this.focusCaptured) {
      this._focusFirstElement();
    } else if (this.activeIndex === this._menuItems.length - 1) {
      this.activeIndex = 0;
      this._focusFirstElement();
    } else {
      this._menuItems[this.activeIndex + 1].focus();
      this.activeIndex += 1;
    }
  }

// private: move one element up in the menu and wrap if necessary
  _arrowUp() {
    if (this.activeIndex === 0) {
      this._focusLastElement();
      return;
    }

    if (this.focusCaptured && this.activeIndex >= 1) {
      this._menuItems[this.activeIndex - 1].focus();
      this.activeIndex -= 1;
    }
  }
}
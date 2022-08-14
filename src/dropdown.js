// Visit The Stimulus Handbook for more details
// https://stimulusjs.org/handbook/introduction

// This example controller works with specially annotated HTML like:

// <div class="relative"
//      data-controller="dropdown"
//      data-action="click->dropdown#toggle click@window->dropdown#hide"
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

// @menuTarget: is the element that contains the dropdown menu content
// @buttonTarget: is the element that is annotated with aria-* attributes showing the dropdown state
// @windowActionTarget: is the element(s) that have a data-action for this controller.  If present, will
//                use to trigger automatic add / remove of a click@window->dropdown#hide handler.
//                Add this if you won't want to clutter the JS console window with a bunch of events
//                that are not necessary when the dropdown is closed.
//
// @openValue: tracks the open / close state of the dropdown. It's managed automatically by the dropdown controller.
// @enterTimeOut: is the duration of the enter animation in milliseconds. Default is 300ms.
// @leaveTimeOut: is the duration of the leave animation in milliseconds. Default is 300ms.
// @removeWindowAction: if true, will remove the click@window->dropdown#hide handler when the dropdown is closed.
//
// All of the classes below are optional:
// @activeClass: is the class to add to the this.element when the dropdown is open.
// @invisibleClass: is the class to add to the this.element when the dropdown is closed.
// @visibleClass: is the class to add to the this.element when the dropdown is open.
// @enteringClass: is the class to add to the this.element when the dropdown is entering.
// @leavingClass: is the class to add to the this.element when the dropdown is leaving.

export default class extends Controller {
  static targets = ['menu', 'button', 'windowAction']

  static values = {
    open: Boolean,
    enterTimeout: {type: Number, default: 300},
    leaveTimeout: {type: Number, default: 300},
    removeWindowAction: {type: Boolean, default: false},
  }

  static classes = ['toggle', 'visible', 'invisible', 'active', 'entering', 'leaving']

  connect() {
    // listens for dropdown open / close events
    if (this.hasButtonTarget) {
      this.element.addEventListener('keydown', this._onMenuButtonKeydown)
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

    // if we have removeWindowAction || windowActionTargets, proactively remove the click@window handler
    // remove the global window click handler if it's present
    // this allows more intentional code: you can have the click@window->dropdown#hide handler in the HTML
    // and we'll still do the right thing
    if (this.hasWindowActionTarget) {
      this.removeWindowActionValue = true

      if (!this.openValue) {
        this._removeDropdownWindowAction()
      }
    }
  }

  disconnect() {
    if (this.hasButtonTarget) {
      this.element.removeEventListener('keydown', this._onMenuButtonKeydown)
    }
    document?.removeEventListener('keydown', this._keyboardListener)
  }

// Public: toggle the open / close state of the dropdown
  toggle() {
    this.openValue = !this.openValue
  }

// Public: show the dropdown
  show() {
    this.openValue = true
  }

// Public: hide the dropdown
  hide(event) {
    if (this.element.contains(event.target) === false && this.openValue) {
      this.openValue = false
    }
  }

// private: trigger the open / close code that does the work
  openValueChanged() {
    if (this.openValue) {
      this._show()
    } else {
      this._hide()
    }
  }

// private: show the dropdown
  _show(cb) {
    // we attach here because we don't need it unless the dropdown is open
    document.addEventListener('keydown', this._keyboardListener)

    // put the global window click handler back
    if (this.removeWindowActionValue) {
      this._addDropdownWindowAction()
    }

    // we do this so the dropdown exists and we can apply transitions to it
    // hidden elements don't allow transitions to be applied
    this.menuTarget.classList.add('invisible')
    this.menuTarget.classList.remove('hidden')

    setTimeout(
      (() => {
        if (this.hasButtonTarget) {
          this.buttonTarget.setAttribute('aria-expanded', 'true')
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

// private: hide the dropdwon
  _hide(cb) {
    document.removeEventListener('keydown', this._keyboardListener)

    // remove the global window click handler
    if (this.removeWindowActionValue) {
      this._removeDropdownWindowAction()
    }

    setTimeout(
      (() => {
        if (this.hasButtonTarget) {
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
          }).bind(this), this.leaveTimeoutValue
        )
      }).bind(this),
    )
  }

// private: handle keyboard events regarding opening the dropdown
  _onMenuButtonKeydown = event => {
    switch (event.code) {
      case 'Enter':
      case 'Space': // space
        event.preventDefault()
        this.toggle()
        break
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

// private: a little chicanery to support a default for our toggle class
  get _toggleClasses() {
    return this.hasToggleClass ? this.toggleClasses : ['hidden']
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

// private: adds a window based click listener so we can close dropdowns
  _addDropdownWindowAction() {
    if (this.removeWindowActionValue) {
      this._doDropdownAddWindowAction(this.buttonTargets)
    }

    if (this.hasWindowActionTarget) {
      this._doDropdownAddWindowAction(this.windowActionTargets)
    }
  }

  _doDropdownAddWindowAction(ary) {
    ary.forEach(target => {
      let actions = target.getAttribute('data-action')
      let moreActions = actions + ' click@window->dropdown#hide'
      target.setAttribute('data-action', moreActions)
    })
  }

// private: removes window based click listeners so we don't process tons of evens when the dropdown is closed
  _removeDropdownWindowAction() {
    if (this.removeWindowActionValue) {
      this._doDropdownRemoveWindowAction(this.buttonTargets)
    }

    if (this.hasWindowActionTarget) {
      this._doDropdownRemoveWindowAction(this.windowActionTargets)
    }
  }

  _doDropdownRemoveWindowAction(ary) {
    ary.forEach(target => {
      let actions = target.getAttribute('data-action')
      let lessActions = actions.split(' ').filter(action => action !== 'click@window->dropdown#hide').join(' ')
      target.setAttribute('data-action', lessActions)
    })
  }
}
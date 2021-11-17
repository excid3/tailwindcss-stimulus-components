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
  static values = { open: Boolean }

  initialize() {
      this.keyboardListener = this.keyboardListener.bind(this);
      this.activeIndex = 0;
      this.capturedFocus = false;
  }

  connect() {
    this.toggleClass = this.data.get('class') || 'hidden'
    this.visibleClass = this.data.get('visibleClass') || null
    this.invisibleClass = this.data.get('invisibleClass') || null
    this.activeClass = this.data.get('activeClass') || null
    this.enteringClass = this.data.get('enteringClass') || null
    this.leavingClass = this.data.get('leavingClass') || null

    if (this.hasButtonTarget) {
      this.buttonTarget.addEventListener("keydown", this._onMenuButtonKeydown)
    }

    this.element.setAttribute("aria-haspopup", "true")
    document.addEventListener('keydown', this.keyboardListener)
  }

  disconnect() {
    if (this.hasButtonTarget) {
      this.buttonTarget.removeEventListener("keydown", this._onMenuButtonKeydown)
    }

    this.activeIndex = 0;
    this.capturedFocus = false;
  }

  keyboardListener(e) {
    if (!this.openValue) {
        return
    }

    if(this.keyboardFocusableElements.length === 0) {
        return
    }

    switch (e.key) {
        case 'Tab':
            if(!this.capturedFocus) { // used for first time, to capture focus, then we let the browser do it's thing
                this._focusFirstElement();
                e.preventDefault();
            }
            break
        case 'Escape':
            this.openValue = false;
            break
        case "ArrowUp":
            this._handleArrowUpKeyPress();
            e.preventDefault();
            break;
        case "ArrowDown":
            this._handleArrowDownKeyPress();
            e.preventDefault();
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
        this.menuTarget.classList.remove(this.toggleClass)
        this.element.setAttribute("aria-expanded", "true")
        this._enteringClassList[0].forEach(
          (klass => {
            this.menuTarget.classList.add(klass)
          }).bind(this),
        )

        this._activeClassList[0].forEach(klass => {
          this.activeTarget.classList.add(klass)
        })
        this._invisibleClassList[0].forEach(klass => this.menuTarget.classList.remove(klass))
        this._visibleClassList[0].forEach(klass => {
          this.menuTarget.classList.add(klass)
        })
        setTimeout(
          (() => {
            this._enteringClassList[0].forEach(klass => this.menuTarget.classList.remove(klass))
          }).bind(this),
          this.enterTimeout[0],
        )

        if (typeof cb == 'function') cb()
      }).bind(this),
    )
  }

  _hide(cb) {
    setTimeout(
      (() => {
        this.element.setAttribute("aria-expanded", "false")
        this._invisibleClassList[0].forEach(klass => this.menuTarget.classList.add(klass))
        this._visibleClassList[0].forEach(klass => this.menuTarget.classList.remove(klass))
        this._activeClassList[0].forEach(klass => this.activeTarget.classList.remove(klass))
        this._leavingClassList[0].forEach(klass => this.menuTarget.classList.add(klass))
        setTimeout(
          (() => {
            this._leavingClassList[0].forEach(klass => this.menuTarget.classList.remove(klass))
            if (typeof cb == 'function') cb()

            this.menuTarget.classList.add(this.toggleClass)
          }).bind(this),
          this.leaveTimeout[0],
        )
      }).bind(this),
    )
  }

  _onMenuButtonKeydown = event => {
    switch (event.keyCode) {
      case 13: // enter
      case 32: // space
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

  _focusFirstElement() {
    this.keyboardFocusableElements[0].focus();
    this.capturedFocus = true;
  }

  _focusLastElement() {
    const lastItemIndex = this.keyboardFocusableElements.length - 1;
    this.keyboardFocusableElements[lastItemIndex].focus();

    this.activeIndex = lastItemIndex;
  }

  _handleArrowUpKeyPress() {
    if (this.activeIndex === 0) {
        this._focusLastElement();
        return;
    }

    if (this.capturedFocus && this.activeIndex >= 1) {
        this.keyboardFocusableElements[this.activeIndex - 1].focus();
        this.activeIndex -= 1;
    }
  }

  _handleArrowDownKeyPress() {
    if (!this.capturedFocus) {
        this._focusFirstElement();
    } else if (this.activeIndex === this.keyboardFocusableElements.length - 1) {
        this.activeIndex = 0;
        this._focusFirstElement();
    } else {
        this.keyboardFocusableElements[this.activeIndex + 1].focus();
        this.activeIndex += 1;
    }
  }

  get activeTarget() {
    return this.data.has('activeTarget')
      ? document.querySelector(this.data.get('activeTarget'))
      : this.element
  }

  get _activeClassList() {
    return !this.activeClass
      ? [[], []]
      : this.activeClass.split(',').map(classList => classList.split(' '))
  }

  get _visibleClassList() {
    return !this.visibleClass
      ? [[], []]
      : this.visibleClass.split(',').map(classList => classList.split(' '))
  }

  get _invisibleClassList() {
    return !this.invisibleClass
      ? [[], []]
      : this.invisibleClass.split(',').map(classList => classList.split(' '))
  }

  get _enteringClassList() {
    return !this.enteringClass
      ? [[], []]
      : this.enteringClass.split(',').map(classList => classList.split(' '))
  }

  get _leavingClassList() {
    return !this.leavingClass
      ? [[], []]
      : this.leavingClass.split(',').map(classList => classList.split(' '))
  }

  get enterTimeout() {
    let timeout = this.data.get('enterTimeout') || '0,0'
    return timeout.split(',').map(t => parseInt(t))
  }

  get leaveTimeout() {
    let timeout = this.data.get('leaveTimeout') || '0,0'
    return timeout.split(',').map(t => parseInt(t))
  }

  get keyboardFocusableElements() {
    return [...this.menuTarget.querySelectorAll(
        'a[href], button, input, textarea, select, details,[tabindex]:not([tabindex="-1"])'
    )]
        .filter(el => !el.hasAttribute('disabled') && !el.getAttribute("aria-hidden"))
  }
}

// Visit The Stimulus Handbook for more details
// https://stimulusjs.org/handbook/introduction

// This example controller works with specially annotated HTML like:
// <div class="relative"
//      data-controller="dropdown"
//      data-dropdown-active-class="hidden"
//      data-dropdown-active-target="#dropdown-closed"
//      data-dropdown-inactive-class="hidden"
//      data-dropdown-inactive-target="#dropdown-opened"
//      data-dropdown-enter-timeout="100"
//      data-dropdown-entering-class="duration-100 ease-out"
//      data-dropdown-invisible-class="scale-95 opacity-0"
//      data-dropdown-leave-timeout="75"
//      data-dropdown-leaving-class="duration-75 ease-in"
//      data-dropdown-visible-class="scale-100 opacity-100">
//  <div data-action="click->dropdown#toggle click@window->dropdown#hide" role="button" data-dropdown-target="button" tabindex="0" class="inline-block select-none">
//    <span id="dropdown-closed">Open</span>
//    <span id="dropdown-opened">Close</Span> Dropdown
//  </div>
//  <div data-dropdown-target="menu" class="absolute hidden mt-2 transition transform scale-95 opacity-0 pin-r">
//    <div class="overflow-hidden bg-white border rounded shadow">
//      Content
//    </div>
//  </div>
// </div>

import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ['menu', 'button']
  static values = { open: Boolean }

  connect() {
    this.toggleClass = this.data.get('class') || 'hidden'
    this.visibleClass = this.data.get('visibleClass') || null
    this.invisibleClass = this.data.get('invisibleClass') || null
    this.inactiveClass = this.data.get('inactiveClass') || null
    this.activeClass = this.data.get('activeClass') || null
    this.enteringClass = this.data.get('enteringClass') || null
    this.leavingClass = this.data.get('leavingClass') || null

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
        this._inactiveClassList[0].forEach(klass => {
          this.inactiveTarget.classList.remove(klass)
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
        this._inactiveClassList[0].forEach(klass => this.inactiveTarget.classList.add(klass))
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

  get activeTarget() {
    return this.data.has('activeTarget')
      ? document.querySelector(this.data.get('activeTarget'))
      : this.element
  }

  get inactiveTarget() {
    return this.data.has('inactiveTarget')
      ? document.querySelector(this.data.get('inactiveTarget'))
      : this.element
  }

  get _activeClassList() {
    return !this.activeClass
      ? [[], []]
      : this.activeClass.split(',').map(classList => classList.split(' '))
  }

  get _inactiveClassList() {
    return !this.inactiveClass
      ? [[], []]
      : this.inactiveClass.split(',').map(classList => classList.split(' '))
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
}

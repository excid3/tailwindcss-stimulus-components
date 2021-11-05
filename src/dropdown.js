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
}

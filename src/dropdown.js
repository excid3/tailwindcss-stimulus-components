// Visit The Stimulus Handbook for more details
// https://stimulusjs.org/handbook/introduction

// This example controller works with specially annotated HTML like:

// <div class="relative" data-controller="dropdown" data-dropdown-inactive-class="invisible" data-dropdown-active-class="visible" data-dropdown-entering-class="entering-transition" data-dropdown-enter-timeout="100" data-dropdown-leaving-class="leaving-transition" data-dropdown-leave-timeout="75">
//  <div data-action="click->dropdown#toggle click@window->dropdown#hide" role="button" class="inline-block select-none">
//    Open Dropdown
//  </div>
//  <div data-target="dropdown.menu" class="absolute pin-r mt-2 hidden">
//    <div class="bg-white shadow rounded border overflow-hidden">
//      Content
//    </div>
//  </div>
// </div>

import { Controller } from 'stimulus'

export default class extends Controller {
  static targets = ['menu']

  connect() {
    this.toggleClass = this.data.get('class') || 'hidden'
    this.inactiveClass = this.data.get('inactiveClass') || null
    this.activeClass = this.data.get('activeClass') || null
    this.enteringClass = this.data.get('enteringClass') || null
    this.enterTimeout = parseInt(this.data.get('enterTimeout')) || 0
    this.leavingClass = this.data.get('leavingClass') || null
    this.leaveTimeout = parseInt(this.data.get('leaveTimeout')) || 0
  }

  toggle() {
    if (this.hidden) {
      this._show()
    } else {
      this._hide()
    }
  }

  _show() {
    this.menuTarget.classList.remove(this.toggleClass)
    this._enteringClassList.forEach(klass => {
      this.activeTarget.classList.add(klass)
    })

    setTimeout(() => {
      this._activeClassList.forEach(klass => {
        this.activeTarget.classList.add(klass)
      })
      this._inactiveClassList.forEach(klass => this.activeTarget.classList.remove(klass))
      setTimeout(() => {
        this._enteringClassList.forEach(klass => this.activeTarget.classList.remove(klass))
      }, this.enterTimeout)
    })
  }

  _hide() {
    this._inactiveClassList.forEach(klass => this.activeTarget.classList.add(klass))
    this._activeClassList.forEach(klass => this.activeTarget.classList.remove(klass))
    this._leavingClassList.forEach(klass => this.activeTarget.classList.add(klass))
    setTimeout(() => {
      this.menuTarget.classList.add(this.toggleClass)
      this._leavingClassList.forEach(klass => this.activeTarget.classList.remove(klass))
    }, this.leaveTimeout)
  }

  hide(event) {
    if (this.element.contains(event.target) === false && !this.hidden) {
      this._hide()
    }
  }

  get hidden() {
    return this.menuTarget.classList.contains(this.toggleClass)
  }

  get activeTarget() {
    return this.data.has('activeTarget')
      ? document.querySelector(this.data.get('activeTarget'))
      : this.element
  }

  get _activeClassList() {
    return !this.activeClass ? [] : this.activeClass.split(' ')
  }

  get _inactiveClassList() {
    return !this.inactiveClass ? [] : this.inactiveClass.split(' ')
  }

  get _enteringClassList() {
    return !this.enteringClass ? [] : this.enteringClass.split(' ')
  }

  get _leavingClassList() {
    return !this.leavingClass ? [] : this.leavingClass.split(' ')
  }
}

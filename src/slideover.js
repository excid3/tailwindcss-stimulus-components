// <div role="main" class="h-screen flex overflow-hidden bg-gray-100"
//      data-controller="slideover"
//      data-sidebar-inactive-class="-translate-x-full,opacity-0"
//      data-sidebar-active-class="translate-x-0,opacity-100"
//      data-sidebar-entering-class=""
//      data-sidebar-enter-timeout="300,300"
//      data-sidebar-leaving-class=""
//      data-sidebar-leave-timeout="300,300"
//      data-sidebar-active-target="#sidebar-target">

import Dropdown from './dropdown.js'

export default class extends Dropdown {
  static targets = ['menu', 'overlay']

  _show() {
    this.overlayTarget.classList.remove(this.toggleClass)

    super._show(
      (() => {
        this._activeClassList[1].forEach(klass => this.overlayTarget.classList.add(klass))
        this._invisibleClassList[1].forEach(klass => this.overlayTarget.classList.remove(klass))
        this._visibleClassList[1].forEach(klass => this.overlayTarget.classList.add(klass))
        setTimeout(
          (() => {
            this._enteringClassList[1].forEach(klass => this.overlayTarget.classList.remove(klass))
          }).bind(this),
          this.enterTimeout[1],
        )
      }).bind(this),
    )
  }

  _hide() {
    this._leavingClassList[1].forEach(klass => this.overlayTarget.classList.add(klass))

    super._hide(
      (() => {
        setTimeout(
          (() => {
            this._visibleClassList[1].forEach(klass => this.overlayTarget.classList.remove(klass))
            this._invisibleClassList[1].forEach(klass => this.overlayTarget.classList.add(klass))
            this._activeClassList[1].forEach(klass => this.overlayTarget.classList.remove(klass))
            this._leavingClassList[1].forEach(klass => this.overlayTarget.classList.remove(klass))
            this.overlayTarget.classList.add(this.toggleClass)
          }).bind(this),
          this.leaveTimeout[1],
        )
      }).bind(this),
    )
  }
}

// Visit The Stimulus Handbook for more details
// https://stimulusjs.org/handbook/introduction

// This example controller works with specially annotated HTML like:

// <div role="main" class="h-screen flex overflow-hidden bg-gray-100"
//      data-controller="slideover"
//      data-slideover-invisible-class="-translate-x-full,opacity-0"
//      data-slideover-visible-class="translate-x-0,opacity-100"
//      data-slideover-entering-class=""
//      data-slideover-enter-timeout="300,300"
//      data-slideover-leaving-class=""
//      data-slideover-leave-timeout="300,300"
//      data-slideover-active-target="#slideover-target">
//      <div id="sidebar">
//        <div data-slideover-target="overlay" class="fixed inset-0 flex z-40 transition-opacity ease-linear duration-300 opacity-0 hidden">
//          <div class="fixed inset-0">
//            <div class="absolute inset-0 bg-gray-600 opacity-75"></div>
//          </div>
//          <div id="slideover-target" data-slideover-target="menu" class="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-gray-800 transition ease-in-out duration-300 transform -translate-x-full hidden">
//            <div class="absolute top-0 right-0 -mr-14 p-1">
//              <button data-action="slideover#_hide" class="flex items-center justify-center h-12 w-12 rounded-full focus:outline-none focus:bg-gray-600" aria-label="Close sidebar">
//                <svg class="h-6 w-6 text-white" stroke="currentColor" fill="none" viewBox="0 0 24 24">
//                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
//                </svg>
//              </button>
//            </div>
//          </div>
//        </div>
//      </div>
// </div>

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

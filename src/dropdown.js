// Visit The Stimulus Handbook for more details
// https://stimulusjs.org/handbook/introduction
//
// This example controller works with specially annotated HTML like:
//
//<div class="relative" data-controller="dropdown">
//  <div data-action="click->dropdown#toggle click@window->dropdown#hide" role="button" class="inline-block select-none">
//    Open Dropdown
//  </div>
//  <div data-target="dropdown.menu" class="absolute pin-r mt-2 hidden">
//    <div class="bg-white shadow rounded border overflow-hidden">
//      Content
//    </div>
//  </div>
//</div>

import { Controller } from 'stimulus'

export default class extends Controller {
  static targets = [ 'menu' ]

  connect() {
    this.toggleClass = this.data.get('class') || 'hidden'
  }

  toggle() {
    this.menuTarget.classList.toggle(this.toggleClass)
  }

  hide(event) {
    if ((this.element.contains(event.target) === false) && (!this.menuTarget.classList.contains(this.toggleClass))) {
      this.menuTarget.classList.add(this.toggleClass)
    }
  }
}

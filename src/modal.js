// Visit The Stimulus Handbook for more details
// https://stimulusjs.org/handbook/introduction
//
// This example controller works with specially annotated HTML like:
//
//<div data-controller="modal" data-action="keydown@window->modal#closeWithKeyboard">
  //<button data-action="click->modal#open">Open Modal</button>

  //<div data-target="modal.container" class="hidden">
    //<div class="fixed z-50 pin-t pin-l w-full h-full table" style="background-color: rgba(0, 0, 0, .5);">
      //<div data-target="modal.background" data-action="click->modal#closeBackground" class="table-cell align-middle">

        //<div class="bg-white w-64 mx-auto rounded shadow p-8">
          //<h2>Content</h2>
          //<button>Does nothing</button>
          //<button data-action="click->modal#close">Close</button>
        //</div>

      //</div>
    //</div>
  //</div>
//</div>

import { Controller } from 'stimulus'

export default class extends Controller {
  static targets = [ 'background', 'container' ]

  connect() {
    this.toggleClass = this.data.get('class') || 'hidden'
  }

  open(e) {
    e.preventDefault()

    // Add right padding to the body so the page doesn't shift
    // when we disable scrolling
    let scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    document.body.style.paddingRight = `${scrollbarWidth}px`

    // Set overflow hidden to prevent scrolling of background
    // This must happen after the scrollbar calculation
    document.body.style.overflow = 'hidden'

    // Unhide the modal
    this.containerTarget.classList.remove(this.toggleClass)
  }

  close(e) {
    e.preventDefault()

    // Remove tweaks for scrollbar
    document.body.style.paddingRight = null
    document.body.style.overflow     = null

    // Hide the modal
    this.containerTarget.classList.add(this.toggleClass)
  }

  closeBackground(e) {
    if (e.target === this.backgroundTarget) { this.close(e) }
  }

  closeWithKeyboard(e) {
    if (e.keyCode == 27) {
      this.close(e)
    }
  }
}

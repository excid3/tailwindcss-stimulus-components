// Visit The Stimulus Handbook for more details
// https://stimulusjs.org/handbook/introduction
//
// This example controller works with specially annotated HTML like:
//
// <div data-controller="modal" data-modal-allow-background-close="false">
//   <a href="#" data-action="click->modal#open" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded">
//     <span>Open Modal</span>
//   </a>
//
//   <!-- Modal Container -->
//   <div data-modal-target="container" data-action="click->modal#closeBackground keyup@window->modal#closeWithKeyboard" class="hidden animated fadeIn fixed inset-0 overflow-y-auto flex items-center justify-center" style="z-index: 9999;">
//     <!-- Modal Inner Container -->
//     <div class="max-h-screen w-full max-w-lg relative">
//       <!-- Modal Card -->
//       <div class="m-1 bg-white rounded shadow">
//         <div class="p-8">
//           <h2 class="text-xl mb-4">Large Modal Content</h2>
//           <p class="mb-4">This is an example modal dialog box.</p>
//
//           <div class="flex justify-end items-center flex-wrap mt-6">
//             <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" data-action="click->modal#close">Close</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// </div>

import { Controller } from "@hotwired/stimulus"
import { enter, leave } from "./transition"

export default class extends Controller {
  static targets = ['container', 'background']
  static values = {
    restoreScroll: { type: Boolean, default: true }
  }

  disconnect() {
    this.close()
  }

  open() {
    this.containerTarget.focus()
    this.lockScroll()
    enter(this.backgroundTarget)
    enter(this.containerTarget)
  }

  close() {
    this.unlockScroll()
    leave(this.containerTarget)
    leave(this.backgroundTarget)
  }

  closeBackground(event) {
    if (event.target === this.containerTarget) this.close()
  }

  lockScroll() {
    // Add right padding to the body so the page doesn't shift
    // when we disable scrolling
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    document.body.style.paddingRight = `${scrollbarWidth}px`

    // Add classes to body to fix its position
    document.body.classList.add('fixed', 'inset-x-0', 'overflow-hidden')

    if (this.restoreScrollValue) {
      // Save the scroll position
      this.saveScrollPosition()

      // Add negative top position in order for body to stay in place
      document.body.style.top = `-${this.scrollPosition}px`
    }
  }

  unlockScroll() {
    // Remove tweaks for scrollbar
    document.body.style.paddingRight = null;

    // Remove classes from body to unfix position
    document.body.classList.remove('fixed', 'inset-x-0', 'overflow-hidden')

    // Restore the scroll position of the body before it got locked
    if (this.restoreScrollValue) {
      this.restoreScrollPosition()

      // Remove the negative top inline style from body
      document.body.style.top = null
    }
  }

  saveScrollPosition() {
    this.scrollPosition = window.pageYOffset || document.body.scrollTop
  }

  restoreScrollPosition() {
    if (this.scrollPosition === undefined) return
    document.documentElement.scrollTop = this.scrollPosition
  }
}

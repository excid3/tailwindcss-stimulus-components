// A Growl-style alert that slides into view at the top of the screen when rendered,
// and slides back out of view when the "X" button is clicked/pressed.
// Visit The Stimulus Handbook for more details
// https://stimulusjs.org/handbook/introduction
//
// This example controller works with specially annotated HTML like:
//
//  <div class="fixed inset-x-0 top-0 flex items-end justify-right px-4 py-6 sm:p-6 justify-end z-30 pointer-events-none">
//     <div data-controller="alert" class="max-w-sm w-full shadow-lg rounded px-4 py-3 rounded relative bg-green-400 border-l-4 border-green-700 text-white pointer-events-auto">
//       <div class="p-2">
//         <div class="flex items-start">
//           <div class="ml-3 w-0 flex-1 pt-0.5">
//             <p class="text-sm leading-5 font-medium">
//               Stimulus is the JS of the future!
//             </p>
//           </div>
//           <div class="ml-4 flex-shrink-0 flex">
//             <button data-action="alert#close" class="inline-flex text-white focus:outline-none focus:text-gray-300 transition ease-in-out duration-150">
//               <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                 <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
//               </svg>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>

import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static values = {
    dismissAfter: Number
  }

  initialize() {
    this.hide()
  }

  connect() {
    setTimeout(() => {
      this.show()
    }, 200)

    // Auto dimiss if defined
    if (this.hasDismissAfterValue) {
      setTimeout(() => {
        this.close()
      }, this.dismissAfterValue)
    }
  }

  close() {
    this.hide()
    setTimeout(() => {
      this.element.remove()
    }, 1100)

  }

  show() {
    this.element.setAttribute(
      'style',
      "transition: 1s; transform:translate(0, 0);",
    )
  }

  hide() {
    this.element.setAttribute(
      'style',
      "transition: 1s; transform:translate(400px, 0);",
    )
  }
}

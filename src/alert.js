import { Controller } from '@hotwired/stimulus'
import { enter, leave } from "./transition.js"

export default class extends Controller {
  static values = {
    dismissAfter: Number,
    showDelay: { type: Number, default: 0 },
  }

  connect() {
    setTimeout(() => {
      enter(this.element)
    }, this.showDelayValue)

    // Auto dismiss if defined
    if (this.hasDismissAfterValue) {
      setTimeout(() => {
        this.close()
      }, this.dismissAfterValue)
    }
  }

  // Runs hide animation and then removes element from the page
  close() {
    leave(this.element).then(() => {
      this.element.remove()
    })
  }
}

// A simple inline popover to be used wherever needed, with a configurable offset.
// Visit The Stimulus Handbook for more details
// https://stimulusjs.org/handbook/introduction
//
// This example controller works with specially annotated HTML like:
//
//<p>
//  Beginning in 2015, Google introduced what is called the
//    <div class="popover inline-block" data-controller="popover" data-popover-translate-x="0" data-popover-translate-y="-128%" data-action="mouseover->popover#mouseOver mouseout->popover#mouseOut">
//      <span class="underline">'local snack pack',</span>
//      <div class="content hidden absolute max-w-xs bg-grey-light rounded p-2" data-popover-target="content">
//        Terrible name - we know. But the biggest name in SEO came up with it.
//      </div>
//    </div>
//  which shows you local search results before normal organic results.
//</p>
//
// You can also toggle the popover using the click action.
// <div class="popover inline-block" data-controller="popover" data-action="click->popover#toggle" data-action="mouseenter->popover#show mouseleave->popover#hide">

import { Controller } from '@hotwired/stimulus'
import { toggleWithState } from "./transition"

export default class extends Controller {
  static targets = ['content']
  static values = {
    dismissAfter: Number,
    open: { type: Boolean, default: false }
  }

  openValueChanged() {
    toggleWithState(this.contentTarget, this.openValue)
    if (this.shouldAutoDismiss) this.scheduleDismissal()
  }

  // If already true, extend the dismissal another X seconds since this will not trigger openValueChanged
  show(event) {
    if (this.shouldAutoDismiss) this.scheduleDismissal()
    this.openValue = true
  }

  hide() {
    this.openValue = false
  }

  toggle() {
    this.openValue = !this.openValue
  }

  get shouldAutoDismiss() {
    return (this.openValue && this.hasDismissAfterValue)
  }

  scheduleDismissal() {
    if (!this.hasDismissAfterValue) return

    // Cancel any existing dismissals
    this.cancelDismissal()

    // Schedule the next dismissal
    this.timeoutId = setTimeout(() => {
      this.hide()
      this.timeoutId = undefined
    }, this.dismissAfterValue)
  }

  cancelDismissal() {
    if (typeof this.timeoutId === "number") {
      clearTimeout(this.timeoutId)
      this.timeoutId = undefined
    }
  }
}

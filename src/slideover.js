import { Controller } from '@hotwired/stimulus'
import { transition } from './transition.js'

export default class extends Controller {
  static targets = ["dialog"]
  static values = {
    open: Boolean
  }

  connect() {
    if (this.openValue) this.open()
    this.boundBeforeCache = this.beforeCache
    document.addEventListener("turbo:before-cache", this.boundBeforeCache)
  }

  disconnect() {
    document.removeEventListener("turbo:before-cache", this.boundBeforeCache)
  }

  open() {
    this.dialogTarget.showModal()
  }

  close() {
    this.dialogTarget.setAttribute("closing", "")

    Promise.all(
      this.dialogTarget.getAnimations().map((animation) => animation.finished),
    ).then(() => {
      this.dialogTarget.removeAttribute("closing")
      this.dialogTarget.close()
    })
  }

  backdropClose(event) {
    if (event.target.nodeName == "DIALOG") this.close()
  }

  show() {
    this.open()
  }

  hide() {
    this.close()
  }

  beforeCache() {
    if (this.hasDialogTarget) {
      this.close()
    }
  }
}

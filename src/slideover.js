import { Controller } from '@hotwired/stimulus'
import { transition } from './transition'

export default class extends Controller {
  static targets = ["dialog"]
  static values = {
    open: Boolean
  }

  connect() {
    if (this.openValue) this.open()
    document.addEventListener("turbo:before-cache", this.beforeCache.bind(this))
  }

  disconnect() {
    document.removeEventListener("turbo:before-cache", this.beforeCache.bind(this))
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
    this.close()
  }
}

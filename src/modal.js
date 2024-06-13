import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["dialog"]
  static values = {
    open: Boolean
  }

  connect() {
    if (this.openValue) this.open()
    this.boundBeforeCache = this.beforeCache.bind(this)
    document.addEventListener("turbo:before-cache", this.boundBeforeCache)
  }

  disconnect() {
    document.removeEventListener("turbo:before-cache", this.boundBeforeCache)
  }

  open() {
    this.dialogTarget.showModal()
  }

  // Allows for a closing animation since display transitions don't work yet
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

  // For showing non-modally
  show() {
    this.dialogTarget.show()
  }

  hide() {
    this.close()
  }

  beforeCache() {
    this.close()
  }
}

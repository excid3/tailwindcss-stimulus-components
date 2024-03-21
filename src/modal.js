import { Controller } from "@hotwired/stimulus"

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
    this.dialogTarget.close()
  }

  backdropClose(event) {
    if (event.target.nodeName == "DIALOG") this.dialogTarget.close()
  }

  // For showing non-modally
  show() {
    this.dialogTarget.show()
  }

  beforeCache() {
    this.close()
  }
}

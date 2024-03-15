import { Controller } from "@hotwired/stimulus"
import { enter, leave } from "./transition"

export default class extends Controller {
  static targets = ["dialog"]
  static values = {
    open: Boolean
  }

  connect() {
    if (this.openValue) this.open()
  }

  open() {
    this.showModal()
  }

  close() {
    this.dialogTarget.close()
  }

  // For showing non-modally
  show() {
    this.dialogTarget.show()
  }
}

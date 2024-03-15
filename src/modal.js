import { Controller } from "@hotwired/stimulus"
import { enter, leave } from "./transition"

export default class extends Controller {
  static targets = ["dialog"]
  static values = {
    open: Boolean
  }

  connect() {
    if (this.openValue) this.showModal()
  }

  showModal() {
    this.dialogTarget.showModal()
  }

  show() {
    this.dialogTarget.show()
  }

  close() {
    this.dialogTarget.close()
  }
}

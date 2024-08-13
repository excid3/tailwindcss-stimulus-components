import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input", "label"]

  connect() {
    this.originalTextClass = this.labelTarget.dataset.labelTextClass || 'text-gray-400'
    this.focusTextClass = this.labelTarget.dataset.labelTextFocusClass || 'text-blue-600'
    
    this.labelTarget.classList.add(this.originalTextClass)
    this.toggleLabel(this.inputTarget.value)
  }

  focus() {
    this.labelTarget.classList.add('scale-75', '-translate-y-5')
    this.labelTarget.classList.remove(this.originalTextClass)
    this.labelTarget.classList.add(...this.focusTextClass.split(' '))
  }

  blur() {
    if (this.inputTarget.value === "") {
      this.labelTarget.classList.remove('scale-75', '-translate-y-5')
      this.labelTarget.classList.remove(...this.focusTextClass.split(' '))
      this.labelTarget.classList.add(this.originalTextClass)
    }
  }

  input() {
    this.toggleLabel(this.inputTarget.value)
  }

  toggleLabel(value) {
    if (value !== "") {
      this.labelTarget.classList.add('scale-75', '-translate-y-5')
      this.labelTarget.classList.remove(this.originalTextClass)
      this.labelTarget.classList.add(...this.focusTextClass.split(' '))
    } else {
      this.labelTarget.classList.remove('scale-75', '-translate-y-5')
      this.labelTarget.classList.remove(...this.focusTextClass.split(' '))
      this.labelTarget.classList.add(this.originalTextClass)
    }
  }
}

import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ['options', 'selectedItems']

  connect() {
    console.log('hi')

    document.addEventListener('click', this.handleOutsideClick.bind(this))
  }

  disconnect() {
    document.removeEventListener('click', this.handleOutsideClick.bind(this))
  }

  toggle() {
    this.optionsTarget.classList.toggle('hidden')
  }

  updateSelection() {
    const checkboxes = this.optionsTarget.querySelectorAll("input[type='checkbox']")
    const selected = Array.from(checkboxes)
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.value)

    this.selectedItemsTarget.textContent = selected.length ? selected.join(', ') : 'Select options'
  }

  handleOutsideClick(event) {
    if (!this.element.contains(event.target)) {
      this.optionsTarget.classList.add('hidden')
    }
  }
}

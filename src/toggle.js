import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ['toggleable']
  static values = { open: Boolean }

  connect() {
    this.toggleClass = this.data.get('class') || 'hidden'
  }

  toggle(event) {
    event.preventDefault()

    this.openValue = !this.openValue
  }

  hide(event) {
    event.preventDefault();

    this.openValue = false;
  }

  show(event) {
    event.preventDefault();

    this.openValue = true;
  }

  openValueChanged() {
    if (!this.toggleClass) { return }

    this.toggleableTargets.forEach(target => {
      target.classList.toggle(this.toggleClass)
    })
  }
}

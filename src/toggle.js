import { Controller } from 'stimulus'

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

  openValueChanged() {
    this.toggleableTargets.forEach(target => {
      target.classList.toggle(this.toggleClass)
    })
  }
}

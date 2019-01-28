import { Controller } from 'stimulus'

export default class extends Controller {
  static targets = ['toggleable']

  connect() {
    this.toggleClass = this.data.get('class') || 'hidden'
  }

  toggle(event) {
    event.preventDefault()

    this.toggleableTargets.forEach(target => {
      target.classList.toggle(this.toggleClass)
    })
  }
}

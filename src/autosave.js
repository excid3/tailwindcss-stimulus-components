import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ['form', 'status']

  connect() {
    this.timeout = null
    this.duration = this.data.get('duration') || 1000
  }

  save() {
    clearTimeout(this.timeout)

    this.timeout = setTimeout(() => {
      this.statusTarget.textContent = 'Saving...'
      Rails.fire(this.formTarget, 'submit')
    }, this.duration)
  }

  success() {
    this.setStatus('Saved!')
  }

  error() {
    this.setStatus('Unable to save!')
  }

  setStatus(message) {
    this.statusTarget.textContent = message

    this.timeout = setTimeout(() => {
      this.statusTarget.textContent = ''
    }, 2000)
  }
}

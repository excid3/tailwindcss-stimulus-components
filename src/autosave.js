import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ['form', 'status']
  static values = {
    submitDuration: {type: Number, default: 1000},
    statusDuration: {type: Number, default: 2000},
    submittingText: {type: String, default: "Saving..."},
    successText: {type: String, default: "Saved!"},
    errorText: {type: String, default: "Unable to save."}
  }

  connect() {
    this.timeout = null
  }

  save() {
    clearTimeout(this.timeout)

    this.timeout = setTimeout(() => {
      this.statusTarget.textContent = this.submittingTextValue
      this.formTarget.requestSubmit()
    }, this.submitDurationValue)
  }

  success() {
    this.setStatus(this.successTextValue)
  }

  error() {
    this.setStatus(this.errorTextValue)
  }

  setStatus(message) {
    this.statusTarget.textContent = message

    this.timeout = setTimeout(() => {
      this.statusTarget.textContent = ''
    }, this.statusDurationValue)
  }
}

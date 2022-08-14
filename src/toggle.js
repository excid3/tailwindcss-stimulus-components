import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ['toggleable']
  static values = { open: Boolean }
  static classes = ['toggle']

  connect() {
    // so we can have a default value if one is not supplied
    this._toggleClass = this.hasToggleClass ? this.toggleClass : 'hidden'
  }

  toggle(event) {
    if (event.target.getAttribute('type') != 'checkbox') {
      event.preventDefault();
    }

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
      target.classList.toggle(this._toggleClass)
    })
  }
}

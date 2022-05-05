import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ['toggleable']
  static values = { open: Boolean }

  connect() {
    this.toggleClass = this.data.get('class') || 'hidden'
  }

  toggle(event) {
    if (event.target.getAttribute('type') != 'checkbox') {
      event.preventDefault();
    }

    this.openValue = !this.openValue
    this.toggleToggleables()
  }

  hide(event) {
    event.preventDefault();

    this.openValue = false;
    this.hideToggleables()
  }

  show(event) {
    event.preventDefault();

    this.openValue = true;
    this.showToggleables()
  }

  toggleToggleables() {
    if (!this.toggleClass) { return }

    this.toggleableTargets.forEach(target => {
      target.classList.toggle(this.toggleClass)
    })
  }
  
  showToggleables() {
    if (!this.toggleClass) { return }
    
    this.toggleableTargets.forEach(target => {
      target.classList.remove(this.toggleClass)
    })
  }
  
  hideToggleables() {
    if (!this.toggleClass) { return }
    
    this.toggleableTargets.forEach(target => {
      target.classList.add(this.toggleClass)
    })
  }
}

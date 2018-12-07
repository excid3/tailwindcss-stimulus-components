import { Controller } from 'stimulus'

export default class extends Controller {
  static targets = [ 'tab', 'panel' ]

  initialize() {
    this.activeTabClasses = (this.data.get('activeTab') || 'active').split(' ')
    this.showTab()
  }

  change(event) {
    event.preventDefault()
    this.index = this.tabTargets.indexOf(event.currentTarget)
  }

  showTab() {
    this.tabTargets.forEach((tab, index) => {
      const panel = this.panelTargets[index]
      panel.classList.toggle('hidden', index != this.index)

      if (index === this.index) {
        tab.classList.add(...this.activeTabClasses)
      } else {
        tab.classList.remove(...this.activeTabClasses)
      }
    })
  }

  get index() {
    return parseInt(this.data.get('index') || 0)
  }

  set index(value) {
    this.data.set('index', value)
    this.showTab()
  }
}

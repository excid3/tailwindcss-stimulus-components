import { Controller } from 'stimulus'

export default class extends Controller {
  static targets = ['tab', 'panel']

  connect() {
    this.activeTabClasses = (this.data.get('activeTab') || 'active').split(' ')
    this.inactiveTabClasses = (this.data.get('inactiveTab') || 'inactive').split(' ')
    if (this.anchor) this.index = this.tabTargets.findIndex((tab) => tab.id === this.anchor)
    this.showTab()

    //if there is a redirect, we won't get the correct url until the turbo:load is fired
    var self = this;
    this.turboLoadListener = function(event) {
      self.setTabFromLocation()
    }
    document.addEventListener('turbo:load', this.turboLoadListener);
  }

  disconnect() {
    document.removeEventListener('turbo:load', this.turboLoadListener);
  }

  change(event) {
    event.preventDefault()

    // If target specifies an index, use that
    if (event.currentTarget.dataset.index) {
      this.index = event.currentTarget.dataset.index

    // If target specifies an index, use that
    } else if (event.currentTarget.dataset.id) {
      this.index = this.tabTargets.findIndex((tab) => tab.id == event.currentTarget.dataset.id)

    // Otherwise, use the index of the current target
    } else {
      this.index = this.tabTargets.indexOf(event.currentTarget)
    }

    window.dispatchEvent(new CustomEvent('tsc:tab-change'))
  }

  showTab() {
    this.tabTargets.forEach((tab, index) => {
      const panel = this.panelTargets[index]

      if (index === this.index) {
        panel.classList.remove('hidden')
        tab.classList.remove(...this.inactiveTabClasses)
        tab.classList.add(...this.activeTabClasses)

        // Update URL with the tab ID if it has one
        // This will be automatically selected on page load
        if (tab.id) {
          location.hash = tab.id
        }
      } else {
        panel.classList.add('hidden')
        tab.classList.remove(...this.activeTabClasses)
        tab.classList.add(...this.inactiveTabClasses)
      }
    })
  }

  get index() {
    return parseInt(this.data.get('index') || 0)
  }

  set index(value) {
    this.data.set('index', (value >= 0 ? value : 0))
    this.showTab()
  }

  get anchor() {
    const bookmark = (document.URL.split('#').length > 1) ? document.URL.split('#')[1] : null;
    const param = (new URLSearchParams(window.location.search)).get("tab")
    return bookmark || param
  }
}

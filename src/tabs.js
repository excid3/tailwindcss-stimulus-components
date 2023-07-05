import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static classes = [ "activeTab", "inactiveTab" ]
  static targets = ['tab', 'panel']
  static values = {
    index: 0,
    updateUrlAnchor: Boolean
  }

  connect() {
    if (this.anchor) this.indexValue = this.tabTargets.findIndex((tab) => tab.id === this.anchor)
    this.showTab()
  }

  change(event) {
    // If target specifies an index, use that
    if (event.currentTarget.dataset.index) {
      this.indexValue = event.currentTarget.dataset.index

    // If target specifies an id, use that
    } else if (event.currentTarget.dataset.id) {
      this.indexValue = this.tabTargets.findIndex((tab) => tab.id == event.currentTarget.dataset.id)

    // Otherwise, use the index of the current target
    } else {
      this.indexValue = this.tabTargets.indexOf(event.currentTarget)
    }

    window.dispatchEvent(new CustomEvent('tsc:tab-change'))
  }

  showTab() {
    this.tabTargets.forEach((tab, index) => {
      const panel = this.panelTargets[index]

      if (index === this.indexValue) {
        panel.classList.remove('hidden')
        if (this.hasInactiveTabClass) tab.classList.remove(...this.inactiveTabClasses)
        if (this.hasActiveTabClass) tab.classList.add(...this.activeTabClasses)
      } else {
        panel.classList.add('hidden')
        if (this.hasActiveTabClass) tab.classList.remove(...this.activeTabClasses)
        if (this.hasInactiveTabClass) tab.classList.add(...this.inactiveTabClasses)
      }
    })
  }

  indexValueChanged() {
    this.showTab()

    // Update URL with the tab ID if it has one
    // This will be automatically selected on page load
    if (this.updateUrlAnchorValue) {
      location.hash = this.tabTargets[this.indexValue].id
    }
  }

  get anchor() {
    return (document.URL.split('#').length > 1) ? document.URL.split('#')[1] : null;
  }
}

import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static classes = [ "activeTab", "inactiveTab" ]
  static targets = ['tab', 'panel', 'select']
  static values = {
    index: 0,
    updateAnchor: Boolean
  }

  connect() {
    if (this.anchor) this.indexValue = this.tabTargets.findIndex((tab) => tab.id === this.anchor)
    this.showTab()
  }

  // Changes to the clicked tab
  change(event) {
    if (event.currentTarget.tagName === "SELECT") {
      this.indexValue = event.currentTarget.selectedIndex

    // If target specifies an index, use that
    } else if (event.currentTarget.dataset.index) {
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

  nextTab() {
    this.indexValue = Math.min(this.indexValue + 1, this.tabsCount - 1)
  }

  previousTab() {
    this.indexValue = Math.max(this.indexValue - 1, 0)
  }

  firstTab() {
    this.indexValue = 0
  }

  lastTab() {
    this.indexValue = this.tabsCount - 1
  }

  indexValueChanged() {
    this.showTab()

    // Update URL with the tab ID if it has one
    // This will be automatically selected on page load
    if (this.updateAnchorValue) {
      location.hash = this.tabTargets[this.indexValue].id
    }
  }

  showTab() {
    this.panelTargets.forEach((panel, index) => {
      const tab = this.tabTargets[index]

      if (index === this.indexValue) {
        panel.classList.remove('hidden')
        if (this.hasInactiveTabClass) tab?.classList?.remove(...this.inactiveTabClasses)
        if (this.hasActiveTabClass) tab?.classList?.add(...this.activeTabClasses)
      } else {
        panel.classList.add('hidden')
        if (this.hasActiveTabClass) tab?.classList?.remove(...this.activeTabClasses)
        if (this.hasInactiveTabClass) tab?.classList?.add(...this.inactiveTabClasses)
      }
    })

    if (this.hasSelectTarget) {
      this.selectTarget.selectedIndex = this.indexValue
    }
  }

  get tabsCount() {
    return this.tabTargets.length
  }

  get anchor() {
    return (document.URL.split('#').length > 1) ? document.URL.split('#')[1] : null;
  }
}

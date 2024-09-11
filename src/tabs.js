import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static classes = [ "activeTab", "inactiveTab" ]
  static targets = ['tab', 'panel', 'select']
  static values = {
    index: 0,
    updateAnchor: Boolean,
    scrollToAnchor: Boolean,
    scrollActiveTabIntoView: Boolean
  }

  initialize() {
    if (this.updateAnchorValue && this.anchor) this.indexValue = this.tabTargets.findIndex((tab) => tab.id === this.anchor)
  }

  connect() {
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
    this.dispatch("tab-change", {
      target: this.tabTargets[this.indexValue],
      detail: {
        activeIndex: this.indexValue
      }
    })
    // Update URL with the tab ID if it has one
    // This will be automatically selected on page load
    if (this.updateAnchorValue) {
      const new_tab_id = this.tabTargets[this.indexValue].id // Grab the id from the newly activated tab
      if (this.scrollToAnchorValue){
        location.hash = new_tab_id // Use location.hash to change the URL with scrolling
      } else {
        const currentUrl = window.location.href // Get the current URL
        const newUrl = currentUrl.split('#')[0] + '#' + new_tab_id // Create a new URL with the updated ID
        if(typeof Turbo !== 'undefined') {
          Turbo.navigator.history.replace(new URL(newUrl))
        } else {
          history.replaceState({}, document.title, newUrl) // Use history.replaceState to change the URL without scrolling
        }
      }
    }
  }

  showTab() {
    this.panelTargets.forEach((panel, index) => {
      const tab = this.tabTargets[index]

      if (index === this.indexValue) {
        panel.classList.remove('hidden')
        tab.ariaSelected = 'true'
        tab.dataset.active =  true
        if (this.hasInactiveTabClass) tab?.classList?.remove(...this.inactiveTabClasses)
        if (this.hasActiveTabClass) tab?.classList?.add(...this.activeTabClasses)
      } else {
        panel.classList.add('hidden')
        tab.ariaSelected = null
        delete tab.dataset.active
        if (this.hasActiveTabClass) tab?.classList?.remove(...this.activeTabClasses)
        if (this.hasInactiveTabClass) tab?.classList?.add(...this.inactiveTabClasses)
      }
    })

    if (this.hasSelectTarget) {
      this.selectTarget.selectedIndex = this.indexValue
    }

    if (this.scrollActiveTabIntoViewValue) this.scrollToActiveTab()
  }

  // If tabs have horizontal scrolling, the active tab may be out of sight.
  // Make sure the active tab is visible by scrolling it into the view.
  scrollToActiveTab() {
    const activeTab = this.element.querySelector('[aria-selected]')
    if (activeTab) activeTab.scrollIntoView({ inline: 'center', })
  }

  get tabsCount() {
    return this.tabTargets.length
  }

  get anchor() {
    return (document.URL.split('#').length > 1) ? document.URL.split('#')[1] : null;
  }
}

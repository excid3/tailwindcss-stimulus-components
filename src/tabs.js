import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ['tab', 'panel', 'select']

  connect() {
    this.activeTabClasses = (this.data.get('activeTab') || 'active').split(' ')
    this.inactiveTabClasses = (this.data.get('inactiveTab') || 'inactive').split(' ')
    if (this.anchor) this.index = this.tabTargets.findIndex((tab) => tab.id === this.anchor)
    this.showTab()
  }

  change(event) {
    event.preventDefault()

    // If target specifies an index, use that
    if (event.currentTarget.dataset.index) {
      this.index = event.currentTarget.dataset.index

    // If target specifies an id, use that
    } else if (event.currentTarget.dataset.id) {
      this.index = this.tabTargets.findIndex((tab) => tab.id == event.currentTarget.dataset.id)

    // If select target is set and matches current emitted event
    } else if (this.hasSelectTarget && event.currentTarget === this.selectTarget) {
      this.index = Array.from(this.selectTarget.children).findIndex(
        (child) => (child.value === this.selectTarget.value),
      );

    // Otherwise, use the index of the current target
    } else {
      this.index = this.tabTargets.indexOf(event.currentTarget)
    }

    window.dispatchEvent(new CustomEvent('tsc:tab-change'))
  }

  showTab() {
    this.tabElements.forEach((tab, index) => {
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
    return (document.URL.split('#').length > 1) ? document.URL.split('#')[1] : null;
  }

  /**
   * Return iterable tab elements for either selectTarget or tabTarget cases
   **/
  get tabElements() {
    if (this.hasTabTargets === undefined && this.hasSelectTarget) {
      return Array.from(this.selectTarget.children);
    }
    return this.tabTargets;
  }
}

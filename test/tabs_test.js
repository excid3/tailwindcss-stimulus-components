import { fixture, expect } from '@open-wc/testing'
import { fetchFixture } from './test_helpers'

import { Application } from '@hotwired/stimulus'
import Tabs from '../src/tabs'

describe('TabsController', () => {
  describe('#default', () => {
    beforeEach(async () => {
      const html = await fetchFixture('index.html')
      await fixture(html)

      const application = Application.start()
      application.register('tabs', Tabs)
    })

    it('applies active class to panel when tab is clicked', () => {
      const tabs = document.querySelectorAll("[data-tabs-target='tab']")
      const panels = document.querySelectorAll("[data-tabs-target='panel']")
      const activeClass = document.querySelector('[data-tabs-active-tab]').dataset.tabsActiveTab

      tabs[2].click()

      expect(tabs[2].className.includes(activeClass)).to.equal(true)
      expect(panels[2].className.includes('hidden')).to.equal(false)
      // click first tab
    })

    it('appends to location href when use-anchor is true', () => {
      const anchorTabCtrlr = document.querySelector("[data-tabs-use-anchor='true']")
      const tab = anchorTabCtrlr.querySelector('#first')

      tab.click()

      expect(window.location.href.includes('#first')).to.equal(true)
    })

    it('applies active class when when data-id node is clicked', () => {
      const anchorTabCtrlr = document.querySelector("[data-tabs-use-anchor='true']")
      const btn = anchorTabCtrlr.querySelector("[data-id='second']")
      const tab = anchorTabCtrlr.querySelector('#second')
      const activeClass = anchorTabCtrlr.dataset.tabsActiveTab

      expect(tab.className.includes(activeClass)).to.equal(false)

      btn.click()

      expect(tab.className.includes(activeClass)).to.equal(true)
    })

    it('does not preventDefault to be nice with radios', () => {
      const firstTab = document.getElementById('radio_default_tab')
      const secondTab = document.getElementById('second_radio_tab')

      const firstRadio = document.getElementById('radio_option_1')
      const secondRadio = document.getElementById('radio_option_2')

      const activeClass = document.getElementById('tabs_with_radios').dataset.tabsActiveTab

      expect(firstRadio.checked).to.equal(true)
      expect(secondRadio.checked).to.equal(false)
      expect(secondTab.className.includes(activeClass)).to.equal(false)

      secondRadio.click()

      expect(firstRadio.checked).to.equal(false)
      expect(secondRadio.checked).to.equal(true)

      // still applies the tab classes
      expect(secondTab.className.includes(activeClass)).to.equal(true)
    })
  })
})

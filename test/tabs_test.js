import { fixture, expect, nextFrame } from '@open-wc/testing'
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

    it('applies active class to panel when tab is clicked', async () => {
      const element = document.querySelector("#tabs")
      const tabs = element.querySelectorAll("[data-tabs-target='tab']")
      const panels = element.querySelectorAll("[data-tabs-target='panel']")
      const activeClass = element.dataset.tabsActiveTabClass

      tabs[2].click()
      await nextFrame()

      expect(tabs[2].className.includes(activeClass)).to.equal(true)
      expect(panels[2].className.includes('hidden')).to.equal(false)
    })

    it('appends to location href when use-anchor is true', () => {
      const anchorTabCtrlr = document.querySelector("[data-tabs-update-anchor-value='true']")
      const tab = anchorTabCtrlr.querySelector('#first')

      tab.click()

      expect(window.location.href.includes('#first')).to.equal(true)
    })

    it('applies active class when when data-id node is clicked', async () => {
      const anchorTabCtrlr = document.querySelector("[data-tabs-update-anchor-value='true']")
      const btn = anchorTabCtrlr.querySelector("[data-id='second']")
      const tab = anchorTabCtrlr.querySelector('#second')
      const activeClass = anchorTabCtrlr.dataset.tabsActiveTabClass

      expect(tab.className.includes(activeClass)).to.equal(false)

      btn.click()
      await nextFrame()

      expect(tab.className.includes(activeClass)).to.equal(true)
    })

    it('does not preventDefault to be nice with radios', async () => {
      const element = document.getElementById('tabs_with_radios')
      const activeClass = element.dataset.tabsActiveTabClass

      const tabs = element.querySelectorAll("[data-tabs-target='tab']")
      const firstTab = tabs[0]
      const secondTab = tabs[1]

      const radios = element.querySelectorAll("input[type='radio']")
      const firstRadio = radios[0]
      const secondRadio = radios[1]

      expect(firstRadio.checked).to.equal(true)
      expect(secondRadio.checked).to.equal(false)
      expect(secondTab.className.includes(activeClass)).to.equal(false)

      secondRadio.click()
      await nextFrame()

      expect(firstRadio.checked).to.equal(false)
      expect(secondRadio.checked).to.equal(true)

      // still applies the tab classes
      expect(secondTab.className.includes(activeClass)).to.equal(true)
    })
  })
})

import { aTimeout, fixture, expect, nextFrame } from '@open-wc/testing'
import { fetchFixture } from './test_helpers'

import { Application } from '@hotwired/stimulus'
import Alert from '../src/alert'

describe('AlertController', () => {
  const loadFixture = async (fixturePath) => {
    const html = await fetchFixture(fixturePath)
    await fixture(html)
    const application = Application.start()
    application.register('alert', Alert)
  }

  const fetchElement = () => document.querySelector("[data-controller='alert'")

  describe('with default values', () => {
    it('shows the element immediately and closes it without delay ', async () => {
      await loadFixture('alerts/alert_default.html')
      expect(fetchElement().className.includes("hidden")).to.equal(false)

      const closeButton = document.querySelector("[data-action='alert#close']")
      closeButton.click()

      await aTimeout(1000)
      expect(fetchElement()).to.equal(null)
    })
  })

  describe('with show delay value', () => {
    it('shows after 1000ms', async () => {
      await loadFixture('alerts/alert_show_delay.html')
      expect(fetchElement().className.includes("hidden")).to.equal(true)

      await aTimeout(1000)
      expect(fetchElement().className.includes("hidden")).to.equal(false)
    })
  })

  describe('with dismiss after value', () => {
    it('dismisses after 500ms', async () => {
      await loadFixture('alerts/alert_dismiss_after.html')
      expect(fetchElement().className.includes("hidden")).to.equal(false)

      await aTimeout(600)
      expect(fetchElement()).to.equal(null)
    })
  })
})

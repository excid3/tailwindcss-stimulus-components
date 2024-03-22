import { aTimeout,waitUntil, fixture, expect, nextFrame } from '@open-wc/testing'
import { sendKeys } from '@web/test-runner-commands';
import { fetchFixture } from './test_helpers'

import { Application } from '@hotwired/stimulus'
import Alert from '../src/alert'

describe('AlertController', () => {
  describe('#default', () => {
    beforeEach(async () => {
      const html = await fetchFixture('alert.html')
      await fixture(html)
      const application = Application.start()
      application.register('alert', Alert)
    })


    it('closes the alert when it appears by default', async () => {
      const element = document.querySelector("[data-controller='alert'")
      expect(element.className.includes("hidden")).to.equal(false)

      const closeButton = document.querySelector("[data-action='alert#close']")
      closeButton.click()

      setTimeout(() => {
        expect(element).to.equal(undefined)
      }, 1000);
    })
  })
})

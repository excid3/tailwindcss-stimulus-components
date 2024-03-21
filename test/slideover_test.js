import { fixture, expect } from '@open-wc/testing'
import { fetchFixture } from './test_helpers'

import { Application } from '@hotwired/stimulus'
import Slideover from '../src/slideover'

describe('SlideoverController', () => {
  describe('#default', () => {
    beforeEach(async () => {
      const html = await fetchFixture('slideover.html')
      await fixture(html)

      const application = Application.start()
      application.register('slideover', Slideover)
    })

    it('opens dialog', () => {
      const dialog = document.querySelector("dialog")
      expect(dialog.hasAttribute("open")).to.equal(false)
      document.querySelector("[data-action='slideover#open']").click()
      expect(dialog.hasAttribute("open")).to.equal(true)
    })
  })
})

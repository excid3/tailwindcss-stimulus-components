import { fixture, expect } from '@open-wc/testing'
import { fetchFixture } from './test_helpers'

import { Application } from '@hotwired/stimulus'
import Slideover from '../src/slideover'

describe('SlideoverController', () => {
  describe('#default', () => {
    beforeEach(async () => {
      const html = await fetchFixture('index.html')
      await fixture(html)

      const application = Application.start()
      application.register('slideover', Slideover)
    })

    it('applies visible class to target ', () => {
      const mobileSidebar = document.querySelector('#sidebar-mobile')
      const invisibleClass = document.querySelector('[data-controller="slideover"]').dataset
        .slideoverInvisibleClass
      const visibleClass = document.querySelector('[data-controller="slideover"]').dataset
        .slideoverVisibleClass

      const overLayTarget = mobileSidebar.querySelector('[data-slideover-target="overlay"]')
      const actionBtn = document.querySelector(
        '[data-action="click->slideover#toggle click@window->slideover#hide"]',
      )

      expect(overLayTarget.className.includes('hidden')).to.equal(true)
      actionBtn.click()
      expect(overLayTarget.className.includes(visibleClass)).to.equal(false)
    })
  })
})

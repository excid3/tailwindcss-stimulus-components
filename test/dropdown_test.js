import { fixture, expect, nextFrame } from '@open-wc/testing'
import { fetchFixture } from './test_helpers'

import { Application } from '@hotwired/stimulus'
import Dropdown from '../src/dropdown'

describe('DropdownController', () => {
  describe('with active target specified', () => {
    beforeEach(async () => {
      const application = Application.start()
      application.register('dropdown', Dropdown)

      const html = await fetchFixture('dropdown.html')
      await fixture(html)
    })

    it('removes hidden class', async () => {
      const menu = document.querySelector('[data-dropdown-target="menu"]')
      const button = document.querySelector('[data-action="dropdown#toggle:stop"]')
      button.click()
      await nextFrame()
      await nextFrame()
      expect(menu.className.includes('hidden')).to.equal(false)
    })
  })
})

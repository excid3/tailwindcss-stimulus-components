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

    it('labels the menu and button', async () => {
      const menu = document.querySelector('[data-dropdown-target="menu"]')
      const button = document.querySelector('[data-action="dropdown#toggle:stop"]')

      expect(menu.getAttribute('role')).to.equal('menu')
      expect(menu.id).to.not.be.empty
      expect(menu.getAttribute('aria-labelledby')).to.equal(button.id)
      expect(button.getAttribute('aria-controls')).to.equal(menu.id)
      expect(button.getAttribute('aria-haspopup')).to.equal('true')

      document.querySelectorAll('[data-dropdown-target="menuItem"]').forEach((item) => {
        expect(item.getAttribute('role')).to.equal('menuitem')
        expect(item.getAttribute('tabindex')).to.equal('-1')
      })
    })

    it('returns focus to the button when closed from a menu item', async () => {
      const button = document.querySelector('[data-action="dropdown#toggle:stop"]')

      button.click()
      await nextFrame()
      expect(document.activeElement).to.equal(document.querySelector('[data-dropdown-target="menuItem"]'))

      document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
      await nextFrame()
      expect(document.activeElement).to.equal(button)
    })

    it('leaves focus alone when closed by clicking outside', async () => {
      const button = document.querySelector('[data-action="dropdown#toggle:stop"]')
      const outside = document.createElement('button')
      document.body.appendChild(outside)

      button.click()
      await nextFrame()

      outside.focus()
      outside.click()
      await nextFrame()
      expect(document.activeElement).to.equal(outside)

      outside.remove()
    })

    it('toggles aria-expanded on the button', async () => {
      const button = document.querySelector('[data-action="dropdown#toggle:stop"]')
      expect(button.getAttribute('aria-expanded')).to.equal('false')

      button.click()
      await nextFrame()
      expect(button.getAttribute('aria-expanded')).to.equal('true')

      button.click()
      await nextFrame()
      expect(button.getAttribute('aria-expanded')).to.equal('false')
    })
  })
})

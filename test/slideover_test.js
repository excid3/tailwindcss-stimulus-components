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
      const dialog = document.querySelector('dialog')
      expect(dialog.hasAttribute('open')).to.equal(false)
      document.querySelector("[data-action='slideover#open']").click()
      expect(dialog.hasAttribute('open')).to.equal(true)
    })

    it('closes the slideover when clicking on the backdrop', async () => {
      const dialog = document.querySelector('dialog')
      const openSlideoverButton = document.querySelector("[data-action='slideover#open']")
      openSlideoverButton.click()
      expect(dialog.hasAttribute('open')).to.equal(true)

      // Simulate clicking on the dialog element itself (the backdrop)
      const clickEvent = new MouseEvent('click', { bubbles: true })
      Object.defineProperty(clickEvent, 'target', { value: dialog })
      dialog.dispatchEvent(clickEvent)

      expect(dialog.hasAttribute('closing')).to.equal(true)
    })

    it('does not close the slideover when clicking inside slideover content', async () => {
      const dialog = document.querySelector('dialog')
      const openSlideoverButton = document.querySelector("[data-action='slideover#open']")
      const input = document.querySelector("[data-testid='slideover-input']")
      openSlideoverButton.click()
      expect(dialog.hasAttribute('open')).to.equal(true)

      // Simulate clicking on the input inside the modal
      input.click()

      expect(dialog.hasAttribute('closing')).to.equal(false)
      expect(dialog.hasAttribute('open')).to.equal(true)
    })

    it('does not close the slideover when text is selected', async () => {
      const dialog = document.querySelector('dialog')
      const openSlideoverButton = document.querySelector("[data-action='slideover#open']")
      openSlideoverButton.click()
      expect(dialog.hasAttribute('open')).to.equal(true)

      // Simulate text selection
      const selection = window.getSelection()
      const input = document.querySelector("[data-testid='slideover-input']")
      input.select()

      // Simulate clicking on the backdrop while text is selected
      const clickEvent = new MouseEvent('click', { bubbles: true })
      Object.defineProperty(clickEvent, 'target', { value: dialog })
      dialog.dispatchEvent(clickEvent)

      // Modal should stay open because text is selected
      expect(dialog.hasAttribute('closing')).to.equal(false)
      expect(dialog.hasAttribute('open')).to.equal(true)

      // Clear selection
      selection.removeAllRanges()
    })
  })
})

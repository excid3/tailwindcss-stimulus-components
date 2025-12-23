import { fixture, expect } from '@open-wc/testing'
import { sendKeys } from '@web/test-runner-commands';
import { fetchFixture } from './test_helpers'

import { Application } from '@hotwired/stimulus'
import Modal from '../src/modal'

describe('ModalController', () => {
  describe('#default', () => {
    beforeEach(async () => {
      const html = await fetchFixture('modal.html')
      await fixture(html)
      const application = Application.start()
      application.register('modal', Modal)
    })

    const openModalButton = document.querySelector("[data-action='modal#open']")

    it('clicks to open and close the modal', async () => {
      const dialog = document.querySelector("dialog")
      const openModalButton = document.querySelector("[data-action='modal#open']")
      openModalButton.click()
      expect(dialog.hasAttribute("open")).to.equal(true)

      const closeModalButton = document.querySelector("[data-action='modal#close']")
      closeModalButton.click()
      expect(dialog.hasAttribute("closing")).to.equal(true)

      await Promise.all(dialog.getAnimations().map((animation) => animation.finished))

      expect(dialog.hasAttribute("closing")).to.equal(false)
      expect(dialog.hasAttribute("open")).to.equal(false)
    })

    it('uses the keyboard to open and close the modal', async () => {
      const dialog = document.querySelector("dialog")
      const openModalButton = document.querySelector("[data-action='modal#open']")
      openModalButton.focus()
      await sendKeys({ press: 'Space' });
      expect(dialog.hasAttribute("open")).to.equal(true)

      await sendKeys({ press: 'Escape' });
      expect(dialog.hasAttribute("open")).to.equal(false)
    })

    it('handles beforeCache callback when dialog target is removed', () => {
      const dialog = document.querySelector("dialog")
      const openModalButton = document.querySelector("[data-action='modal#open']")

      openModalButton.click()
      expect(dialog.hasAttribute("open")).to.equal(true)

      dialog.remove()

      const event = new CustomEvent('turbo:before-cache', { bubbles: true })
      expect(() => document.dispatchEvent(event)).to.not.throw()
    })

    it('closes the modal when clicking on the backdrop', async () => {
      const dialog = document.querySelector("dialog")
      const openModalButton = document.querySelector("[data-action='modal#open']")
      openModalButton.click()
      expect(dialog.hasAttribute("open")).to.equal(true)

      // Simulate clicking on the dialog element itself (the backdrop)
      const clickEvent = new MouseEvent('click', { bubbles: true })
      Object.defineProperty(clickEvent, 'target', { value: dialog })
      dialog.dispatchEvent(clickEvent)

      expect(dialog.hasAttribute("closing")).to.equal(true)
    })

    it('does not close the modal when clicking inside modal content', async () => {
      const dialog = document.querySelector("dialog")
      const openModalButton = document.querySelector("[data-action='modal#open']")
      const input = document.querySelector("[data-testid='modal-input']")
      openModalButton.click()
      expect(dialog.hasAttribute("open")).to.equal(true)

      // Simulate clicking on the input inside the modal
      input.click()

      expect(dialog.hasAttribute("closing")).to.equal(false)
      expect(dialog.hasAttribute("open")).to.equal(true)
    })

    it('does not close the modal when text is selected', async () => {
      const dialog = document.querySelector("dialog")
      const openModalButton = document.querySelector("[data-action='modal#open']")
      openModalButton.click()
      expect(dialog.hasAttribute("open")).to.equal(true)

      // Simulate text selection
      const selection = window.getSelection()
      const input = document.querySelector("[data-testid='modal-input']")
      input.select()

      // Simulate clicking on the backdrop while text is selected
      const clickEvent = new MouseEvent('click', { bubbles: true })
      Object.defineProperty(clickEvent, 'target', { value: dialog })
      dialog.dispatchEvent(clickEvent)

      // Modal should stay open because text is selected
      expect(dialog.hasAttribute("closing")).to.equal(false)
      expect(dialog.hasAttribute("open")).to.equal(true)

      // Clear selection
      selection.removeAllRanges()
    })
  })
})

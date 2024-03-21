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
  })
})

import { fixture, expect, nextFrame } from '@open-wc/testing'
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

    it('adds open attribute when open button is clicked', async () => {
      const dialog = document.querySelector("dialog")
      const openModalButton = document.querySelector("[data-action='modal#open']")
      openModalButton.click()

      expect(dialog.hasAttribute("open")).to.equal(true)
    })

    it('removes open attribute when open button is clicked', async () => {
      const dialog = document.querySelector("dialog")
      dialog.setAttribute("open", true)
      const closeModalButton = document.querySelector("[data-action='modal#close']")
      closeModalButton.click()

      expect(dialog.hasAttribute("open")).to.equal(false)
    })
  })
})

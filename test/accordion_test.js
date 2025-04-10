import { fixture, expect, nextFrame } from '@open-wc/testing'
import { fetchFixture } from './test_helpers'

import { Application } from '@hotwired/stimulus'
import Accordion from '../src/accordion'

describe('AccordionController', () => {
  let application

  describe('default behavior', () => {
    beforeEach(async () => {
      const html = await fetchFixture('accordion.html')
      await fixture(html)
      application = Application.start()
      application.register('accordion', Accordion)
    })

    afterEach(() => {
      if (application) {
        application.stop()
        application = null
      }
    })

    it('clicks to open the accordion panels', async () => {
      const button1 = document.getElementById('button1')
      const button2 = document.getElementById('button2')
      const panel1 = document.getElementById('panel1')
      const panel2 = document.getElementById('panel2')

      expect(panel1.style.height).to.equal('0px')
      expect(panel2.style.height).to.equal('0px')

      button1.click()
      expect(panel1.style.height).to.equal(panel1.dataset.height)
      expect(panel2.style.height).to.equal('0px')

      button2.click()
      expect(panel1.style.height).to.equal('0px')
      expect(panel2.style.height).to.equal(panel2.dataset.height)
    })
  })

  describe('disable exclusiveOpen', () => {
    beforeEach(async() => {
      const html = await fetchFixture('accordion_nonexclusive.html')
      await fixture(html)
      application = Application.start()
      application.register('accordion', Accordion)
    })

    afterEach(() => {
      if (application) {
        application.stop()
        application = null
      }
    })

    it('allows multiple panels to be open simultaneously', () => {
      const button1 = document.getElementById('button1')
      const button2 = document.getElementById('button2')
      const panel1 = document.getElementById('panel1')
      const panel2 = document.getElementById('panel2')

      expect(panel1.style.height).to.equal('0px')
      expect(panel2.style.height).to.equal('0px')

      button1.click()
      expect(panel1.style.height).to.equal(panel1.dataset.height)
      expect(panel2.style.height).to.equal('0px')

      button2.click()
      expect(panel1.style.height).to.equal(panel1.dataset.height)
      expect(panel2.style.height).to.equal(panel2.dataset.height)

      button2.click()
      expect(panel1.style.height).to.equal(panel1.dataset.height)
      expect(panel2.style.height).to.equal('0px')
    })
  })
})

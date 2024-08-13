import { fixture, expect } from '@open-wc/testing'
import { Application } from '@hotwired/stimulus'
import { fetchFixture } from './test_helpers'
import InputFloatingLabel from '../src/input_floating_label'

describe('FloatingLabelController', () => {
  describe('#default', () => {
    beforeEach(async () => {
      const html = await fetchFixture('input_floating_label.html')
      await fixture(html)

      const application = Application.start()
      application.register('input-floating-label', InputFloatingLabel)
    })

    it('moves label up on focus', () => {
      const input = document.querySelector('input')
      const label = document.querySelector('label')

      // Simulate focus event
      input.focus()

      // Check if label moved up and changed class
      expect(label.classList.contains('scale-75')).to.equal(true)
      expect(label.classList.contains('-translate-y-5')).to.equal(true)
      expect(label.classList.contains('text-gray-600')).to.equal(true)
    })

    it('moves label back on blur when input is empty', () => {
      const input = document.querySelector('input')
      const label = document.querySelector('label')

      // Simulate focus and blur events
      input.focus()
      input.blur()

      // Check if label returned to original position and class
      expect(label.classList.contains('scale-75')).to.equal(false)
      expect(label.classList.contains('-translate-y-5')).to.equal(false)
      expect(label.classList.contains('text-gray-600')).to.equal(true)
    })

    it('keeps label up on blur when input has value', () => {
      const input = document.querySelector('input')
      const label = document.querySelector('label')

      // Simulate input event
      input.value = 'test value'
      input.dispatchEvent(new Event('input'))

      // Simulate blur event
      input.blur()

      // Check if label remains up and with focus class
      expect(label.classList.contains('scale-75')).to.equal(true)
      expect(label.classList.contains('-translate-y-5')).to.equal(true)
      expect(label.classList.contains('text-gray-600')).to.equal(true)
    })
  })
})

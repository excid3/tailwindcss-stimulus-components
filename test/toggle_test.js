import { html, fixture, expect, nextFrame } from '@open-wc/testing'

import { Application } from '@hotwired/stimulus'
import Toggle from '../src/toggle'

describe('ToggleController', () => {
  describe('#toggle', () => {
    beforeEach(async () => {
      await fixture(html`
        <div data-controller="toggle" class="m-2">
          <div
            id="toggleAction"
            data-action="click->toggle#toggle"
            class="bg-gray-900 text-white p-6"
          >
            What is the question?
          </div>
          <div
             id="toggleTarget"
             data-toggle-target="toggleable"
             class="hidden m-4"
             data-transition-enter-to="opacity-100"
             >
            <p>This is the answer</p>
          </div>
        </div>
      `)

      const application = Application.start()
      application.register('toggle', Toggle)
    })

    it('removes hidden class', async () => {
      const action = document.querySelector('#toggleAction')
      const target = document.querySelector('#toggleTarget')

      action.click()

      await nextFrame()
      expect(target.className.includes('hidden')).to.equal(false)
    })
  })
})

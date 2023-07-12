import { html, fixture, expect, nextFrame } from '@open-wc/testing'

import { Application } from '@hotwired/stimulus'
import Toggle from '../src/toggle'

describe('ToggleController', () => {
  describe('#toggle', () => {
    beforeEach(async () => {
      await fixture(html`
        <div data-controller="toggle" data-toggle-class="toggledClass" class="m-2">
          <div
            id="toggleAction"
            data-action="click->toggle#toggle"
            class="bg-gray-900 text-white p-6"
          >
            What is the question?
          </div>
          <div id="toggleTarget" data-toggle-target="toggleable" class="m-4">
            <p>This is the answer</p>
          </div>
        </div>
      `)

      const application = Application.start()
      application.register('toggle', Toggle)
    })

    it('adds active class to toggle.toggleable', async () => {
      const toggleAction = document.querySelector('#toggleAction')
      const toggleTarget = document.querySelector('#toggleTarget')

      toggleAction.click()

      await nextFrame()
      expect(toggleTarget.className.includes('toggledClass')).to.equal(true)
    })
  })
})

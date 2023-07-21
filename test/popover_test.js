import { html, fixture, expect, nextFrame } from '@open-wc/testing'

import { Application } from '@hotwired/stimulus'
import Popover from '../src/popover'

describe('PopoverController', () => {
  describe('#popover', () => {
    beforeEach(async () => {
      await fixture(html`
        <div
          class="popover inline-block"
          data-controller="popover"
          data-popover-translate-x="0"
          data-popover-translate-y="-128%"
          data-action="mouseover->popover#show mouseout->popover#hide"
        >
          <span class="underline">'local snack pack',</span>
          <div
            class="content hidden absolute max-w-xs bg-grey-light rounded p-2"
            data-popover-target="content"
          >
            Terrible name - we know. But the biggest name in SEO came up with it.
          </div>
        </div>
      `)

      const application = Application.start()
      application.register('popover', Popover)
    })

    it('mouseOver removes hidden class', async () => {
      const target = document.querySelector('[data-popover-target="content"]')
      const mouseover = new MouseEvent('mouseover', {
        view: window,
        bubbles: true,
        cancelable: true,
      })
      target.dispatchEvent(mouseover)
      await nextFrame()
      expect(target.className.includes('hidden')).to.equal(false)
    })

    it('mouseOut adds hidden class', async () => {
      const target = document.querySelector('[data-popover-target="content"]')
      target.className.replace('hidden', '')
      const mouseout = new MouseEvent('mouseout', {
        view: window,
        bubbles: true,
        cancelable: true,
      })
      target.dispatchEvent(mouseout)
      await nextFrame()
      expect(target.className.includes('hidden')).to.equal(true)
    })
  })
})

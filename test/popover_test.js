import { html, fixture, expect, nextFrame } from '@open-wc/testing'

import { Application } from '@hotwired/stimulus'
import Popover from '../src/popover'

describe('PopoverController', () => {
  describe('#popover', () => {
    beforeEach(async () => {
      await fixture(html`
        <div class="inline-block relative cursor-pointer" data-controller="popover" data-action="mouseenter->popover#show mouseleave->popover#hide">
          <span class="underline">Hover me</span>
          <div class="hidden absolute left-0 bottom-7 w-max bg-white border border-gray-200 shadow rounded p-2"
               data-popover-target="content"
               data-transition-enter="transition-opacity ease-in-out duration-100"
               data-transition-enter-from="opacity-0"
               data-transition-enter-to="opacity-100"
               data-transition-leave="transition-opacity ease-in-out duration-100"
               data-transition-leave-from="opacity-100"
               data-transition-leave-to="opacity-0"
            >
            This popover shows on hover
          </div>
        </div>
      `)

      const application = Application.start()
      application.register('popover', Popover)
    })

    it('mouseOver removes hidden class', async () => {
      const target = document.querySelector('[data-popover-target="content"]')
      const mouseover = new MouseEvent('mouseenter', {
        view: window,
        bubbles: true,
        cancelable: true,
      })
      target.dispatchEvent(mouseover)
      await nextFrame()
      await nextFrame()
      expect(target.className.includes('hidden')).to.equal(false)
    })

    it('mouseOut adds hidden class', async () => {
      const target = document.querySelector('[data-popover-target="content"]')
      target.className.replace('hidden', '')
      const event = new MouseEvent('mouseleave', {
        view: window,
        bubbles: true,
        cancelable: true,
      })

      target.dispatchEvent(event)

      await nextFrame()
      await nextFrame()
      expect(target.className.includes('transition-opacity')).to.equal(true)

      await nextFrame()
      expect(target.className.includes('hidden')).to.equal(true)
      expect(target.className.includes('transition-opacity')).to.not.equal(true)
    })
  })
})

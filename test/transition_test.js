import { html, fixture, expect, nextFrame } from '@open-wc/testing'
import { enter, leave, cancelTransition } from '../src/transition'
import { Application } from '@hotwired/stimulus'
import Popover from '../src/popover'

describe('Transition', () => {
  beforeEach(async () => {
    await fixture(html`
      <div class="inline-block relative cursor-pointer" data-controller="popover" data-action="mouseenter->popover#show mouseleave->popover#hide">
        <span class="underline">Hover me</span>
        <div class="hidden absolute left-0 bottom-7 w-max bg-white border border-gray-200 shadow rounded p-2"
             data-popover-target="content"
             data-transition-enter="transition-opacity ease-in-out duration-100"
             data-transition-enter-from="opacity-0"
             data-transition-enter-to="opacity-100 second-frame"
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

  it('should clean up after a completed transition', async () => {
    const target = document.querySelector('[data-popover-target="content"]')

    await enter(target, {})

    expect(target._stimulus_transition).to.be.null
    expect(target.className.includes('hidden')).to.be.false

    await leave(target, {})

    expect(target.className.includes('hidden')).to.be.true
    expect(target.className.includes('transition-opacity')).to.be.false
    expect(target.className.includes('ease-in-out')).to.be.false
    expect(target._stimulus_transition).to.be.null
  })
  it('should cancel and clean up when canceled before the first stage', async () => {
    const target = document.querySelector('[data-popover-target="content"]')

    enter(target, {})
    cancelTransition(target)

    expect(target.className.includes('second-frame')).to.be.true
    expect(target.className.includes('hidden')).to.be.false
    expect(target.className.includes('transition-opacity')).to.be.false
    expect(target.className.includes('ease-in-out')).to.be.false
    expect(target._stimulus_transition).to.be.null
  })


  it('should cancel and clean up when canceled before second stage', async () => {
    const target = document.querySelector('[data-popover-target="content"]')

    enter(target, {})
    await nextFrame()
    cancelTransition(target)

    expect(target.className.includes('second-frame')).to.be.true
    expect(target.className.includes('hidden')).to.be.false
    expect(target.className.includes('transition-opacity')).to.be.false
    expect(target.className.includes('ease-in-out')).to.be.false
    expect(target._stimulus_transition).to.be.null
  })


  it('should cancel and clean up when canceled after second stage', async () => {
    const target = document.querySelector('[data-popover-target="content"]')

    enter(target, {})
    await nextFrame()
    await nextFrame()
    cancelTransition(target)

    expect(target.className.includes('second-frame')).to.be.true
    expect(target.className.includes('hidden')).to.be.false
    expect(target.className.includes('transition-opacity')).to.be.false
    expect(target.className.includes('ease-in-out')).to.be.false
    expect(target._stimulus_transition).to.be.null
  })
})

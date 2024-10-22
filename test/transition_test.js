import { html, fixture, expect, nextFrame, aTimeout } from '@open-wc/testing'
import { enter, leave, cancelTransition } from '../src/transition'
import { Application } from '@hotwired/stimulus'
import Popover from '../src/popover'

describe('Transition', () => {
  beforeEach(async () => {
    await fixture(html`
      <div class="inline-block relative cursor-pointer" data-controller="popover" data-action="mouseenter->popover#show mouseleave->popover#hide">
        <span class="underline">Hover me</span>
        <div class="foo"
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

  it('should clean up after a completed transition', async () => {
    const target = document.querySelector('[data-popover-target="content"]')

    await enter(target, {})

    expect(target._stimulus_transition).to.be.null
    expect(target.className.includes('hidden')).to.be.false

    await leave(target, {})

    expect(target.className.split(' ')).to.have.members(['foo', 'hidden', 'opacity-0'])
    expect(target._stimulus_transition).to.be.null
  })

  it('cancels a transition that is already running', async () => {
    const target = document.querySelector('[data-popover-target="content"]')

    enter(target)
    await nextFrame()
    expect(target.className.includes('hidden')).to.be.false

    await leave(target, {})
    expect(target.className.includes('hidden')).to.be.true
  })

  describe('has different stages', () => {
    it('should cancel and clean up when canceled before the first stage', async () => {
      const target = document.querySelector('[data-popover-target="content"]')

      await leave(target)
      enter(target, {})

      expect(target.className.split(' ')).to.have.members(['foo', 'opacity-0', 'hidden'])

      cancelTransition(target)

      expect(target.className.split(' ')).to.have.members(['foo', 'opacity-100'])
      expect(target._stimulus_transition).to.be.null
    })

    it('should cancel and clean up when canceled before second stage', async () => {
      const target = document.querySelector('[data-popover-target="content"]')

      await leave(target)
      enter(target, {})
      await nextFrame()

      expect(target.className.split(' ')).to.have.members(['foo', 'opacity-0', 'transition-opacity', 'ease-in-out', 'duration-100'])

      cancelTransition(target)

      expect(target.className.split(' ')).to.have.members(['foo', 'opacity-100'])
      expect(target._stimulus_transition).to.be.null
    })

    it('should cancel and clean up when canceled after second stage', async () => {
      const target = document.querySelector('[data-popover-target="content"]')

      await leave(target)
      enter(target, {})
      await nextFrame()
      await nextFrame()

      expect(target.className.split(' ')).to.have.members(['foo', 'opacity-100', 'transition-opacity', 'ease-in-out', 'duration-100'])

      cancelTransition(target)

      expect(target.className.split(' ')).to.have.members(['foo', 'opacity-100'])
      expect(target._stimulus_transition).to.be.null
    })
  })

  describe('leave()', () => {
    it('parses, adds, and removes the transition classes correctly', async () => {
      const target = document.querySelector('[data-popover-target="content"]')

      await enter(target, {})
      leave(target, {})
      expect(target.className.split(' ')).to.have.members(['foo', 'opacity-100'])

      await nextFrame()
      expect(target.className.split(' ')).to.have.members(['foo', 'opacity-100', 'transition-opacity', 'ease-in-out', 'duration-100'])

      await nextFrame()
      expect(target.className.split(' ')).to.have.members(['foo', 'transition-opacity', 'ease-in-out', 'duration-100', 'opacity-0'])

      await aTimeout(0)
      expect(target.className.split(' ')).to.have.members(['foo', 'opacity-0', 'hidden'])
    })

    it('parses transitionOptions properly', async () => {
      await fixture(html`
          <div id="my-div" class="opacity-100">
            This popover shows on hover
          </div>
      `)

      const target = document.getElementById('my-div')

      leave(target, {
        leave: 'transition-opacity ease-in-out duration-100',
        leaveFrom: 'opacity-100',
        leaveTo: 'opacity-0',
        toggleClass: 'my-hidden'
      })

      expect(target.className.split(' ')).to.have.members(['opacity-100'])

      await nextFrame()
      expect(target.className.split(' ')).to.have.members(['transition-opacity', 'ease-in-out', 'duration-100', 'opacity-100'])

      await nextFrame()
      expect(target.className.split(' ')).to.have.members(['opacity-0', 'transition-opacity', 'ease-in-out', 'duration-100'])

      await aTimeout(0)
      expect(target.className.split(' ')).to.have.members(['my-hidden', 'opacity-0'])
    })
  })

  describe('enter()', () => {
    it('parses, adds, and removes the transition classes correctly', async () => {
      const target = document.querySelector('[data-popover-target="content"]')

      await leave(target, {})
      enter(target, {})
      expect(target.className.split(' ')).to.have.members(['foo', 'hidden', 'opacity-0'])

      await nextFrame()
      expect(target.className.split(' ')).to.have.members(['foo', 'opacity-0', 'transition-opacity', 'ease-in-out', 'duration-100'])

      await nextFrame()
      expect(target.className.split(' ')).to.have.members(['foo', 'transition-opacity', 'ease-in-out', 'duration-100', 'opacity-100'])

      await aTimeout(0)
      expect(target.className.split(' ')).to.have.members(['foo', 'opacity-100'])
    })

    it('parses transitionOptions properly', async () => {
      await fixture(html`
          <div id="my-div" class="my-hidden">
            This popover shows on hover
          </div>
      `)

      const target = document.getElementById('my-div')

      enter(target, {
        enter: 'transition-opacity ease-in-out duration-100',
        enterFrom: 'opacity-0',
        enterTo: 'opacity-100',
        toggle: 'my-hidden'
      })

      expect(target.className.split(' ')).to.have.members(['my-hidden'])

      await nextFrame()
      expect(target.className.split(' ')).to.have.members(['opacity-0', 'transition-opacity', 'ease-in-out', 'duration-100'])

      await nextFrame()
      expect(target.className.split(' ')).to.have.members(['transition-opacity', 'ease-in-out', 'duration-100', 'opacity-100'])

      await aTimeout(0)
      expect(target.className.split(' ')).to.have.members(['opacity-100'])
    })
  })

  describe('cancelTransition()', () => {
    it("doesn't error when a canceling a transition that is already finished", async () => {
      const target = document.querySelector('[data-popover-target="content"]')
      await enter(target, {})
      expect(() => cancelTransition(target)).to.not.throw()
    })
  })
})

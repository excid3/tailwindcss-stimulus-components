import { Application } from '@hotwired/stimulus'
import { expect, fixture, html } from '@open-wc/testing'
import MultiSelect from '../src/multi_select'
import { fetchFixture } from './test_helpers'

describe('MultiSelectController', () => {
  beforeEach(async () => {
    const application = Application.start()
    application.register('multi-select', MultiSelect)

    const html = await fetchFixture('multi_select.html')
    await fixture(html)
  })

  it('should toggle options visibility when clicked', async () => {
    const toggleButton = document.querySelector('[data-action="click->multi-select#toggle"]')
    const options = document.querySelector('[data-multi-select-target="options"]')

    // on initialization: options should be hidden
    expect(options.classList.contains('hidden')).to.be.true

    // clicking the multi-select button shows options (hidden removed)
    toggleButton.click()
    await document.updateComplete
    expect(options.classList.contains('hidden')).to.be.false

    // click the same button again to hide options (hidden re-added)
    toggleButton.click()
    await document.updateComplete
    expect(options.classList.contains('hidden')).to.be.true
  })

  it('should update selected items text when checkboxes are checked', async () => {
    const checkbox1 = document.querySelector('input[value="Option 1"]')
    const selectedItems = document.querySelector('[data-multi-select-target="selectedItems"]')

    // check the first checkbox, confirm its checked
    checkbox1.click()
    await document.updateComplete // Wait for updates to apply
    expect(selectedItems.textContent).to.equal('Option 1')

    // check the second checkbox, confirm again
    const checkbox2 = document.querySelector('input[value="Option 2"]')
    checkbox2.click()
    await document.updateComplete
    expect(selectedItems.textContent).to.equal('Option 1, Option 2')

    // uncheck the first checkbox, confirm first option not present
    checkbox1.click()
    await document.updateComplete
    expect(selectedItems.textContent).to.equal('Option 2')
  })

  it('should reset text when no checkboxes are checked', async () => {
    const selectedItems = document.querySelector('[data-multi-select-target="selectedItems"]')
    const checkboxes = document.querySelectorAll('input[type="checkbox"]')

    // check starting value
    expect(selectedItems.textContent).to.equal('Select options')

    // check all boxes and confirm all checked labels are showing
    checkboxes.forEach(checkbox => checkbox.click())
    await document.updateComplete
    expect(selectedItems.textContent).to.equal('Option 1, Option 2, Option 3')

    // uncheck all boxes - confirm starting phrase visible
    checkboxes.forEach(checkbox => checkbox.click())
    await document.updateComplete
    expect(selectedItems.textContent).to.equal('Select options')
  })
})

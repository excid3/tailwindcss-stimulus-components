import { Application, Controller } from "stimulus"
import Dropdown from 'dropdown'

describe("DropdownController", () => {

  describe("with active target specified", () => {
    beforeEach(() => {
      jest.useFakeTimers()
      document.body.innerHTML = `
 <div class="relative"
      data-dropdown-active-target='#active_target' data-controller="dropdown"
      data-action="click->dropdown#toggle click@window->dropdown#hide"
      data-dropdown-active-target="#dropdown-button"
      data-dropdown-active-class="bg-teal-600"
      data-dropdown-invisible-class="opacity-0 scale-95"
      data-dropdown-visible-class="opacity-100 scale-100"
      data-dropdown-entering-class="ease-out duration-100"
      data-dropdown-enter-timeout="100"
      data-dropdown-leaving-class="ease-in duration-75"
      data-dropdown-leave-timeout="75">
  <div data-action="click->dropdown#toggle click@window->dropdown#hide" role="button" class="inline-block select-none">
    Open Dropdown
  </div>
  <div id='active_target' data-target="dropdown.menu" class="absolute pin-r mt-2 transform transition hidden opacity-0 scale-95">
    <div class="bg-white shadow rounded border overflow-hidden">
      Content
    </div>
  </div>
 </div>
      `
      const application = Application.start();
      application.register("dropdown", Dropdown);
    });

    it('applies visible class to target ', () => {
      const target = document.querySelector('[data-target="dropdown.menu"]');
      const action = document.querySelector('[data-action]');
      action.click()
      jest.runAllTimers()
      expect(target.className).toMatch('opacity-100 scale-100')
    })
  });
});


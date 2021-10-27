/**
 * @jest-environment jsdom
 */

import { Application, Controller } from "@hotwired/stimulus"
import Dropdown from 'dropdown'

describe("DropdownController", () => {

  describe("with active target specified", () => {
    beforeEach(() => {
      jest.useFakeTimers('legacy');

      document.body.innerHTML = `
 <div class="relative"
      data-dropdown-active-target='#active_target' data-controller="dropdown"
      data-action="click->dropdown#toggle click@window->dropdown#hide"
      data-dropdown-active-target="#dropdown-button"
      data-dropdown-open-value="false"
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
  <div id='active_target' data-dropdown-target="menu" class="absolute pin-r mt-2 transform transition hidden opacity-0 scale-95">
    <div class="bg-white shadow rounded border overflow-hidden">
      Content
    </div>
  </div>
 </div>
      `
      const application = Application.start();
      application.register("dropdown", Dropdown);
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('applies visible class to target ', async () => {
      const target = document.querySelector('[data-dropdown-target="menu"]');
      const action = document.querySelector('[data-action]');
      action.click()
      expect(setTimeout).toHaveBeenCalledTimes(1);
      await Promise.resolve();
      jest.runOnlyPendingTimers();
      expect(target.className).toMatch('opacity-100 scale-100')
    })
  });
});


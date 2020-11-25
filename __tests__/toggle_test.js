'use strict';

import { Application, Controller } from "stimulus";
import Toggle from "toggle";

const emitEvent = (element, eventType) => {
  const event = new Event(eventType);
  element.dispatchEvent(event);
};

describe("ToggleController", () => {
  describe(".toggledClass", () => {
    beforeEach(() => {
      document.body.innerHTML = `<div data-controller='toggle' class="m-2">
    <div data-action='click->toggle#toggle' class="bg-gray-900 text-white p-6">
      What is the question?
    </div>
    <div id='toggleTarget' data-target='toggle.toggleable' class="m-4 hidden">
      <p>This is the answer</p>
    </div>
  </div>`

      const application = Application.start();
      application.register("toggle", Toggle);
    });


    it("toggles hidden class from toggle.toggleable", () => {
      let toggleTarget = document.getElementById('toggleTarget')
      const evt = new Event('click', { bubbles: true, cancelable: false, composed: false });
      toggleTarget.stimulate('click');
      console.log(toggleTarget.className)
      toggleTarget.dispatchEvent(evt)
      toggleTarget.stimulate('click');
      console.log(toggleTarget.className)
      expect(toggleTarget.className.includes('hidden')).toEqual(false)

    });
  });
});


/**
 * @jest-environment jsdom
 */

import { Application, Controller } from "@hotwired/stimulus"
import Slideover from 'slideover'

const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, './fixtures/index.html'), 'utf8');

describe("SlideoverController", () => {

  describe("#default", () => {
    beforeEach(() => {
      jest.useFakeTimers()
      document.body.innerHTML = html.toString();
      const application = Application.start();
      application.register("slideover", Slideover);
    });

    it('applies visible class to target ', () => {
      const mobileSidebar = document.querySelector('#sidebar-mobile')
      const invisibleClass =  document.querySelector('[data-controller="slideover"]').dataset.slideoverInvisibleClass
      const visibleClass =  document.querySelector('[data-controller="slideover"]').dataset.slideoverVisibleClass

      const overLayTarget = mobileSidebar.querySelector('[data-slideover-target="overlay"]')
      const actionBtn = document.querySelector('[data-action="click->slideover#toggle click@window->slideover#hide"]')

      expect(overLayTarget.className.includes('hidden')).toEqual(true)
      actionBtn.click()
      jest.runAllTimers()
      expect(overLayTarget.className.includes(visibleClass)).toEqual(false)
    })
  });
});


/**
 * @jest-environment jsdom
 */

import { Application, Controller } from "@hotwired/stimulus";
import Popover from "popover";

describe("PopoverController", () => {
  describe("#popover", () => {
    beforeEach(() => {
      document.body.innerHTML = `
          <div class="popover inline-block" data-controller="popover" data-popover-translate-x="0" data-popover-translate-y="-128%" data-action="mouseover->popover#mouseOver mouseout->popover#mouseOut">
      <span class="underline">'local snack pack',</span>
      <div class="content hidden absolute max-w-xs bg-grey-light rounded p-2" data-popover-target="content">
        Terrible name - we know. But the biggest name in SEO came up with it.
      </div>
    </div>
  which shows you local search results before normal organic results.
</p>

      `

      const application = Application.start();
      application.register("popover", Popover);
    });


    it("mouseOver removes hidden class", () => {
      const target = document.querySelector('[data-popover-target="content"]')
      const mouseover = new MouseEvent('mouseover', {
        view: window,
        bubbles: true,
        cancelable: true
      });
      target.dispatchEvent(mouseover)
      expect(target.className.includes('hidden')).toEqual(false)
    });

    it("mouseOut adds hidden class", () => {
      const target = document.querySelector('[data-popover-target="content"]')
      target.className.replace('hidden', '')
      const mouseout = new MouseEvent('mouseout', {
        view: window,
        bubbles: true,
        cancelable: true
      });
      target.dispatchEvent(mouseout)
      expect(target.className.includes('hidden')).toEqual(true)
    })
  });
});


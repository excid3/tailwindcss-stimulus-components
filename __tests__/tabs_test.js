/**
 * @jest-environment jsdom
 */

import { Application, Controller } from "@hotwired/stimulus";
import Tabs from "tabs";

const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, './fixtures/index.html'), 'utf8');

describe("TabsController", () => {

  describe("#default", () => {
    beforeEach(() => {
      document.body.innerHTML = html.toString();
      const application = Application.start();
      application.register("tabs", Tabs);
    });


    it("applies active class to panel when tab is clicked", () => {
      const tabs = document.querySelectorAll("[data-tabs-target='tab']")
      const panels = document.querySelectorAll("[data-tabs-target='panel']")
      const activeClass = document.querySelector('[data-tabs-active-tab]').dataset.tabsActiveTab

      tabs[2].click()
      expect(tabs[2].className.includes(activeClass)).toEqual(true)
      expect(panels[2].className.includes('hidden')).toEqual(false)
      // click first tab
    });

    it("appends to location href when use-anchor is true", () => {
      const anchorTabCtrlr = document.querySelector("[data-tabs-use-anchor='true']")
      const tab = anchorTabCtrlr.querySelector('#first')
      tab.click()
      expect(window.location.href.includes('#first')).toEqual(true)
    });

    it("applies active class when when data-id node is clicked", () => {
      const anchorTabCtrlr = document.querySelector("[data-tabs-use-anchor='true']")
      const btn = anchorTabCtrlr.querySelector("[data-id='second']")
      const tab = anchorTabCtrlr.querySelector('#second')
      const activeClass = anchorTabCtrlr.dataset.tabsActiveTab
      btn.click()
      expect(tab.className.includes(activeClass)).toEqual(true)
    });

  });
});


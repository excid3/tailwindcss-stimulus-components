/**
 * @jest-environment jsdom
 */

import { Application, Controller } from '@hotwired/stimulus';
import Modal from 'modal';

const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, './fixtures/index.html'), 'utf8');

describe('ModalController', () => {

  describe('#default', () => {
    beforeEach(() => {
      document.body.innerHTML = html.toString();
      const application = Application.start();
      application.register('modal', Modal);
    });

    it('applies classes to body when modal is open', () => {
      const actionBtn = document.querySelector('[data-action="click->modal#open"]');
      actionBtn.click();
      expect(document.body.matches('.fixed.inset-x-0.overflow-hidden.relative')).toEqual(true);
    });

    it('removes classes to body when modal is close', () => {
      const closeBtn = document.querySelector('[data-action="click->modal#close"]');
      closeBtn.click();
      expect(document.body.matches('.fixed.inset-x-0.overflow-hidden.relative')).toEqual(false);
    });

  });
});

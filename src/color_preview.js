// A color picker preview where you can choose to have the color or backgroundColor
// get updated based on the result of a color picker. It also supports ensuring
// the foreground text is always readable by performing a YIQ calculation to
// set the text to black or white based on the contrast of the color and backgroundColor.

import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ['preview', 'color'];
  static values = {
    style: {type: String, default: "backgroundColor"}
  }

  update() {
    this.preview = this.colorTarget.value
  }

  set preview(color) {
    this.previewTarget.style[this.styleValue] = color

    // Ensure the foreground text is always readable by setting either the
    // backgroundColor or color to black or white.
    const yiqColor = this._getContrastYIQ(color)

    if (this.styleValue === 'color') {
      this.previewTarget.style.backgroundColor = yiqColor
    } else {
      this.previewTarget.style.color = yiqColor
    }
  }

  _getContrastYIQ(hexColor) {
    // Taken from: https://24ways.org/2010/calculating-color-contrast/
    hexColor = hexColor.replace('#', '');

    const yiqThreshold = 128;
    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 2), 16);
    const b = parseInt(hexColor.substr(4, 2), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

    return (yiq >= yiqThreshold) ? '#000' : '#fff';
  }
}

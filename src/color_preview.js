// A color picker preview where you can choose to have the color or backgroundColor
// get updated based on the result of a color picker. It also supports ensuring
// the foreground text is always readable by performing a YIQ calculation to
// set the text to black or white based on the contrast of the color and backgroundColor.
//
// The example below uses the native HTML5 color picker for picking the color but
// you can swap it with anything you'd like:
//
// <div class="col-span-6 sm:col-span-3">
//   <label for="hex_color_bg" class="block text-sm font-medium text-gray-700">
//     Color
//   </label>
//   <div class="mt-3 flex items-center" data-controller="color-preview">
//     <p data-color-preview-target="preview"
//        class="h-10 w-10 mr-2 rounded-full text-2xl text-white text-center"
//        style="background-color: #ba1e03; color: #fff; padding-top: 1px;">
//       A
//     </p>
//     <span class="ml-2">
//       <div class="flex rounded-md shadow-sm">
//         <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
//           #
//         </span>
//         <input data-action="input->color-preview#update" data-color-preview-target="color"
//                id="hex_color_bg" name="hex_color_bg" type="color" value="#ba1e03"
//                class="focus:ring-indigo-500 focus:border-indigo-500 block shadow-sm sm:text-sm border-gray-300 flex-1 rounded-r-md mt-0 w-24 h-8 px-1 py-1 border" />
//       </div>
//     </span>
//   </div>
// </div>

import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ['preview', 'color'];

  connect() {
    this.styleProperty = this.data.get('style') || 'backgroundColor';
  }

  update() {
    this.preview = this.color;
  }

  set preview(color) {
    this.previewTarget.style[this.styleProperty] = color;

    // Ensure the foreground text is always readable by setting either the
    // backgroundColor or color to black or white.
    const yiqColor = this._getContrastYIQ(color);

    if (this.styleProperty === 'color') {
        this.previewTarget.style.backgroundColor = yiqColor;
    } else {
        this.previewTarget.style.color = yiqColor;
    }
  }

  get color() {
    return this.colorTarget.value;
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

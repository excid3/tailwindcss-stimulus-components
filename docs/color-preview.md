# Color Picker and Preview

A color picker preview where you can choose to have the color or backgroundColor get updated based on the result of a color picker.

It also supports ensuring the foreground text is always readable by performing a YIQ calculation to set the text to black or white based on the contrast of the color and backgroundColor.

## Usage

```html
<div class="mt-3 flex items-center" data-controller="color-preview">
  <p data-color-preview-target="preview" class="h-10 w-10 mr-2 rounded-full text-2xl text-white text-center" style="background-color: #ba1e03; color: #fff; padding-top: 1px;">A</p>
  <span class="ml-2">
    <div class="flex rounded-md shadow-sm">
      <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">#</span>
      <input data-action="input->color-preview#update"
        data-color-preview-target="color"
        id="hex_color_bg"
        name="hex_color_bg"
        type="color"
        value="#ba1e03"
        class="focus:ring-indigo-500 focus:border-indigo-500 block shadow-sm sm:text-sm border-gray-300 flex-1 rounded-r-md mt-0 w-24 h-8 px-1 py-1 border" />
    </div>
  </span>
</div>
```

This will update the `backgroundColor` by default but you can choose to have the color preview update the `color` instead by setting the `data-color-preview-style-value="color"` attribute of the color preview controller.
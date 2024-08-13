# Input Floating Label Component

## Usage

```js
import { InputFloatingLabel } from "tailwindcss-stimulus-components"
application.register('input-floating-label', InputFloatingLabel)
```

```html
<div data-controller="input-floating-label" class="relative mt-6">
  <input name="example" id="example" data-action="focus->input-floating-label#focus blur->input-floating-label#blur input->input-floating-label#input" data-input-floating-label-target="input" placeholder=" " class="block w-full px-3 py-2 text-base placeholder-transparent border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"/>
  <label for="example" data-input-floating-label-target="label" data-label-text-class="text-gray-600" data-label-text-focus-class="text-gray-600 font-bold bg-white" class="absolute left-3 top-2 px-1 text-base transition-all transform origin-left">This is an example</label>
</div>
```

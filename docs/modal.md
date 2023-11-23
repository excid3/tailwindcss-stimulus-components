# Modal Component

![modal](modal.gif)

## Usage

```javascript
import { Modal } from "tailwindcss-stimulus-components"
application.register('modal', Modal)
```

```html
<div data-controller="modal" data-action="keydown.esc->modal#close" tabindex="-1" class="relative z-10">
  <button data-action="click->modal#open" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Open Modal</button>

  <!-- Modal Background -->
  <div class="hidden fixed inset-0 bg-black bg-opacity-80 overflow-y-auto flex items-center justify-center"
        data-modal-target="background"
        data-action="click->modal#closeBackground"
        data-transition-enter="transition-all ease-in-out duration-300"
        data-transition-enter-from="bg-opacity-0"
        data-transition-enter-to="bg-opacity-80"
        data-transition-leave="transition-all ease-in-out duration-300"
        data-transition-leave-from="bg-opacity-80"
        data-transition-leave-to="bg-opacity-0">

    <!-- Modal Container -->
    <div data-modal-target="container" class="max-h-screen w-full max-w-lg relative">
      <!-- Modal Card -->
      <div class="m-1 bg-white rounded shadow">
        <div class="p-8">
          <h2 class="text-xl mb-4">Large Modal Content</h2>
          <p class="mb-4">This is an example modal dialog box.</p>

          <div class="flex justify-end items-center flex-wrap mt-6">
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" data-action="click->modal#close:prevent">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

`data-modal-restore-scroll-value` may be set to `false` to disable
restoring scroll position.

`data-modal-open-value` may be set to `true` to open modal on page load.
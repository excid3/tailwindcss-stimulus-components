# Slideover Component

![slideover](slideover.gif)

## Usage

```js
import { Slideover } from "tailwindcss-stimulus-components"
application.register('slideover', Slideover)
```

```html
<div class="container mx-auto p-8" data-controller="slideover" data-action="keydown.esc->modal#close" tabindex="-1">
  <!-- begin sidebar/slideover -->
  <div id="sidebar-mobile">
    <div data-slideover-target="overlay"
          class="hidden fixed inset-0 flex z-40"
          data-transition-enter="transition ease-out duration-200"
          data-transition-enter-from="opacity-0"
          data-transition-enter-to="opacity-100"
          data-transition-leave="transition ease-in duration-150"
          data-transition-leave-from="opacity-100"
          data-transition-leave-to="opacity-0"
      >
      <div class="fixed inset-0">
        <div class="absolute inset-0 bg-gray-600 opacity-75"></div>
      </div>
      <div data-slideover-target="menu"
            class="hidden relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-gray-800"
            data-transition-enter="transition ease-out duration-200"
            data-transition-enter-from="opacity-0 -translate-x-full"
            data-transition-enter-to="opacity-100 translate-x-0"
            data-transition-leave="transition ease-in duration-150"
            data-transition-leave-from="opacity-100 translate-x-0"
            data-transition-leave-to="opacity-0 -translate-x-full"
        >
        <div class="absolute top-0 right-0 -mr-14 p-1">
          <button data-action="slideover#toggle" class="flex items-center justify-center h-12 w-12 rounded-full focus:outline-none focus:bg-gray-600" aria-label="Close sidebar">
            <svg class="h-6 w-6 text-white" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="flex-shrink-0 flex items-center px-4">
          <h1 class="text-white text-2xl font-bold">Sidebar</h1>
        </div>
        <div class="mt-5 flex-1 h-0 overflow-y-auto">
          <nav class="px-2 space-y-1">
          </nav>
        </div>
      </div>
      <div class="flex-shrink-0 w-14">
        <!-- Dummy element to force sidebar to shrink to fit close icon -->
      </div>
    </div>
  </div>
  <!-- end sidebar/slideover -->

  <!-- main content -->
  <button data-action="click->slideover#toggle click@window->slideover#hide" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded">
    <span>Open Slideover</span>
  </button>
</div>
```

Slideovers are glorified dropdowns that include an additional overlay. Thus, the setup is equivalent to that of dropdowns, albeit you must specify an `overlay` target. Animations are annotated similarly to dropdowns, just separate the `classList`s of menu and overlay with a comma `,`:

```html
data-slideover-invisible-class="-translate-x-full,opacity-0"
data-slideover-visible-class="translate-x-0,opacity-100"
data-slideover-entering-class=""
data-slideover-enter-timeout="300,300"
data-slideover-leaving-class=""
data-slideover-leave-timeout="300,0"
```
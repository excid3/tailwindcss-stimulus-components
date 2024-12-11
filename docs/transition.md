# transition function (for custom components)

This is a function that is useful to write custom components or extend the components with animations.

## Usage
```js
import { transition } from "tailwindcss-stimulus-components"
import { Controller } from "@hotwired/stimulus"

class CustomController extends Controller {
    static targets = ['content']
    static classes = ['enter', 'enterFrom', 'enterTo', 'leave', 'leaveFrom', 'leaveTo', 'toggle']

    showContent() {
      transition(this.contentTarget, true, this.defaultOptions())
    }

    hideContent() {
      transition(this.contentTarget, false, this.defaultOptions())
    }

    defaultOptions() {
      return {
        enter: this.hasEnterClass ? this.enterClasses.join(' ') : 'transition ease-out duration-100',
        enterFrom: this.hasEnterFromClass ? this.enterFromClasses.join(' ') : 'transform opacity-0 scale-95',
        enterTo: this.hasEnterToClass ? this.enterToClasses.join(' ') : 'transform opacity-100 scale-100',
        leave: this.hasLeaveClass ? this.leaveClasses.join(' ') : 'transition ease-in duration-75',
        leaveFrom: this.hasLeaveFromClass ? this.leaveFromClasses.join(' ') : 'transform opacity-100 scale-100',
        leaveTo: this.hasLeaveToClass ? this.leaveToClasses.join(' ') : 'transform opacity-0 scale-95',
        toggleClass: this.hasToggleClass ? this.toggleClasses.join(' ') : 'hidden',
      }
    }
}

application.register('custom', CustomController)

```

The default animation attributes can be put in a controller like this so they can optionnaly be overwritten
on an element by element basis

```html
<div class="inline-block relative cursor-pointer" data-controller="custom" >
  <span class="underline" data-action="custom#showContent">Show</span>
  <span class="underline" data-action="custom#hideContent">Hide</span>
  <div class="hidden absolute left-0 bottom-7 w-max bg-white border border-gray-200 shadow rounded p-2"
       data-custom-target="content"       

       data-custom-enter-class="transition ease-out duration-100"
       data-custom-enter-from-class="transform opacity-0 scale-95"
       data-custom-enter-to-class="transform opacity-100 scale-100"
       data-custom-leave-class="transition ease-in duration-75"
       data-custom-leave-from-class="transform opacity-100 scale-100"
       data-custom-leave-to-class="transform opacity-0 scale-95-0" 
       data-toggle="hidden"        
    >
    Content
  </div>
</div>
```

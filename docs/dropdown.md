# Dropdown Component

![dropdown](dropdown.gif)

## Usage

```javascript
import { Dropdown } from "tailwindcss-stimulus-components"
application.register('dropdown', Dropdown)
```

```html
<div
    data-controller="dropdown"
    data-action="click@window->dropdown#hide touchstart@window->dropdown#hide keydown.up->dropdown#previousItem keydown.down->dropdown#nextItem keydown.esc->dropdown#hide"
    class="inline-block relative">
    <button data-action="dropdown#toggle:stop" class="px-2.5 py-1 bg-blue-500 text-white text-sm rounded">
      Dropdown
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="inline-block fill-current h-4 w-4"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"></path></svg>
    </button>
    <div data-dropdown-target="menu" class="hidden absolute top-4 right-0 z-10 mt-5 flex w-screen max-w-max">
      <div class="text-sm bg-white shadow-lg rounded border overflow-hidden w-32">
        <a data-dropdown-target="menuItem" href="#" class='no-underline block pl-4 py-2 text-gray-900 bg-white hover:bg-gray-100 whitespace-nowrap focus:bg-gray-100'>Account</a>
        <a data-dropdown-target="menuItem" href="#" class='no-underline block pl-4 py-2 text-gray-900 bg-white hover:bg-gray-100 whitespace-nowrap focus:bg-gray-100'>Billing</a>
        <hr class="border-t" />
        <a data-dropdown-target="menuItem" href="#" class='no-underline block pl-4 py-2 text-gray-900 bg-white hover:bg-gray-100 whitespace-nowrap focus:bg-gray-100'>Sign Out</a>
      </div>
    </div>
</div>
```

Dropdowns are set up to toggle if you click on the dropdown button or any of the
options with in the dropdown menu (via `data-action="click->dropdown#toggle`).
It will also close if you click anywhere outside of the dropdown. This is
done using a window click event to check if the user clicked outside the
dropdown (`data-action="click@window->dropdown#hide"`).

Users can also focus on the dropdown button if `tabindex="0"` is included. They can toggle the dropdown with Space or Enter if the attribute `data-dropdown-target="button"` is included on the button.

If you want a dropdown to be opened on page load you can set the ```data-dropdown-open-value="true"``` as a data attribute.

The code above will toggle the dropdown component, if you needed to only perform a single action, such as `show` or `hide`. the dropdown component exposes such method.

```html
data-action="click->dropdown#show"
data-action="click->dropdown#hide"
```

### Transition

The Dropdown component allows you to natively personalize the css transitions as described in the [transition](/docs/transition.md) utility.

In the table below are detailed the defaults tansitions options values, and the data classes attributes you can apply to your controller element to customize your transitions.

| Options   | Default value                      | HTML data atribute               |
|-----------|------------------------------------|----------------------------------|
| enter     | `transition ease-out duration-100` | `data-dropdown-enter-class`      |
| enterFrom | `transform opacity-0 scale-95`     | `data-dropdown-enter-from-class` |
| enterTo   | `transform opacity-100 scale-100`  | `data-dropdown-enter-to-class`   |
| leave     | `transition ease-in duration-75`   | `data-dropdown-leave-class`      |
| leaveFrom | `transform opacity-100 scale-100`  | `data-dropdown-leave-from-class` |
| leaveTo   | `transform opacity-0 scale-95`     | `data-dropdown-leave-to-class`   |
| toggle    | `hidden`                           | `data-dropdown-toggle-class`     |

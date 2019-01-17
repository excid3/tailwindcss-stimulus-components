[![npm](https://img.shields.io/npm/v/tailwindcss-stimulus-components.svg)](https://www.npmjs.com/package/tailwindcss-stimulus-components)

# TailwindCSS Stimulus Components

[Check out the demo](https://jsfiddle.net/excid3/f5x6arz4/18/)

This is a set of components (Tabs, Modals, Dropdowns, etc) for TailwindCSS that uses [StimulusJS](https://stimulusjs.org) controllers.

The goal is to make using TailwindCSS as easy as Bootstrap when it comes
to adding Javascript components.

## Install

This assumes that [StimulusJS](https://stimulusjs.org) is already installed.

Add the `tailwindcss-stimulus-components` module:

```bash
$ yarn add tailwindcss-stimulus-components
```

or

```bash
$ npm install tailwindcss-stimulus-components
```

or use directly from unpkg:

```html
<script src="https://unpkg.com/tailwindcss-stimulus-components/dist/tailwindcss-stimulus-components.js"></script>
```

## Basic Usage

First, you'll want to initialize StimulusJS and then you can import all the TailwindCSS components.

```javascript
// Start StimulusJS
import { Application } from "stimulus"
import { definitionsFromContext } from "stimulus/webpack-helpers"

const application = Application.start();
const context = require.context("controllers", true, /.js$/);
application.load(definitionsFromContext(context));

// Import and register all TailwindCSS Components
import { Dropdown, Modal, Tabs, Popover } from "tailwindcss-stimulus-components"
application.register('dropdown', Dropdown)
application.register('modal', Modal)
application.register('tabs', Tabs)
application.register('popover', Popover)
```

This will start StimulusJS and load any controllers that you have
locally and then register the TailwindCSS components.

Alternatively, you can use the import lines below to import the 
individual features you need.

### Dropdowns

![Dropdowns](https://d3vv6lp55qjaqc.cloudfront.net/items/3X1m1v1w2g1M3P0F2p2C/Screen%20Shot%202018-12-07%20at%201.23.52%20PM.png?X-CloudApp-Visitor-Id=bcd17e7039e393c836f30de901088b96&v=4c0ae15f)

```javascript
import { Dropdown } from "tailwindcss-stimulus-components"
application.register('dropdown', Dropdown)
```

```html
<div class="inline-block text-sm px-4 py-2 leading-none rounded no-underline text-grey hover:text-grey-darker hover:bg-white mt-4 lg:mt-0">
  <div class="relative" data-controller="dropdown">
    <div data-action="click->dropdown#toggle click@window->dropdown#hide" role="button" class="inline-block select-none">
      <span class="appearance-none flex items-center inline-block text-grey-dark">
        <% if current_user %>
        <%= image_tag avatar_url_for(current_user), class: "rounded-full h-8 w-8 align-middle" %>
        <% end %>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="h-4 w-4"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"></path></svg>
      </span>
    </div>
    <div data-target="dropdown.menu" class="absolute pin-r mt-2 hidden">
      <div class="bg-white shadow rounded border overflow-hidden">
          <%= link_to 'Profile',  edit_user_registration_path, class: 'no-underline block pl-8 py-3 text-grey-darkest bg-white hover:bg-grey-lighter whitespace-no-wrap' %>
          <%= link_to 'Password', password_path, class: 'no-underline block px-8 py-3 text-grey-darkest bg-white  hover:bg-grey-lighter whitespace-no-wrap' %>
          <%= link_to 'Accounts', user_connected_accounts_path, class: 'no-underline block px-8 py-3 text-grey-darkest bg-white  hover:bg-grey-lighter whitespace-no-wrap' %>
          <%= link_to 'Billing',  subscription_path, class: 'no-underline block px-8 py-3 text-grey-darkest bg-white  hover:bg-grey-lighter whitespace-no-wrap' %>
          <%= link_to 'Sign Out', destroy_user_session_path, method: :delete, class: 'no-underline block px-8 py-3 border-t text-grey-darkest bg-white  hover:bg-grey-lighter whitespace-no-wrap' %>
      </div>
    </div>
  </div>
</div>
```

Dropdowns are setup to toggle if you click on the dropdown button. It
will also close if you click anywhere outside of the dropdown. This is
done using a window click event to check if the user clicked outside the
dropdown.

### Modals

![Modal](https://d3vv6lp55qjaqc.cloudfront.net/items/3V2t3f0K0B1J3B2t0k0u/Screen%20Shot%202018-12-07%20at%201.01.22%20PM.png?X-CloudApp-Visitor-Id=bcd17e7039e393c836f30de901088b96&v=fa2ab240)

```javascript
import { Modal } from "tailwindcss-stimulus-components"
application.register('modal', Modal)
```

```html
<div data-controller="modal" data-action="keydown@window->modal#closeWithKeyboard">
  <button class="btn btn-grey" data-action="click->modal#open">Open Modal</button>

  <div data-target="modal.container" class="hidden">
    <div class="fixed z-50 pin-t pin-l w-full h-full table" style="background-color: rgba(0, 0, 0, .5);">
      <div data-target="modal.background" data-action="click->modal#closeBackground" class="table-cell align-middle">

        <div class="bg-white mx-auto rounded shadow p-8" style="width:480px">
          <h2>Content</h2>
          <p>This is an example modal dialog box.</p>
          <div class="text-right">
            <button class="btn btn-sm btn-grey">Does nothing</button>
            <button class="btn btn-grey" data-action="click->modal#close">Close</button>
          </div>
        </div>

      </div>
    </div>
  </div>
</div>
```

### Tabs

![Tabs](https://d3vv6lp55qjaqc.cloudfront.net/items/440B1H1P2Y1r3C3r1h0R/Screen%20Shot%202018-12-07%20at%201.24.31%20PM.png?X-CloudApp-Visitor-Id=bcd17e7039e393c836f30de901088b96&v=84e44dbd)

```javascript
import { Tabs } from "tailwindcss-stimulus-components"
application.register('tabs', Tabs)
```

```html
<div data-controller="tabs" data-tabs-active-tab="-mb-px border-l border-t border-r rounded-t">
  <ul class="list-reset flex border-b">
    <li class="-mb-px mr-1" data-target="tabs.tab" data-action="click->tabs#change">
      <a class="bg-white inline-block py-2 px-4 text-blue hover:text-blue-darker font-semibold no-underline" href="#">Active</a>
    </li>
    <li class="mr-1" data-target="tabs.tab" data-action="click->tabs#change">
      <a class="bg-white inline-block py-2 px-4 text-blue hover:text-blue-darker font-semibold no-underline" href="#">Tab</a>
    </li>
    <li class="mr-1" data-target="tabs.tab" data-action="click->tabs#change">
      <a class="bg-white inline-block py-2 px-4 text-blue hover:text-blue-darker font-semibold no-underline" href="#">Tab</a>
    </li>
    <li class="mr-1">
      <a class="bg-white inline-block py-2 px-4 text-grey-light font-semibold no-underline" href="#">Tab</a>
    </li>
  </ul>

  <div class="hidden py-4 px-4 border-l border-b border-r" data-target="tabs.panel">
    Tab panel 1
  </div>

  <div class="hidden py-4 px-4 border-l border-b border-r" data-target="tabs.panel">
    Tab panel 2
  </div>

  <div class="hidden py-4 px-4 border-l border-b border-r" data-target="tabs.panel">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/y3niFzo5VLI" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
  </div>
</div>
```

`data-target="tabs.tab"` defines which element is marked as a tab. The
index of the tab is used to determine which panel to make visible.

`data-target="tabs.panel"` defines which panel is visible based upon the
currently selected tab.

`data-tabs-active-tab` defines the list of classes that will be
added/removed from the active tab when the active tab changes.

### Popovers

![Popovers](https://user-images.githubusercontent.com/11435593/51342548-24ffd380-1a8c-11e9-95a9-1b8a0181b2a1.png)



```javascript
import { Popover } from "tailwindcss-stimulus-components"
application.register('popover', Popover)
```

```html
<p>
  Beginning in 2015, Google introduced what is called the 
    <div class="popover inline-block" data-controller="popover" data-popover-translate-x="0" data-popover-translate-y="-128%" data-action="mouseover->popover#mouseOver mouseout->popover#mouseOut">
      <span class="underline">'local snack pack',</span> 
      <div class="content hidden absolute max-w-xs bg-grey-light rounded p-2" data-target="popover.content">
        Terrible name - we know. But the biggest name in SEO came up with it.
      </div>
    </div>
  which shows you local search results before normal organic results.
</p>
```

`data-target="popover.content"` defines which element will contain the actual content in the popover.

`data-popover-translate-x="0"` defines the css transform-translate X value used in positioning the popover.It can be anything from a percentage to rem units to pixels.

`data-popover-translate-y="-128%"` defines the css transform-translate Y value used in positioning the popover. It can be anything from a percentage to rem units to pixels.

### Styling

All of the styles for the Stimulus components are configurable. Our
examples above show some example styles you can use, but these
components themselves don't require any specific styles.

Stimulus simply requires the `data-` attributes to be defined correctly
to trigger actions and find targets.

Some components like the modal have some styles that are necessary for
proper use in the browser. The container and backgrounds are separate so
that you can have a fixed size container and the modal inside of it.

### Extending Components

You can use inheritance to extend the functionality of any Stimulus components.

```js
class ButtonDropdown extends Dropdown {
  static targets = ["button"]

  connect() {
    super.connect();
    console.log("the value of button : ", this.buttonTarget.value)
  }
}
```

These controllers will automatically have access to `targets` defined in the parent class.

If you override the `connect`, `disconnect` or any other methods from the parent, you'll want to call `super.method()` to make sure the parent functionality is executed.

## Contributing

Bug reports and pull requests are welcome on GitHub at <https://github.com/excid3/tailwindcss-stimulus-components>.  This project is intended to be a safe, welcoming space for  collaboration, and contributors are expected to adhere to the  Contributor Covenant code of conduct.

## License

This package is available as open source under the terms of the MIT License.

[![npm](https://img.shields.io/npm/v/tailwindcss-stimulus-components.svg)](https://www.npmjs.com/package/tailwindcss-stimulus-components) ![CI](https://github.com/excid3/tailwindcss-stimulus-components/workflows/CI/badge.svg)

# TailwindCSS Stimulus Components

[Check out the demo](https://excid3.github.io/tailwindcss-stimulus-components/)

This is a set of components (Tabs, Modals, Dropdowns, etc) for TailwindCSS that uses [StimulusJS](https://stimulusjs.org) controllers.

The goal is to make using TailwindCSS as easy as Bootstrap when it comes
to adding Javascript components.

## Install

This assumes that [StimulusJS](https://stimulusjs.org) is already installed.

Add the `tailwindcss-stimulus-components` module:

```bash
yarn add tailwindcss-stimulus-components
```

or

```bash
npm install tailwindcss-stimulus-components
```

## Basic Usage

First, you'll want to initialize StimulusJS and then you can import all the TailwindCSS components.

```javascript
// Start StimulusJS
import { Application } from "@hotwired/stimulus"

const application = Application.start();

// Import and register all TailwindCSS Components
import { Alert, Autosave, Dropdown, Modal, Tabs, Popover, Toggle, Slideover } from "tailwindcss-stimulus-components"
application.register('alert', Alert)
application.register('autosave', Autosave)
application.register('dropdown', Dropdown)
application.register('modal', Modal)
application.register('tabs', Tabs)
application.register('popover', Popover)
application.register('toggle', Toggle)
application.register('slideover', Slideover)
```

This will start StimulusJS and load any controllers that you have
locally and then register the TailwindCSS components.

Alternatively, you can use the import lines below to import the
individual features you need.

### Alerts

![Alerts](https://i.imgur.com/jxQ8k1t.png)

```javascript
import { Alert } from "tailwindcss-stimulus-components"
application.register('alert', Alert)
```

To customize the appearance of alerts based on the kind of alert it is, you can do
something like this in: `app/helpers/application_helper.rb`

```ruby
module ApplicationHelper
  def tailwind_classes_for(flash_type)
    {
      notice: "bg-green-400 border-l-4 border-green-700 text-white",
      error:   "bg-red-400 border-l-4 border-red-700 text-black",
    }.stringify_keys[flash_type.to_s] || flash_type.to_s
  end
end
```

And then add something like this either directly in the layout file, or in a partial
that's rendered directly by the layout:

```html
<div class="fixed inset-x-0 top-0 flex items-end justify-right px-4 py-6 sm:p-6 justify-end z-30 pointer-events-none">
  <div data-controller="alert" class="max-w-sm w-full shadow-lg rounded px-4 py-3 rounded relative bg-green-400 border-l-4 border-green-700 text-white pointer-events-auto">
    <div class="p-2">
      <div class="flex items-start">
        <div class="ml-3 w-0 flex-1 pt-0.5">
          <p class="text-sm leading-5 font-medium">
            Stimulus is the JS of the future!
          </p>
        </div>
        <div class="ml-4 flex-shrink-0 flex">
          <button data-action="alert#close" class="inline-flex text-white focus:outline-none focus:text-gray-300 transition ease-in-out duration-150">
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
```

Alerts are set up to slide into view from the top-right side of the
screen. Clicking on the "X" button will cause the alert to slide back
out of view and be removed from the DOM.

- `data-alert-dismiss-after-value` can be provided to make the alert dimiss after x miliseconds. Default is `undefined`.
- `data-alert-show-delay-value` can be set to tell the alert to show itself after x miliseconds. Defaults to `200` miliseconds.
- `data-alert-remove-delay-value` can be set to tell the alert to hide itself after x milisconds. Defaults to `1100` miliseconds.
- `data-alert-show-class` is a set of all classes to apply on the alert when it's shown.
- `data-alert-hide-class` is a set of all classes to apply on the alert when it's hidden.

### Dropdowns

![Dropdowns](https://d3vv6lp55qjaqc.cloudfront.net/items/3X1m1v1w2g1M3P0F2p2C/Screen%20Shot%202018-12-07%20at%201.23.52%20PM.png?X-CloudApp-Visitor-Id=bcd17e7039e393c836f30de901088b96&v=4c0ae15f)

```javascript
import { Dropdown } from "tailwindcss-stimulus-components"
application.register('dropdown', Dropdown)
```

```html
<div class="inline-block text-sm px-4 py-2 leading-none rounded no-underline text-gray hover:text-gray-900 hover:bg-white mt-4 lg:mt-0">
  <div class="relative" data-controller="dropdown">
    <div data-action="click->dropdown#toggle click@window->dropdown#hide" role="button" data-dropdown-target="button" tabindex="0" class="inline-block select-none">
      <span class="appearance-none flex items-center inline-block text-gray-700">
        <% if current_user %>
          <%= image_tag avatar_url_for(current_user), class: "rounded-full h-8 w-8 align-middle" %>
        <% end %>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="h-4 w-4"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"></path></svg>
      </span>
    </div>
    <div data-dropdown-target="menu" class="absolute right-0 mt-2 hidden">
      <div class="bg-white shadow rounded border overflow-hidden">
          <%= link_to 'Profile',  edit_user_registration_path, data: {action: "click->dropdown#toggle"}, class: 'no-underline block pl-8 py-3 text-gray-900 bg-white hover:bg-gray-300 whitespace-nowrap' %>
          <%= link_to 'Password', password_path, data: {action: "click->dropdown#toggle"}, class: 'no-underline block px-8 py-3 text-gray-900 bg-white hover:bg-gray-300 whitespace-nowrap' %>
          <%= link_to 'Accounts', user_connected_accounts_path, data: {action: "click->dropdown#toggle"}, class: 'no-underline block px-8 py-3 text-gray-900 bg-white hover:bg-gray-300 whitespace-nowrap' %>
          <%= link_to 'Billing',  subscription_path, data: {action: "click->dropdown#toggle"}, class: 'no-underline block px-8 py-3 text-gray-900 bg-white hover:bg-gray-300 whitespace-nowrap' %>
          <%= link_to 'Sign Out', destroy_user_session_path, method: :delete, data: {action: "click->dropdown#toggle"}, class: 'no-underline block px-8 py-3 border-t text-gray-900 bg-white hover:bg-gray-300 whitespace-nowrap' %>
      </div>
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

The ```data-dropdown-active-class``` allows you add an active class to the dropdown menu. It will default to ```this.element```.  You can also specify a target to use for the active class with the ```data-active-target```.

If you want a dropdown to be opened on page load you can set the ```data-dropdown-open-value="true"``` as a data attribute.

```html
<div class="inline-block text-sm px-4 py-2 leading-none rounded no-underline text-gray hover:text-gray-900 hover:bg-white mt-4 lg:mt-0">
  <div class="relative" data-controller="dropdown" data-dropdown-active-class='bg-teal-700' data-dropdown-active-target='#activeTarget'>
    <div data-action="click->dropdown#toggle click@window->dropdown#hide" role="button" data-dropdown-target="button" tabindex="0" class="inline-block select-none">
      <span class="appearance-none flex items-center inline-block text-gray-700">
        <% if current_user %>
          <%= image_tag avatar_url_for(current_user), class: "rounded-full h-8 w-8 align-middle" %>
        <% end %>
      </span>
    </div>
    <div id='activeTarget' data-dropdown-target="menu" class="absolute right-0 mt-2 hidden">
      <div class="bg-white shadow rounded border overflow-hidden">
          <%= link_to 'Profile',  edit_user_registration_path, data: {action: "click->dropdown#toggle"}, class: 'no-underline block pl-8 py-3 text-gray-900 bg-white hover:bg-gray-300 whitespace-nowrap' %>
          <%= link_to 'Password', password_path, data: {action: "click->dropdown#toggle"}, class: 'no-underline block px-8 py-3 text-gray-900 bg-white hover:bg-gray-300 whitespace-nowrap' %>
          <%= link_to 'Accounts', user_connected_accounts_path, data: {action: "click->dropdown#toggle"}, class: 'no-underline block px-8 py-3 text-gray-900 bg-white hover:bg-gray-300 whitespace-nowrap' %>
          <%= link_to 'Billing',  subscription_path, data: {action: "click->dropdown#toggle"}, class: 'no-underline block px-8 py-3 text-gray-900 bg-white hover:bg-gray-300 whitespace-nowrap' %>
          <%= link_to 'Sign Out', destroy_user_session_path, method: :delete, data: {action: "click->dropdown#toggle"}, class: 'no-underline block px-8 py-3 border-t text-gray-900 bg-white hover:bg-gray-300 whitespace-nowrap' %>
      </div>
    </div>
  </div>
</div>
```

the code above will toggle the dropdown component, if you needed to only perform a single action, such as `show` or `hide`. the dropdown component exposes such method.

```html
data-action="click->dropdown#show"
data-action="click->dropdown#hide"
```

Animations for the dropdown menu (like the TailwindUI dropdowns) can be applied using these data attributes:

```html
data-dropdown-invisible-class="opacity-0 scale-95"
data-dropdown-visible-class="opacity-100 scale-100"
data-dropdown-entering-class="ease-out duration-300"
data-dropdown-enter-timeout="300"
data-dropdown-leaving-class="ease-in duration-300"
data-dropdown-leave-timeout="300"
```

Here is an example:

```html
<div class="relative"
    data-controller="dropdown"
    data-action="click->dropdown#toggle click@window->dropdown#hide"
    data-dropdown-active-target="#dropdown-button"
    data-dropdown-active-class="bg-teal-600"
    data-dropdown-invisible-class="opacity-0 scale-95"
    data-dropdown-visible-class="opacity-100 scale-100"
    data-dropdown-entering-class="ease-out duration-100"
    data-dropdown-enter-timeout="100"
    data-dropdown-leaving-class="ease-in duration-75"
    data-dropdown-leave-timeout="75">
  <div data-action="click->dropdown#toggle click@window->dropdown#hide" role="button" data-dropdown-target="button" tabindex="0" class="inline-block select-none">
    Open Dropdown
  </div>
  <div data-dropdown-target="menu" class="absolute pin-r mt-2 transform transition hidden opacity-0 scale-95">
    <div class="bg-white shadow rounded border overflow-hidden">
      Content
    </div>
  </div>
</div>
```

### Slideovers

```js
import { Slideover } from "tailwindcss-stimulus-components"
application.register('slideover', Slideover)
```

```html
<div class="container mx-auto p-8"
     data-controller="slideover"
     data-slideover-active-target="#slideover-target">
  <!-- begin sidebar/slideover -->
  <div id="sidebar">
    <div data-slideover-target="overlay" class="fixed inset-0 flex z-40 transition-opacity ease-linear duration-300 opacity-0 hidden">
      <div class="fixed inset-0">
        <div class="absolute inset-0 bg-gray-600 opacity-75"></div>
      </div>
      <div id="slideover-target" data-slideover-target="menu" class="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-gray-800 transition ease-in-out duration-300 transform -translate-x-full hidden">
        <div class="absolute top-0 right-0 -mr-14 p-1">
          <button data-action="slideover#hide" class="flex items-center justify-center h-12 w-12 rounded-full focus:outline-none focus:bg-gray-600" aria-label="Close sidebar">
            <svg class="h-6 w-6 text-white" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <!-- menu content -->
      </div>
    </div>
  </div>
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

### Modals

![Modal](https://d3vv6lp55qjaqc.cloudfront.net/items/3V2t3f0K0B1J3B2t0k0u/Screen%20Shot%202018-12-07%20at%201.01.22%20PM.png?X-CloudApp-Visitor-Id=bcd17e7039e393c836f30de901088b96&v=fa2ab240)

```javascript
import { Modal } from "tailwindcss-stimulus-components"
application.register('modal', Modal)
```

```html
<div data-controller="modal" data-modal-allow-background-close="false">
  <a href="#" data-action="click->modal#open" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded">
    <span>Open Modal</span>
  </a>

  <!-- Modal Container -->
  <div data-modal-target="container" data-action="click->modal#closeBackground keyup@window->modal#closeWithKeyboard" class="hidden animated fadeIn fixed inset-0 overflow-y-auto flex items-center justify-center" style="z-index: 9999;">
    <!-- Modal Inner Container -->
    <div class="max-h-screen w-full max-w-lg relative">
      <!-- Modal Card -->
      <div class="m-1 bg-white rounded shadow">
        <div class="p-8">
          <h2 class="text-xl mb-4">Large Modal Content</h2>
          <p class="mb-4">This is an example modal dialog box.</p>

          <div class="flex justify-end items-center flex-wrap mt-6">
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" data-action="click->modal#close">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

`data-modal-allow-background-close` may be set to `false` to disable
closing the modal when a user clicks on the background. Defaults to
`true`

`data-modal-disable-backdrop` may be set to `true` to disable adding the
modal's dark transparent backdrop. This is useful if you want to make a
fullscreen modal.

`data-modal-prevent-default-action-opening` may be set to `true` to prevent the
default action from running when clicking the element (e.g. a link from opening)
that opens the modal and set to `false` to allow it. Default: `true`.

`data-modal-prevent-default-action-closing` may be set to `true` to prevent the
default action from running when clicking the element (e.g. a link from opening)
that closes the modal and set to `false` to allow it. Default: `true`.

`data-modal-restore-scroll-value` may be set to `false` to disable
restoring scroll position.

`data-modal-backdrop-color-value` can be used to specify the color and transparency of the modal's backdrop by setting an rgba value. Default: `rgba(0, 0, 0, 0.8)`.

### Tabs

![Tabs](https://d3vv6lp55qjaqc.cloudfront.net/items/440B1H1P2Y1r3C3r1h0R/Screen%20Shot%202018-12-07%20at%201.24.31%20PM.png?X-CloudApp-Visitor-Id=bcd17e7039e393c836f30de901088b96&v=84e44dbd)

```javascript
import { Tabs } from "tailwindcss-stimulus-components"
application.register('tabs', Tabs)
```

```html
<div data-controller="tabs" data-tabs-active-tab="-mb-px border-l border-t border-r rounded-t">
  <ul class="list-reset flex border-b">
    <li class="-mb-px mr-1" data-tabs-target="tab" data-action="click->tabs#change">
      <a class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-700 font-semibold no-underline" href="#">Active</a>
    </li>
    <li class="mr-1" data-tabs-target="tab" data-action="click->tabs#change">
      <a class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-700 font-semibold no-underline" href="#">Tab</a>
    </li>
    <li class="mr-1" data-tabs-target="tab" data-action="click->tabs#change">
      <a class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-700 font-semibold no-underline" href="#">Tab</a>
    </li>
    <li class="mr-1">
      <a class="bg-white inline-block py-2 px-4 text-gray-300 font-semibold no-underline" href="#">Tab</a>
    </li>
  </ul>

  <div class="hidden py-4 px-4 border-l border-b border-r" data-tabs-target="panel">
    Tab panel 1
  </div>

  <div class="hidden py-4 px-4 border-l border-b border-r" data-tabs-target="panel">
    Tab panel 2
  </div>

  <div class="hidden py-4 px-4 border-l border-b border-r" data-tabs-target="panel">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/y3niFzo5VLI" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
  </div>
</div>
```

`data-tabs-target="tab"` defines which element is marked as a tab. The
index of the tab is used to determine which panel to make visible.

`data-tabs-target="panel"` defines which panel is visible based upon the
currently selected tab.

`data-tabs-active-tab` defines the list of classes that will be
added/removed from the active tab when the active tab changes.

`data-tabs-inactive-tab` defines the list of classes that will be
added/removed from the inactive tab when the active tab changes.

`data-tabs-index="1"` can be used to set the selected tab when the
controller connects.

##### Changing tabs from other places

If you'd like to change the tab from a button or link outside of the tabs, you can call the same method and assign either `data-id` or `data-index` to select the tab.

```html
<a data-action="click->tabs#change" data-index="1">Change tab by data-index</a>

<a data-action="click->tabs#change" data-id="second">Change tab by data-id</a>
```

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
      <div class="content hidden absolute max-w-xs bg-gray-300 rounded p-2" data-popover-target="content">
        Terrible name - we know. But the biggest name in SEO came up with it.
      </div>
    </div>
  which shows you local search results before normal organic results.
</p>
```

`data-popover-target="content"` defines which element will contain the actual content in the popover.

`data-popover-translate-x="0"` defines the css transform-translate X value used in positioning the popover.It can be anything from a percentage to rem units to pixels.

`data-popover-translate-y="-128%"` defines the css transform-translate Y value used in positioning the popover. It can be anything from a percentage to rem units to pixels.

### Autosave (Rails-only)

Autosaving forms are really helpful for saving drafts of records. This
Stimulus controller allows you to listen to fields to easily submit the
form once the user has stopped typing.

Here's an example using Rails forms:

```erb
<%= form_with(model: post, data: { controller: "autosave", target: "autosave.form", action: "ajax:success->autosave#success ajax:error->autosave#error" }) do |form| %>
  <div class="form-group">
    <%= form.label :title %>
    <%= form.text_field :title, class: 'form-control', data: { action: "keyup->autosave#save" } %>
  </div>

  <div class="form-group">
    <%= form.label :body %>
    <%= form.text_area :body, class: 'form-control', data: { action: "keyup->autosave#save" } %>
  </div>

  <div class="form-group">
    <%= form.submit "Save and Publish", class: 'btn btn-primary' %>

    <span class="text-muted" data-autosave-target="status"></span>
  </div>
<% end %>
```

You can use `data-autosave-target="form"` to reference the form. This
will be used with the Rails AJAX form submission.

The `data-autosave-target="status"` is used for displaying the status message of the autosave. This displays "Saving..." while the request is in progress and then "Saved!" if it was successful, "Unable to save!" if it failed.

Add `data-action="keyup->autosave#save` to listen to the keyup event and
trigger an autosave. You can use other events like `change` for other
field types like `select`.

Lastly, we have to handle the success and failure cases for the AJAX
form submission.

`data-action="ajax:success->autosave#success"` is applied to the form to call the `success` method once the Rails ajax request succeeded.

`data-action="ajax:error->autosave#error"` is applied to the form to call the `error` method once the Rails ajax request failed.

#### Handling the form submission server-side

Your server side should check the `params[:commit]` text to see whether
or not it should save as a draft or actually publish the record.

We recommend using a gem like Draftsman to help make the backend easier.

### Toggle

```html
<div data-controller='toggle' class="m-2">
  <div data-action='click->toggle#toggle touch->toggle#toggle' class="bg-gray-900 text-white p-6">
    What is the question?
  </div>
  <div data-toggle-target='toggleable' class="m-4 hidden">
    <p>This is the answer</p>
  </div>
</div>
```

In this example, clicking the question will toggle the hidden class. The hidden class is the default. If you wish to use a different class, you can use the `data-toggle-class="custom-class"` attribute.

```html
<div data-controller='toggle' data-toggle-class='bg-red-900' class="m-2">
  <div data-action='click->toggle#toggle touch->toggle#toggle' class="bg-gray-900 text-white p-6">
    What is the question?
  </div>
  <div data-toggle-target='toggleable' class="m-4 bg-red-900">
    <p>This is the answer</p>
  </div>
</div>
```

On some cases, you don't want to toggle something but rather do one action such as only show or hide the toggleable. the toggle controller exposes two such methods named `hide` and `show`

this will only hide the toggleable.
```html
  <div data-action='click->toggle#hide touch->toggle#hide' class="bg-gray-900 text-white p-6">
    What is the question?
  </div>

```
while this only shows it
```html
  <div data-action='click->toggle#show touch->toggle#show' class="bg-gray-900 text-white p-6">
    What is the question?
  </div>

```
### Color Picker and Preview

```html
<div class="col-span-6 sm:col-span-3">
  <label for="hex_color_bg" class="block text-sm font-medium text-gray-700">
    Color
  </label>
  <div class="mt-3 flex items-center" data-controller="color-preview">
    <p data-color-preview-target="preview"
       class="h-10 w-10 mr-2 rounded-full text-2xl text-white text-center"
       style="background-color: #ba1e03; color: #fff; padding-top: 1px;">
      A
    </p>
    <span class="ml-2">
      <div class="flex rounded-md shadow-sm">
        <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
          #
        </span>
        <input data-action="input->color-preview#update" data-color-preview-target="color"
               id="hex_color_bg" name="hex_color_bg" type="color" value="#ba1e03"
               class="focus:ring-indigo-500 focus:border-indigo-500 block shadow-sm sm:text-sm border-gray-300 flex-1 rounded-r-md mt-0 w-24 h-8 px-1 py-1 border" />
      </div>
    </span>
  </div>
</div>
```

This will update the `backgroundColor` by default but you can choose to have the color preview update the `color` instead by setting the `data-color-preview-style="color"` attribute of the color preview controller.

## Styling

All of the styles for the Stimulus components are configurable. Our
examples above show some example styles you can use, but these
components themselves don't require any specific styles.

Stimulus simply requires the `data-` attributes to be defined correctly
to trigger actions and find targets.

Some components like the modal have some styles that are necessary for
proper use in the browser. The container and backgrounds are separate so
that you can have a fixed size container and the modal inside of it.

## Extending Components

You can use inheritance to extend the functionality of any Stimulus components.

```js
import { Dropdown } from "tailwindcss-stimulus-components"

export default class ButtonDropdown extends Dropdown {
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

To develop locally, run `npx serve` and open your browser to the URL it serves on.

Bug reports and pull requests are welcome on GitHub at <https://github.com/excid3/tailwindcss-stimulus-components>.  This project is intended to be a safe, welcoming space for  collaboration, and contributors are expected to adhere to the  Contributor Covenant code of conduct.

To run tests:

```bash
npm install
npm run test
```

## License

This package is available as open source under the terms of the MIT License.

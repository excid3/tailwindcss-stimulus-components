[![npm](https://img.shields.io/npm/v/tailwindcss-stimulus-components.svg)](https://www.npmjs.com/package/tailwindcss-stimulus-components)

# TailwindCSS Stimulus Components

[Check out the demo](https://excid3.github.io/tailwindcss-stimulus-components/)

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
<script src="https://unpkg.com/stimulus/dist/stimulus.umd.js"></script>
<script src="https://unpkg.com/tailwindcss-stimulus-components/dist/tailwindcss-stimulus-components.umd.js"></script>
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
import { Dropdown, Modal, Tabs, Popover, Toggle } from "tailwindcss-stimulus-components"
application.register('dropdown', Dropdown)
application.register('modal', Modal)
application.register('tabs', Tabs)
application.register('popover', Popover)
application.register('toggle', Toggle)
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
<div class="fixed inset-x-0 top-0 flex items-end justify-right px-4 py-6 sm:p-6 justify-end z-50 ">
  <div data-controller="alert" class="max-w-sm w-full shadow-lg rounded px-4 py-3 rounded relative bg-green-400 border-l-4 border-green-700 text-white">
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

### Dropdowns

![Dropdowns](https://d3vv6lp55qjaqc.cloudfront.net/items/3X1m1v1w2g1M3P0F2p2C/Screen%20Shot%202018-12-07%20at%201.23.52%20PM.png?X-CloudApp-Visitor-Id=bcd17e7039e393c836f30de901088b96&v=4c0ae15f)

```javascript
import { Dropdown } from "tailwindcss-stimulus-components"
application.register('dropdown', Dropdown)
```

```html
<div class="inline-block text-sm px-4 py-2 leading-none rounded no-underline text-gray hover:text-gray-900 hover:bg-white mt-4 lg:mt-0">
  <div class="relative" data-controller="dropdown">
    <div data-action="click->dropdown#toggle click@window->dropdown#hide" role="button" class="inline-block select-none">
      <span class="appearance-none flex items-center inline-block text-gray-700">
        <% if current_user %>
          <%= image_tag avatar_url_for(current_user), class: "rounded-full h-8 w-8 align-middle" %>
        <% end %>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="h-4 w-4"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"></path></svg>
      </span>
    </div>
    <div data-target="dropdown.menu" class="absolute right-0 mt-2 hidden">
      <div class="bg-white shadow rounded border overflow-hidden">
          <%= link_to 'Profile',  edit_user_registration_path, class: 'no-underline block pl-8 py-3 text-gray-900 bg-white hover:bg-gray-300 whitespace-no-wrap' %>
          <%= link_to 'Password', password_path, class: 'no-underline block px-8 py-3 text-gray-900 bg-white  hover:bg-gray-300 whitespace-no-wrap' %>
          <%= link_to 'Accounts', user_connected_accounts_path, class: 'no-underline block px-8 py-3 text-gray-900 bg-white  hover:bg-gray-300 whitespace-no-wrap' %>
          <%= link_to 'Billing',  subscription_path, class: 'no-underline block px-8 py-3 text-gray-900 bg-white  hover:bg-gray-300 whitespace-no-wrap' %>
          <%= link_to 'Sign Out', destroy_user_session_path, method: :delete, class: 'no-underline block px-8 py-3 border-t text-gray-900 bg-white  hover:bg-gray-300 whitespace-no-wrap' %>
      </div>
    </div>
  </div>
</div>
```

Dropdowns are set up to toggle if you click on the dropdown button. It
will also close if you click anywhere outside of the dropdown. This is
done using a window click event to check if the user clicked outside the
dropdown.

The ```data-dropdown-active-class``` allows you add an active class to the dropdown menu. It will default to ```this.element```.  You can also specify a target to use for the active class with the ```data-active-target```. 

```html
<div class="inline-block text-sm px-4 py-2 leading-none rounded no-underline text-gray hover:text-gray-900 hover:bg-white mt-4 lg:mt-0">
  <div class="relative" data-controller="dropdown" data-dropdown-active-class='bg-teal-700' data-dropdown-active-target='#activeTarget'>
    <div data-action="click->dropdown#toggle click@window->dropdown#hide" role="button" class="inline-block select-none">
      <span class="appearance-none flex items-center inline-block text-gray-700">
        <% if current_user %>
          <%= image_tag avatar_url_for(current_user), class: "rounded-full h-8 w-8 align-middle" %>
        <% end %>
      </span>
    </div>
    <div id='activeTarget' data-target="dropdown.menu" class="absolute right-0 mt-2 hidden">
      <div class="bg-white shadow rounded border overflow-hidden">
          <%= link_to 'Profile',  edit_user_registration_path, class: 'no-underline block pl-8 py-3 text-gray-900 bg-white hover:bg-gray-300 whitespace-no-wrap' %>
          <%= link_to 'Password', password_path, class: 'no-underline block px-8 py-3 text-gray-900 bg-white  hover:bg-gray-300 whitespace-no-wrap' %>
          <%= link_to 'Accounts', user_connected_accounts_path, class: 'no-underline block px-8 py-3 text-gray-900 bg-white  hover:bg-gray-300 whitespace-no-wrap' %>
          <%= link_to 'Billing',  subscription_path, class: 'no-underline block px-8 py-3 text-gray-900 bg-white  hover:bg-gray-300 whitespace-no-wrap' %>
          <%= link_to 'Sign Out', destroy_user_session_path, method: :delete, class: 'no-underline block px-8 py-3 border-t text-gray-900 bg-white  hover:bg-gray-300 whitespace-no-wrap' %>
      </div>
    </div>
  </div>
</div>
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
  <div data-target="modal.container" data-action="click->modal#closeBackground keyup@window->modal#closeWithKeyboard" class="hidden animated fadeIn fixed inset-0 overflow-y-auto flex items-center justify-center" style="z-index: 9999;">
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
      <a class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-700 font-semibold no-underline" href="#">Active</a>
    </li>
    <li class="mr-1" data-target="tabs.tab" data-action="click->tabs#change">
      <a class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-700 font-semibold no-underline" href="#">Tab</a>
    </li>
    <li class="mr-1" data-target="tabs.tab" data-action="click->tabs#change">
      <a class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-700 font-semibold no-underline" href="#">Tab</a>
    </li>
    <li class="mr-1">
      <a class="bg-white inline-block py-2 px-4 text-gray-300 font-semibold no-underline" href="#">Tab</a>
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
      <div class="content hidden absolute max-w-xs bg-gray-300 rounded p-2" data-target="popover.content">
        Terrible name - we know. But the biggest name in SEO came up with it.
      </div>
    </div>
  which shows you local search results before normal organic results.
</p>
```

`data-target="popover.content"` defines which element will contain the actual content in the popover.

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

    <span class="text-muted" data-target="autosave.status"></span>
  </div>
<% end %>
```

You can use `data-target="autosave.form"` to reference the form. This
will be used with the Rails AJAX form submission.

The `data-target="autosave.status"` is used for displaying the status message of the autosave. This displays "Saving..." while the request is in progress and then "Saved!" if it was successful, "Unable to save!" if it failed.

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
  <div data-target='toggle.toggleable' class="m-4 hidden">
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
  <div data-target='toggle.toggleable' class="m-4 bg-red-900">
    <p>This is the answer</p>
  </div>
</div>
```

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

Bug reports and pull requests are welcome on GitHub at <https://github.com/excid3/tailwindcss-stimulus-components>.  This project is intended to be a safe, welcoming space for  collaboration, and contributors are expected to adhere to the  Contributor Covenant code of conduct.

## License

This package is available as open source under the terms of the MIT License.

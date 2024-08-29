[![npm](https://img.shields.io/npm/v/tailwindcss-stimulus-components.svg)](https://www.npmjs.com/package/tailwindcss-stimulus-components) [![Tests](https://github.com/excid3/tailwindcss-stimulus-components/actions/workflows/ci.yml/badge.svg)](https://github.com/excid3/tailwindcss-stimulus-components/actions/workflows/ci.yml)

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

or use with Rails importmaps:

```bash
bin/importmap pin tailwindcss-stimulus-components
```

## Basic Usage

First, you'll want to initialize StimulusJS and then you can import all the TailwindCSS components.

```javascript
// Start StimulusJS
import { Application } from "@hotwired/stimulus"

const application = Application.start();

// Import and register all TailwindCSS Components or just the ones you need
import { Alert, Autosave, ColorPreview, Dropdown, Modal, Tabs, Popover, Toggle, Slideover } from "tailwindcss-stimulus-components"
application.register('alert', Alert)
application.register('autosave', Autosave)
application.register('color-preview', ColorPreview)
application.register('dropdown', Dropdown)
application.register('modal', Modal)
application.register('popover', Popover)
application.register('slideover', Slideover)
application.register('tabs', Tabs)
application.register('toggle', Toggle)
```

This will start StimulusJS and load any controllers that you have locally and then register the TailwindCSS components.

## Components

* [Alert](/docs/alert.md)
* [Autosave](/docs/autosave.md)
* [Color Preview](/docs/color-preview.md)
* [Dropdown](/docs/dropdown.md)
* [Modal](/docs/modal.md)
* [Popover](/docs/popover.md)
* [Slideover](/docs/slideover.md)
* [Tabs](/docs/tabs.md)
* [Toggle](/docs/toggle.md)

## Utilities

* [transition](/docs/transition.md)

## Styling

All of the styles for the Stimulus components are configurable. Our
examples above show some example styles you can use, but these
components themselves don't require any specific styles.

Stimulus simply requires the `data-` attributes to be defined correctly
to trigger actions and find targets.

Some components like the modal have some styles that are necessary for
proper use in the browser. The container and backgrounds are separate so
that you can have a fixed size container and the modal inside of it.

## Animations

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

# Popover Component

![popover](popover.gif)

## Usage

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

`data-alert-dismiss-after-value` can be provided to make the popover dimiss after x miliseconds. Default is `undefined`.
# Unreleased

# 4.0.1

* Tabs index now selects panels and no longer requires tabs

# 4.0.0

* [Breaking] Complete refactor to take advantage of new Stimulus features, completely rewrite transitions, and more! 🎉
* [Breaking] The main export is now cjs format and the module export is esm. We've dropped other formats as part of the move to esbuild.
* [Breaking] Use `data-action"controller#method:prevent` to call `preventDefault` where needed. Components will no longer prevent default automatically.
* Transitions now follow the TailwindCSS enter/leave pattern. This is based on the el-transition library.
    ```html
    <div class="hidden whatever default styles"
         data-transition-enter="transition duration-300"
         data-transition-enter-from="opacity-0"
         data-transition-enter-to="opacity-100"
         data-transition-leave="transition duration-300"
         data-transition-leave-from="opacity-100"
         data-transition-leave-to="opacity-0"
         >
      Content fades opacity over 300ms
    </div>
    ```
    These should be applied to the element that will transition. For example, apply these attributes to the menu element of a Dropdown.
* Alert transition classes have been moved to the transition API.
* Autosave now uses `requestSubmit` for submitting the form.
* Autosave now has configurable submitDuration, statusDuration, submittingText, successText, and errorText.
* ColorPreview now uses styleValue instead of `data-style` to define which CSS style it applies to (color, backgroundColor, etc).
* Dropdown transition classes have been moved to the transition API.
* Modal transition classes have been moved to the transition API.
* Modals now use a backgroundTarget to customize the background. `backdropColorValue` has been removed since this should be specified on your backdrop instead.
* Modals now use the `open` value to trigger the opening and closing of the modal.
* Popover transition classes have been moved to the transition API.
* Popovers now use `show` and `hide` instead of `mouseOver` and `mouseOut`.
* Slideovers transition classes have been moved to the transition API.
* Tabs now use activeTab and inactiveTab Stimulus classes
* Tabs also store the selected index in the indexValue
* Tabs can be set to update the URL anchor when a tab is selected using `updateAnchorValue`
* Toggles now support the transition API.

# 3.0.1

* Fix undefined scroll position - @PhilippMeissner

# 3.0.0

* Change package exports - @excid3

# 2.3.0

* Change Stimulus dependency to `@hotwired/stimulus` - @excid3

# 2.2.2

* [NEW] Add `dismissAfter` option for Alerts to auto-dismiss - @excid3

# 2.2.0

* [NEW] Added a color picker preview - @nickjj

# 2.1.3

* [NEW] `hide` and `show` methods for toggle - @A7madXatab #71

# 2.1.2

* [FIX] Allow button to be focused and toggle dropdown with space/enter - @drnic #59

# 2.1.1

* [FIX] Fix pointer events when alerts are visible - @inopinatus
* [FIX] Fix dropdowns open on page load - @julianrubisch

# 2.1.0

* [NEW] Updated Stimulus JS requirement to 2.0
* [NEW] Test suite has been added

# 2.0.12

* [FIX] Add default value so enterTimeout & leaveTimeout don't break - @excid3

# 2.0.11

* [NEW] Add slideover component - @julianrubisch

# 2.0.10

* [NEW] Add animations for dropdown menu - @julianrubisch

# 2.0.9

* [NEW] Add active class to dropdown component - @williamkennedy

# 2.0.8

* [NEW] Add Alert component @esmale

# 2.0.7

* [NEW] Use `data-id` on `tabs.change` element if specified

# 2.0.6

* [NEW] Use `data-index` on `tabs.change` element if specified

# 2.0.5

* Revert 2.0.4, microbundle's --external option didn't work as expected

# 2.0.4

* Change to specify external stimulus dependency instead of global since we're using peerDependencies

# 2.0.3

* [Fix] Build UMD module with access to global Stimulus

# 2.0.2

* [New] Add option to prevent or allow the default event when using the modal. @brunnogomes

# 2.0.1

* [Fix] Only set active tab using anchor if anchor is present

# 2.0.0

* [New] Move Stimulus.js to a peerDependency to reduce bundle size. @adrienpoly

# 1.1.0

* [New] Automatically select the visible tab based upon the anchor in the URL and the ID on the tabs

# 1.0.2

* [Fix] Close modal on disconnect. Fixes issues with Turbolinks caching the open modal.

# 1.0.0

* Initial release

# Unreleased

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

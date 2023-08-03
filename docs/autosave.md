# Autosave Component

Autosubmits forms for autosave functionality. Form submissions are debounced automatically with `1000ms` delay by default. 

## Usage

```js
import { Autosave } from "tailwindcss-stimulus-components"
application.register('autosave', Autosave)
```

Then apply it to a form. This example will fire the save event on keyup inside the title field.

```erb
<%= form_with(model: post, data: { controller: "autosave", autosave_target: "form", action: "turbo:submit-end->autosave#success turbo:fetch-request-error->autosave#error" }) do |form| %>
  <div class="form-group">
    <%= form.label :title %>
    <%= form.text_field :title, class: 'form-control', data: { action: "keyup->autosave#save" } %>
  </div>

  <div data-autosave-target="status"></div>

  <%= form.submit %>
<% end %>
```

The form is submitted using `form.requestSubmit()` and Turbo events are fired when the request is failed or completed. These different events are used to trigger the error or success messages accordingly.


## Handling the form submission server-side

Your server side should check the `params[:commit]` text (the value submitted by clicking the button) to see whether or not it should save as a draft or actually publish the record.

We recommend using a gem like Draftsman to help make the backend easier.
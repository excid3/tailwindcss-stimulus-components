// Form autosave
//
// <%= form_with(model: post, data: { controller: "autosave", autosave_target: "form", action: "turbo:submit-end->autosave#success turbo:fetch-request-error->autosave#error" }) do |form| %>
//   <div class="form-group">
//     <%= form.label :title %>
//     <%= form.text_field :title, class: 'form-control', data: { action: "keyup->autosave#save" } %>
//   </div>
//
//   <div data-autosave-target="status"></div>
// <% end %>

import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ['form', 'status']
  static values = {
    submitDuration: {type: Number, default: 1000},
    statusDuration: {type: Number, default: 2000},
    submittingText: {type: String, default: "Saving..."},
    successText: {type: String, default: "Saved!"},
    errorText: {type: String, default: "Unable to save."}
  }

  connect() {
    this.timeout = null
  }

  save() {
    clearTimeout(this.timeout)

    this.timeout = setTimeout(() => {
      this.statusTarget.textContent = this.submittingTextValue
      this.formTarget.requestSubmit()
    }, this.submitDurationValue)
  }

  success() {
    this.setStatus(this.successTextValue)
  }

  error() {
    this.setStatus(this.errorTextValue)
  }

  setStatus(message) {
    this.statusTarget.textContent = message

    this.timeout = setTimeout(() => {
      this.statusTarget.textContent = ''
    }, this.statusDurationValue)
  }
}

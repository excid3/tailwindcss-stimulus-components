import { Controller } from 'stimulus'

export default class extends Controller {
  static targets = ["input", "datalist"]
  static values = { url: String }

  connect() {
  }

  async search(event) {
    console.log(this.urlValue)
    const response = await fetch(this.urlValue)
    if (response.ok) {
      console.log(await response.json())

    }
  }
}

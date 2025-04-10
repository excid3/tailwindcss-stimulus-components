// TODO: Configuration options for:
//   - transformation duration

import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["button", "chevron", "panel"]
  static values = {
    exclusiveOpen: { type: Boolean, default: true },
    transformationClass: { type: String, default: "rotate-90" } // other options: scale-x-[-1], scale-y-[-1] rotate-180
  }

  connect() {
    // Close all panels when the controller is connected
    this.buttonTargets.forEach(button => {
      const index = button.dataset.index
      const panel = this.panelTargets[index]
      const chevron = this.chevronTargets[index]

      // Store the panel height as a data attribute only if it's not already stored
      if (!panel.dataset.height) {
        const height = panel.scrollHeight + "px";
        panel.dataset.height = height; // Save the height in a data attribute
      }

      this.close(panel, chevron)
    })
  }

  toggle(event) {
    const index = event.currentTarget.dataset.index
    const targetPanel = this.panelTargets[index]
    const targetChevron = this.chevronTargets[index]

    if (this.exclusiveOpenValue) {
      // Close all panels except the one clicked
      this.buttonTargets.forEach(button => {
        const index = button.dataset.index
        const panel = this.panelTargets[index]
        const chevron = this.chevronTargets[index]

        if (panel !== targetPanel) {
          this.close(panel, chevron)
        }
      })
    }

    // Toggle the clicked panel open/close
    if (targetPanel.style.height === '0px' || !targetPanel.style.height) {
      this.open(targetPanel, targetChevron)
    } else {
      this.close(targetPanel, targetChevron)
    }
  }

  open(panel, chevron) {
    // Get the stored height from the data attribute
    const height = panel.dataset.height;

    // Set the height to 0px initially (collapsed state)
    panel.style.height = '0px';

    // Trigger reflow to ensure the panel is collapsed properly
    panel.offsetHeight; // Force reflow

    // Set the height transition and expand the panel to the stored height
    panel.style.transition = 'height 0.25s ease-in-out';
    panel.style.height = height; // Use the stored height to expand

    if (chevron !== undefined && chevron !== null) {
      // Rotate the chevron
      chevron.classList.add('transform', this.transformationClassValue)
    }
  }

  close(panel, chevron) {
    // Set the transition to collapse the panel
    panel.style.transition = 'height 0.25s ease-in-out'
    panel.style.height = '0px'  // Collapse the panel

    if (chevron !== undefined && chevron !== null) {
      // Rotate the chevron back
      chevron.classList.remove(this.transformationClassValue)
    }
  }
}

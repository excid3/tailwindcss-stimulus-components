// Enter transition:
//
//   transition(this.element, true)
//
// Leave transition:
//
//    transition(this.element, false)
export async function transition(element, state, transitionOptions = {}) {
  if (!!state) {
    enter(element, transitionOptions)
  } else {
    leave(element, transitionOptions)
  }
}

// class="fixed inset-0 bg-black overflow-y-auto flex items-center justify-center bg-opacity-80 hidden"
// data-transition-enter="transition-all ease-in-out duration-300"
// data-transition-enter-from="bg-opacity-0"
// data-transition-enter-to="bg-opacity-80"
// data-transition-leave="transition-all ease-in-out duration-300"
// data-transition-leave-from="bg-opacity-80"
// data-transition-leave-to="bg-opacity-0"
export async function enter(element, transitionOptions = {}) {
  console.log("Starting enter")

  let interrupted = false
  if (element._stimulus_transition) {
    cancelTransition(element)
    element._stimulus_transition = null
  } else {
    console.log("not cancelling enter")
  }

  setupTransition(element)
  element._stimulus_transition.interrupt = () => {
    interrupted = true
  }

  const transitionClasses = element.dataset.transitionEnter || transitionOptions.enter || 'enter'
  const fromClasses = element.dataset.transitionEnterFrom || transitionOptions.enterFrom || 'enter-from'
  const toClasses = element.dataset.transitionEnterTo || transitionOptions.enterTo || 'enter-to'
  const toggleClass = element.dataset.toggleClass || transitionOptions.toggleClass || 'hidden'

  // Prepare transition
  return new Promise((resolve) => {
    if(interrupted) return

    requestAnimationFrame(() => {
      if(interrupted) return
      console.log("First enter frame.")
      element.classList.add(...transitionClasses.split(' '))
      element.classList.add(...fromClasses.split(' '))
      element.classList.remove(...toClasses.split(' '))
      element.classList.remove(...toggleClass.split(' '))

      requestAnimationFrame(() => {
        if(interrupted) return
        console.log("Second enter frame.")
        element.classList.remove(...fromClasses.split(' '))
        element.classList.add(...toClasses.split(' '))

        if(element._stimulus_transition) {
          element._stimulus_transition.timeout = setTimeout(() => {
            if(interrupted) return
            element.classList.remove(...transitionClasses.split(' '))
            element._stimulus_transition = null
            console.log("Timeout enter")
            resolve()
          }, getAnimationDuration(element))
        }
      })
    })
  })
}

function setupTransition(element) {
  element._stimulus_transition = {}
  element._stimulus_transition.timeout = null
  element._stimulus_transition.interrupted = false
}

function cancelTransition(element) {
  console.log(`Canceling....${element._stimulus_transition.timeout}`)
  element._stimulus_transition.interrupt()

  if(element._stimulus_transition.timeout) {
    console.log("Canceling timeout....")
    clearTimeout(element._stimulus_transition.timeout)
  }
}

function getAnimationDuration(element) {
  let duration = Number(getComputedStyle(element).transitionDuration.replace(/,.*/, '').replace('s', '')) * 1000
  let delay = Number(getComputedStyle(element).transitionDelay.replace(/,.*/, '').replace('s', '')) * 1000

  if (duration === 0) duration = Number(getComputedStyle(element).animationDuration.replace('s', '')) * 1000

  return duration + delay
}

export async function leave(element, transitionOptions = {}) {
  console.log("Starting leave")

  if (element._stimulus_transition) {
    cancelTransition(element)
    element._stimulus_transition = null
  } else {
    console.log("not cancelling leave")
  }

  let interrupted = false
  setupTransition(element)
  element._stimulus_transition.interrupt = () => {
    interrupted = true
  }

  const transitionClasses = element.dataset.transitionLeave || transitionOptions.leave || 'leave'
  const fromClasses = element.dataset.transitionLeaveFrom || transitionOptions.leaveFrom || 'leave-from'
  const toClasses = element.dataset.transitionLeaveTo || transitionOptions.leaveTo || 'leave-to'
  const toggleClass = element.dataset.toggleClass || transitionOptions.toggle || 'hidden'

  // Prepare transition
  return new Promise((resolve) => {
    if(interrupted) return
    requestAnimationFrame(() => {
      if(interrupted) return
      console.log("First leave frame.")
      element.classList.add(...fromClasses.split(' '))
      element.classList.remove(...toClasses.split(' '))
      element.classList.add(...transitionClasses.split(' '))

      requestAnimationFrame(() => {
        if(interrupted) return
        console.log("Second leave frame.")
        element.classList.remove(...fromClasses.split(' '))
        element.classList.add(...toClasses.split(' '))

        if(element._stimulus_transition) {
          element._stimulus_transition.timeout = setTimeout(() => {
            if(interrupted) return
            console.log("leave timeout")
            element.classList.remove(...transitionClasses.split(' '))
            element.classList.add(...toggleClass.split(' '))
            element._stimulus_transition = null
            resolve()
          }, getAnimationDuration(element))
        }
      })
    })
  })
}

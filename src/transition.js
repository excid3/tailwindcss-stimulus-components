// Enter transition:
//
//   transition(this.element, true)
//
// Leave transition:
//
//    transition(this.element, false)
export async function transition(element, state, transitionOptions = {}) {
  if (!!state) {
    await enter(element, transitionOptions)
  } else {
    await leave(element, transitionOptions)
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
  const transitionClasses = element.dataset.transitionEnter || transitionOptions.enter || 'enter'
  const fromClasses = element.dataset.transitionEnterFrom || transitionOptions.enterFrom || 'enter-from'
  const toClasses = element.dataset.transitionEnterTo || transitionOptions.enterTo || 'enter-to'
  const toggleClass = element.dataset.toggleClass || transitionOptions.toggleClass || 'hidden'

  return performTransitions(element, {
    firstFrame() {
      element.classList.add(...transitionClasses.split(' '))
      element.classList.add(...fromClasses.split(' '))
      element.classList.remove(...toClasses.split(' '))
      element.classList.remove(...toggleClass.split(' '))
    },
    secondFrame() {
      element.classList.remove(...fromClasses.split(' '))
      element.classList.add(...toClasses.split(' '))
    },
    ending() {
      element.classList.remove(...transitionClasses.split(' '))
    }
  })
}

export async function leave(element, transitionOptions = {}) {
  const transitionClasses = element.dataset.transitionLeave || transitionOptions.leave || 'leave'
  const fromClasses = element.dataset.transitionLeaveFrom || transitionOptions.leaveFrom || 'leave-from'
  const toClasses = element.dataset.transitionLeaveTo || transitionOptions.leaveTo || 'leave-to'
  const toggleClass = element.dataset.toggleClass || transitionOptions.toggle || 'hidden'

  return performTransitions(element, {
    firstFrame() {
      element.classList.add(...fromClasses.split(' '))
      element.classList.remove(...toClasses.split(' '))
      element.classList.add(...transitionClasses.split(' '))
    },
    secondFrame() {
      element.classList.remove(...fromClasses.split(' '))
      element.classList.add(...toClasses.split(' '))
    },
    ending() {
      element.classList.remove(...transitionClasses.split(' '))
      element.classList.add(...toggleClass.split(' '))
    }
  })
}

function setupTransition(element) {
  element._stimulus_transition = {
    timeout: null,
    interrupted: false
  }
}

export function cancelTransition(element) {
  if(element._stimulus_transition && element._stimulus_transition.interrupt) {
    element._stimulus_transition.interrupt()
  }
}

function performTransitions(element, transitionStages) {
  if (element._stimulus_transition) cancelTransition(element)

  let interrupted, firstStageComplete, secondStageComplete
  setupTransition(element)

  element._stimulus_transition.cleanup = () => {
    if(! firstStageComplete) transitionStages.firstFrame()
    if(! secondStageComplete) transitionStages.secondFrame()

    transitionStages.ending()
    element._stimulus_transition = null
  }

  element._stimulus_transition.interrupt = () => {
    interrupted = true
    if(element._stimulus_transition.timeout) {
      clearTimeout(element._stimulus_transition.timeout)
    }
    element._stimulus_transition.cleanup()
  }

  return new Promise((resolve) => {
    if(interrupted) return

    requestAnimationFrame(() => {
      if(interrupted) return

      transitionStages.firstFrame()
      firstStageComplete = true

      requestAnimationFrame(() => {
        if(interrupted) return

        transitionStages.secondFrame()
        secondStageComplete = true

        if(element._stimulus_transition) {
          element._stimulus_transition.timeout = setTimeout(() => {
            if(interrupted) {
              resolve()
              return
            }

            element._stimulus_transition.cleanup()
            resolve()
          }, getAnimationDuration(element))
        }
      })
    })
  })
}

function getAnimationDuration(element) {
  let duration = Number(getComputedStyle(element).transitionDuration.replace(/,.*/, '').replace('s', '')) * 1000
  let delay = Number(getComputedStyle(element).transitionDelay.replace(/,.*/, '').replace('s', '')) * 1000

  if (duration === 0) duration = Number(getComputedStyle(element).animationDuration.replace('s', '')) * 1000

  return duration + delay
}

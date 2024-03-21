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
  const transitionClasses = element.dataset.transitionEnter || transitionOptions.enter || 'enter'
  const fromClasses =
    element.dataset.transitionEnterFrom || transitionOptions.enterFrom || 'enter-from'
  const toClasses = element.dataset.transitionEnterTo || transitionOptions.enterTo || 'enter-to'
  const toggleClass = element.dataset.toggleClass || transitionOptions.toggleClass || 'hidden'

  // Prepare transition
  element.classList.add(...transitionClasses.split(' '))
  element.classList.add(...fromClasses.split(' '))
  element.classList.remove(...toClasses.split(' '))
  element.classList.remove(...toggleClass.split(' '))
  await nextFrame()

  element.classList.remove(...fromClasses.split(' '))
  element.classList.add(...toClasses.split(' '))

  try {
    await afterTransition(element)
  } finally {
    element.classList.remove(...transitionClasses.split(' '))
  }
}

export async function leave(element, transitionOptions = {}) {
  const transitionClasses = element.dataset.transitionLeave || transitionOptions.leave || 'leave'
  const fromClasses =
    element.dataset.transitionLeaveFrom || transitionOptions.leaveFrom || 'leave-from'
  const toClasses = element.dataset.transitionLeaveTo || transitionOptions.leaveTo || 'leave-to'
  const toggleClass = element.dataset.toggleClass || transitionOptions.toggle || 'hidden'

  // Prepare transition
  element.classList.add(...transitionClasses.split(' '))
  element.classList.add(...fromClasses.split(' '))
  element.classList.remove(...toClasses.split(' '))

  await nextFrame()

  element.classList.remove(...fromClasses.split(' '))
  element.classList.add(...toClasses.split(' '))

  try {
    await afterTransition(element)
  } finally {
    element.classList.remove(...transitionClasses.split(' '))
    element.classList.add(...toggleClass.split(' '))
  }
}

function nextFrame() {
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      requestAnimationFrame(resolve)
    })
  })
}

function afterTransition(element) {
  return Promise.all(element.getAnimations().map(animation => animation.finished))
}

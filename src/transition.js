// Enter transition:
//
//   transition(this.element, true)
//
// Leave transition:
//
//    transition(this.element, false)
export async function transition(element, state) {
  if (!!state) {
    enter(element)
  } else {
    leave(element)
  }
}

// class="fixed inset-0 bg-black overflow-y-auto flex items-center justify-center bg-opacity-80 hidden"
// data-transition-enter="transition-all ease-in-out duration-300"
// data-transition-enter-from="bg-opacity-0"
// data-transition-enter-to="bg-opacity-80"
// data-transition-leave="transition-all ease-in-out duration-300"
// data-transition-leave-from="bg-opacity-80"
// data-transition-leave-to="bg-opacity-0"
export async function enter(element) {
  const transitionClasses = element.dataset.transitionEnter || "enter"
  const fromClasses = element.dataset.transitionEnterFrom || "enter-from"
  const toClasses = element.dataset.transitionEnterTo || "enter-to"
  const toggleClass = element.dataset.toggleClass || "hidden"

  // Prepare transition
  element.classList.add(...transitionClasses.split(" "))
  element.classList.add(...fromClasses.split(" "))
  element.classList.remove(...toClasses.split(" "))
  element.classList.remove(...toggleClass.split(" "))

  await nextFrame()

  element.classList.remove(...fromClasses.split(" "))
  element.classList.add(...toClasses.split(" "))

  try {
    await afterTransition(element)
  } finally {
    element.classList.remove(...transitionClasses.split(" "))
  }
}

export async function leave(element) {
  const transitionClasses = element.dataset.transitionLeave || "leave"
  const fromClasses = element.dataset.transitionLeaveFrom || "leave-from"
  const toClasses = element.dataset.transitionLeaveTo || "leave-to"
  const toggleClass = element.dataset.toggleClass || "hidden"

  // Prepare transition
  element.classList.add(...transitionClasses.split(" "))
  element.classList.add(...fromClasses.split(" "))
  element.classList.remove(...toClasses.split(" "))

  await nextFrame()

  element.classList.remove(...fromClasses.split(" "))
  element.classList.add(...toClasses.split(" "))

  try {
    await afterTransition(element)
  } finally {
    element.classList.remove(...transitionClasses.split(" "))
    element.classList.add(...toggleClass.split(" "))
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

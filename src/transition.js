// A fork of el-transition
// https://github.com/mmccall10/el-transition

let transitioning = new Map()

// Accepts the intended state of the element
export async function toggleWithState(element, state, transitionName = null) {
  if (state) {
    await enter(element, transitionName)
  } else {
    await leave(element, transitionName)
  }
}

export async function enter(element, transitionName = null) {
  element.classList.remove('hidden')
  await transition('enter', element, transitionName)
}

export async function leave(element, transitionName = null) {
  try {
    await transition('leave', element, transitionName)
  } finally {
    element.classList.add('hidden')
  }
}

export async function toggle(element, transitionName = null) {
  if (element.classList.contains('hidden')) {
    await enter(element, transitionName)
  } else {
    await leave(element, transitionName)
  }
}

// transition('enter', element, null)
// transition('leave', element, null)
// transition('enter', element, 'dropdown')
//
// When transitioning, adds itself to `transitions` with direction
// If starting a new transition, looks at transitions and removes
async function transition(direction, element, animation) {
  const classes = transitionClasses(direction, element, animation)

  // Cleanup interrupted transition
  if (transitioning.has(element)) {
    const previousDirection = transitioning.get(element)
    const previousClasses = transitionClasses(previousDirection, element, animation)
    console.log("INTERRUPTED by", direction, "Removing", previousClasses)
    removeClasses(element, previousClasses.transition + previousClasses.start + previousClasses.end)
  }

  // if there's any overlap between the current set of classes and initial/start/end,
  // we should remove them before we start and add them back at the end
  const stash = []
  const current = new Set(element.classList.values())
  classes.transition.forEach(cls => current.has(cls) && stash.push(cls))
  classes.start.forEach(cls => current.has(cls) && stash.push(cls))
  classes.end.forEach(cls => current.has(cls) && stash.push(cls))

  transitioning.set(element, direction)

  // Prepare transition
  removeClasses(element, stash)
  addClasses(element, classes.transition)
  addClasses(element, classes.start)

  await nextFrame()

  // Start transition
  removeClasses(element, classes.start)
  addClasses(element, classes.end)

  await afterTransition(element)

  // Cleanup transition
  removeClasses(element, classes.end)
  removeClasses(element, classes.transition)
  addClasses(element, stash)

  // Remove transitioning state
  transitioning.delete(element)
}

function transitionClasses(direction, element, animation) {
  const dataset = element.dataset
  const animationClass = animation ? `${animation}-${direction}` : direction // 'dropdown-enter' or 'enter'
  let transition = `transition${direction.charAt(0).toUpperCase() + direction.slice(1)}` // 'transitionEnter'

  return {
    transition: dataset[transition] ? dataset[transition].split(" ") : [animationClass], // Lookup dataset.transitionEnter classes or use ['dropdown-enter'] or ['enter']
    start: dataset[`${transition}From`] ? dataset[`${transition}From`].split(" ") : [`${animationClass}-from`], // Lookup dataset.transitionEnterFrom classes
    end: dataset[`${transition}To`] ? dataset[`${transition}To`].split(" ") : [`${animationClass}-to`] // Lookup dataset.transitionEnterTo classes
  }
}

function addClasses(element, classes) {
  element.classList.add(...classes)
}

function removeClasses(element, classes) {
  element.classList.remove(...classes)
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

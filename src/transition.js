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
  try {
  element.classList.remove('hidden')
  await transition('enter', element, transitionName)
  } finally {
    cleanupInterruptedTransition(element, transitionName)
  }
}

export async function leave(element, transitionName = null) {
  try {
    await transition('leave', element, transitionName)
  } finally {
    element.classList.add('hidden')
    cleanupInterruptedTransition(element, transitionName)
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
async function transition(direction, element, transitionName) {
  cleanupInterruptedTransition(element, transitionName)

  const classes = transitionClasses(direction, element, transitionName)

  transitioning.set(element, direction)

  // Prepare transition
  addClasses(element, classes.transition)
  addClasses(element, classes.start)
  removeClasses(element, classes.end)

  await nextFrame()

  // Start transition
  removeClasses(element, classes.start)
  addClasses(element, classes.end)

  await afterTransition(element)

  // Cleanup transition
  removeClasses(element, classes.end)
  removeClasses(element, classes.transition)

  // Ensure original classes are there
  if ("originalClass" in element.dataset && element.dataset.originalClass !== "") {
    addClasses(element, element.dataset.originalClass.split(" "))
  }

  // Remove transitioning state
  transitioning.delete(element)
}

function transitionClasses(direction, element, transitionName) {
  const dataset = element.dataset
  const transitionNameClass = transitionName ? `${transitionName}-${direction}` : direction // 'dropdown-enter' or 'enter'
  let transition = `transition${direction.charAt(0).toUpperCase() + direction.slice(1)}` // 'transitionEnter'

  const classes = {
    transition: dataset[transition] ? dataset[transition].split(" ") : [transitionNameClass], // Lookup dataset.transitionEnter classes or use ['dropdown-enter'] or ['enter']
    start: dataset[`${transition}From`] ? dataset[`${transition}From`].split(" ") : [`${transitionNameClass}-from`], // Lookup dataset.transitionEnterFrom classes
    end: dataset[`${transition}To`] ? dataset[`${transition}To`].split(" ") : [`${transitionNameClass}-to`] // Lookup dataset.transitionEnterTo classes
  }

  return classes
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

async function cleanupInterruptedTransition(element, transitionName = null) {
  // Save original classes for restoration
  if (!("originalClass" in element.dataset)) {
    element.dataset.originalClass = [...element.classList].filter(c => c !== "hidden").join(" ")
  }


  // Cleanup interrupted transition
  if (transitioning.has(element)) {
    const previousDirection = transitioning.get(element)
    const previousClasses = transitionClasses(previousDirection, element, transitionName)
    removeClasses(element, previousClasses.transition + previousClasses.start + previousClasses.end)

    // Add back any duplicates
    if ("originalClass" in element.dataset && element.dataset.originalClass !== "") {
      addClasses(element, element.dataset.originalClass.split(" "))
    }

    transitioning.delete(element)
  }
}

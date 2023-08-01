// A fork of el-transition
// https://github.com/mmccall10/el-transition

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

async function transition(direction, element, animation) {
  const dataset = element.dataset
  const animationClass = animation ? `${animation}-${direction}` : direction
  let transition = `transition${direction.charAt(0).toUpperCase() + direction.slice(1)}`
  const genesis = dataset[transition] ? dataset[transition].split(" ") : [animationClass]
  const start = dataset[`${transition}From`] ? dataset[`${transition}From`].split(" ") : [`${animationClass}-from`]
  const end = dataset[`${transition}To`] ? dataset[`${transition}To`].split(" ") : [`${animationClass}-to`]

  // if there's any overlap between the current set of classes and genesis/start/end,
  // we should remove them before we start and add them back at the end
  const stash = []
  const current = new Set(element.classList.values())
  genesis.forEach(cls => current.has(cls) && stash.push(cls))
  start.forEach(cls => current.has(cls) && stash.push(cls))
  end.forEach(cls => current.has(cls) && stash.push(cls))

  removeClasses(element, stash)
  addClasses(element, genesis)
  addClasses(element, start)
  await nextFrame()
  removeClasses(element, start)
  addClasses(element, end);
  await afterTransition(element)
  removeClasses(element, end)
  removeClasses(element, genesis)
  addClasses(element, stash)
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
    });
  });
}

function afterTransition(element) {
  return Promise.all(element.getAnimations().map(animation => animation.finished))
}


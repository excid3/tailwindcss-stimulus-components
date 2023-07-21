export function fixtureFile(fileName) {
  return `/test/fixtures/${fileName}`
}

export async function fetchFixture(fileName) {
  const url = fixtureFile(fileName)
  const response = await fetch(url)

  return await response.text()
}

export async function afterTransition(element) {
  return Promise.all(element.getAnimations().map(animation => animation.finished))
}

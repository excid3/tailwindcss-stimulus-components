import { nextFrame } from '@open-wc/testing'

export function fixtureFile(fileName) {
  return `/test/fixtures/${fileName}`
}

export async function fetchFixture(fileName) {
  const url = fixtureFile(fileName)
  const response = await fetch(url)

  return await response.text()
}

import type { IMagicNavigationEventNames } from 'src/types'

export const magicNavigationEvent = (name: IMagicNavigationEventNames) =>
  new CustomEvent(name)

export function dispatchNavigationEvent(
  element: Element,
  name: IMagicNavigationEventNames,
) {
  element.dispatchEvent(new CustomEvent(name))
}

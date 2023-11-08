import type { IMagicNavigationEventNames } from 'src/types'

export const magicNavigationEvent = (name: IMagicNavigationEventNames) =>
  new CustomEvent(name)

export function dispatchNavigationEvent(
  name: IMagicNavigationEventNames,
  element?: Element,
) {
  if(!element) return
  element.dispatchEvent(new CustomEvent(name))
}

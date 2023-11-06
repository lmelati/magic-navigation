import {
  createComponent,
  createContext,
  onCleanup,
  useContext,
} from 'solid-js'
import { Navigation } from './navigation'
import type {
  IMagicNavigationProps,
} from './types'

const MagicNavigationContext = createContext<Navigation>()

export function MagicNavigation(props: IMagicNavigationProps) {
  const instance = new Navigation()

  onCleanup(() => {
    instance.destroy()
  })

  return createComponent(MagicNavigationContext.Provider, {
    value: instance,
    get children() {
      return props.children
    },
  })
}

export function useMagicNavigation(): Navigation {
  const ctx = useContext(MagicNavigationContext)

  if (!ctx) {
    throw new Error('Missing `<MagicNavigation>`')
  }

  return ctx
}
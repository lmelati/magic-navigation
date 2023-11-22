import { createComponent, createContext, onCleanup, useContext } from 'solid-js'
import { Navigation } from './models/navigation'
import type { IConfig, IMagicNavigation } from './types'

const MagicNavigationContext = createContext<{
  instance: Navigation
  config?: IConfig
}>()

export function MagicNavigation(props: IMagicNavigation) {
  const instance = new Navigation(props.config)

  onCleanup(() => {
    instance.destroy()
  })

  return createComponent(MagicNavigationContext.Provider, {
    value: {
      instance,
      config: props.config,
    },
    get children() {
      return props.children
    },
  })
}

export function useMagicNavigation(): {
  instance: Navigation
  config?: IConfig
} {
  const ctx = useContext(MagicNavigationContext)

  if (!ctx?.instance) {
    throw new Error('Missing `<MagicNavigation>`')
  }

  return {
    instance: ctx.instance,
    config: ctx.config,
  }
}

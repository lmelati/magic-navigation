import { BehaviorSubject, Subscription } from 'rxjs'
import { createComponent, createContext, onCleanup, useContext } from 'solid-js'
import { MagicNavigationInstance } from './magic-navigation-instance'
import type {
  MagicNavigationProps,
  magicNavigation,
  magicNavigationOptions,
} from './types'

const MagicNavigationContext = createContext<{
  instance: MagicNavigationInstance
  config: MagicNavigationProps['config']
}>()

export function MagicNavigation(props: MagicNavigationProps) {
  const instance = MagicNavigationInstance.getInstance()

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

function useMagicNavigationContext(): {
  instance: MagicNavigationInstance
  config: MagicNavigationProps['config']
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

export function createMagicNavigation(
  options: magicNavigationOptions
): magicNavigation {
  const { instance, config } = useMagicNavigationContext()

  const subscription = new Subscription()
  const active = new BehaviorSubject<boolean>(false)

  instance.onLoad(() => {
    if (instance.navigationStorage.getNode(options.key)) {
      instance.navigationStorage.deleteNode(options.key)
    }

    instance.addNote(
      { key: options.key, ref: options.ref, actions: options.actions },
      options.isActive
    )

    if (config.enableHover) {
      setTimeout(() => instance.mouseEvents(options.ref()), 50)
    }
  })

  onCleanup(() => {
    subscription.unsubscribe()
    instance.destroy()
  })

  subscription.add(
    instance.currentNode.subscribe((node) => {
      if (node?.key === options.key) {
        if (!active.getValue()) {
          active.next(true)
          setTimeout(() => {
            if (options.toggleActiveClass) {
              instance.toggleClass()
            }
          }, 50)
        }
      } else if (active.getValue() && node?.key !== options.key) {
        active.next(false)
        if (options.toggleActiveClass) options.ref().classList.toggle('focused')
      }
    })
  )

  const setCurrent = (current: string) => {
    const getCurrentNode = instance.navigationStorage.getNode(current)

    if (!getCurrentNode) {
      console.error(`Key ${current} does not exist`)
      return
    }

    if (active.getValue()) {
      active.next(false)
      if (options.toggleActiveClass) {
        instance.toggleClass()
      }
    }

    instance.setNode(current)
  }

  return {
    onStatusChange: (callback) => {
      subscription.add(active.subscribe(callback))
    },
    onCurrentChange: (callback) => {
      subscription.add(
        instance.currentNode.subscribe((node) => {
          if (node?.key && active.getValue()) {
            callback(node.key)
          }
        })
      )
    },
    setCurrent,
    clearNodes: () => instance.navigationStorage.clearNodes(),
  }
}

import type { magicNavigation, magicNavigationOptions } from './types'
import { Navigation } from './navigation'
import { BehaviorSubject } from 'rxjs'

class MagicNavigation extends Navigation {
  private static instance: MagicNavigation

  public static getInstance() {
    if (!MagicNavigation.instance) {
      MagicNavigation.instance = new MagicNavigation()
    }
    return MagicNavigation.instance
  }
}

export function createMagicNavigation(
  options: magicNavigationOptions,
): magicNavigation {
  const isActive = new BehaviorSubject<boolean>(false)
  const { currentNode, getNode, addNote, setNode, toggleClass } =
    MagicNavigation.getInstance()

  addNote(
    { key: options.key, ref: options.ref, actions: options.actions },
    options.isActive,
  )

  currentNode.subscribe((node) => {
    const { key } = options
    if (node?.key === key) {
      if (!isActive.getValue()) {
        isActive.next(true)
        setTimeout(() => toggleActiveClass(), 10)
      }
    }
  })

  const setCurrent = (current: string) => {
    const getCurrentNode = getNode(current)

    if (!getCurrentNode) {
      console.error(`Key ${current} does not exist`)
      return
    }

    if (isActive.getValue()) {
      isActive.next(false)
      toggleActiveClass()
    }

    setNode(current)
  }

  const toggleActiveClass = () => {
    const { toggleActiveClass } = options
    if (toggleActiveClass) {
      toggleClass()
    }
  }

  return {
    onStatusChange: (callback) => {
      isActive.subscribe((status) => callback(status))
    },
    onCurrentChange: (callback) => {
      currentNode.subscribe((node) => {
        if (node?.key && isActive.getValue()) {
          callback(node.key)
        }
      })
    },
    setCurrent,
  }
}

import type { magicNavigation, magicNavigationOptions } from './types'
import { MagicNavigation } from './magic-navigation'
import { BehaviorSubject } from 'rxjs'

export function createMagicNavigation({
  key,
  ref,
  actions,
  enableHover = true,
  isActive,
  toggleActiveClass,
}: magicNavigationOptions): magicNavigation {
  const active = new BehaviorSubject<boolean>(false)
  const {
    currentNode,
    onLoad,
    mouseEvents,
    getNode,
    addNote,
    setNode,
    clearNodes,
    toggleClass,
  } = MagicNavigation.getInstance()

  onLoad(() => {
    addNote({ key, ref, actions }, isActive)

    if (enableHover) {
      setTimeout(() => mouseEvents(ref()), 50)
    }
  })

  currentNode.subscribe((node) => {
    if (node?.key === key) {
      if (!active.getValue()) {
        active.next(true)
        setTimeout(() => {
          if (toggleActiveClass) {
            toggleClass()
          }
        }, 50)
      }
    } else if (active.getValue() && node?.key !== key) {
      active.next(false)
      if (toggleActiveClass) ref().classList.toggle('focused')
    }
  })

  const setCurrent = (current: string) => {
    const getCurrentNode = getNode(current)

    if (!getCurrentNode) {
      console.error(`Key ${current} does not exist`)
      return
    }

    if (active.getValue()) {
      active.next(false)
      if (toggleActiveClass) {
        toggleClass()
      }
    }

    setNode(current)
  }

  return {
    onStatusChange: (callback) =>
      active.subscribe((status) => callback(status)),
    onCurrentChange: (callback) => {
      currentNode.subscribe((node) => {
        if (node?.key && active.getValue()) {
          callback(node.key)
        }
      })
    },
    setCurrent,
    clearNodes
  }
}

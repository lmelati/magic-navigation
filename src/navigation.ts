import { BehaviorSubject, fromEvent, interval, throttle } from 'rxjs'
import { CurrentList } from './instances/CurrentList'
import { Storage } from './storage'
import type { IDirection, SetActiveIndexProps } from './types'
import { MAPPED_KEYS } from './types/keys'
import { dispatchNavigationEvent } from './utils/events'
import { getPosition } from './utils/position'
import { NavigationNode } from './instances/NavigationNode'

export class Navigation {
  public storage: Storage

  public readonly currentNode: BehaviorSubject<NavigationNode | undefined>
  public readonly currentList: BehaviorSubject<CurrentList | undefined>

  constructor() {
    this.storage = Storage.getInstance()

    this.currentNode = new BehaviorSubject<NavigationNode | undefined>(undefined)
    this.currentList = new BehaviorSubject<CurrentList | undefined>(undefined)

    fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(throttle(() => interval(150)))
      .subscribe(this.keyboardEvents)
  }

  destroy = () => {
    this.currentList.next(undefined)
    this.currentNode.next(undefined)
  }

  mouseEvents = (key: string, ref?: () => Element, type?: 'single' | 'list') => {
    const current = type === 'single' ? this.storage.getNode(key) : this.storage.getListRef(key, ref)

    if (!current || !ref) return

    const listElement = ref?.()

    if (current.actions?.onEnter) {
      listElement.addEventListener(
        'click',
        (event) => {
          event.stopPropagation()
          current.actions?.onEnter?.()
        },
        false
      )
    }

    listElement.addEventListener(
      'mouseenter',
      (event) => {
        event.stopPropagation()
        if(type === 'single') {
          this.setCurrentNode(key)
        } else {
          // @ts-ignore
          this.setCurrentList(key, current?.index)
        }
      },
      false
    )
  }

  /** Node **/
  setCurrentNode = (key: string) => {
    const getNode = this.storage.getNode(key)
    if (!getNode) {
      console.error(`Key ${key} does not exist`)
      return
    }

    if(this.currentList.getValue()) this.currentList.next(undefined)

    this.currentNode.next(getNode)
  }

  setActiveNode = (key: string) => {
    const getNode = this.storage.getNode(key)

    if (!getNode) {
      console.error(`Node with key "${key}" does not exist or is undefined.`)
      return
    }

    this.setCurrentNode(key)
  }


  /** List **/
  setCurrentList(key: string, index: number) {
    const getList = this.storage.getList(key)
    if (!getList) {
      console.error(`List ${key} does not exist`)
      return
    }

    if(this.currentNode.getValue()) this.currentNode.next(undefined)

    const newCurrentList = new CurrentList(key, index)
    this.currentList.next(newCurrentList)
  }

  setActive = (key: string) => {
    const getList = this.storage.getList(key)

    if (!getList) {
      console.error(`List with key "${key}" does not exist or is undefined.`)
      return
    }

    const findActive = getList.childrens.find((child) => child.isActive)
    this.setCurrentList(key, findActive?.index ?? 0)
  }

  setActiveIndex = ({ key, index }: SetActiveIndexProps) => {
    const getList = this.storage.getList(key)

    if (!getList) {
      console.error(`List with key "${key}" does not exist or is undefined.`)
      return
    }

    const getChildren = getList.childrens.find((child) => child.index === index)

    if (!getChildren) {
      console.error(
        `List children with key "${key}" and index "${index}" does not exist or is undefined.`
      )
      return
    }

    this.setCurrentList(key, getChildren.index)
  }

  private navigate = (direction: IDirection) => {
    const currentListValue = this.currentList.getValue()
    if (!currentListValue) return

    const { key, index } = currentListValue
    if (typeof index !== 'number') return

    const currentListFromStorage = this.storage.getList(key)

    if (!currentListFromStorage) return

    const newIndex =
      direction === 'left' || direction === 'top' ? index - 1 : index + 1

    if (typeof currentListFromStorage.childrens[newIndex]?.index === 'number') {
      this.setCurrentList(key, newIndex)
    }
  }

  private keyListEvents = (event: KeyboardEvent) => {
    const getCurrentList = this.currentList.getValue()

    if(!getCurrentList) return

    const currentList = this.storage.getList(getCurrentList.key)

    const currentChildren = this.storage.getListIndex(
      getCurrentList.key,
      getCurrentList.index
    )

    if (!currentChildren || !currentList) return

    const target = currentChildren
    const { direction, size } = currentList
    const { actions, ref } = target || {}

    const { first, last } = getPosition(getCurrentList.index, size)

    switch (event.key) {
      case MAPPED_KEYS.KEY_UP:
        if (actions?.onUp) {
          actions.onUp()
        } else if (direction === 'vertical') {
          if (first) {
            dispatchNavigationEvent('navigationonstart', ref?.())
          } else {
            this.navigate('top')
          }
        }
        break

      case MAPPED_KEYS.KEY_RIGHT:
        if (actions?.onRight) {
          actions.onRight()
        } else if (direction === 'horizontal') {
          if (last) {
            dispatchNavigationEvent('navigationonend', ref?.())
          } else {
            this.navigate('right')
          }
        }
        break

      case MAPPED_KEYS.KEY_DOWN:
        if (actions?.onDown) {
          actions.onDown()
        } else if (direction === 'vertical') {
          if (last) {
            dispatchNavigationEvent('navigationonend', ref?.())
          } else {
            this.navigate('bottom')
          }
        }
        break

      case MAPPED_KEYS.KEY_LEFT:
        if (actions?.onLeft) {
          actions.onLeft()
        } else if (direction === 'horizontal') {
          if (first) {
            dispatchNavigationEvent('navigationonstart', ref?.())
          } else {
            this.navigate('left')
          }
        }
        break

      case MAPPED_KEYS.KEY_BACK:
      case MAPPED_KEYS.KEY_BACK_TIZEN:
      case MAPPED_KEYS.KEY_ESCAPE:
        actions?.onBack?.()
        break

      case MAPPED_KEYS.KEY_ENTER:
        actions?.onEnter?.()
        break
    }
  }

  private keyNodeEvents = (event: KeyboardEvent) => {
    const getCurrentNode = this.currentNode.getValue()

    if(!getCurrentNode) return

    const { actions } = getCurrentNode || {}

    switch (event.key) {
      case MAPPED_KEYS.KEY_UP:
        actions.onUp?.()
        break

      case MAPPED_KEYS.KEY_RIGHT:
        actions.onRight?.()
        break

      case MAPPED_KEYS.KEY_DOWN:
        actions.onDown?.()
        break

      case MAPPED_KEYS.KEY_LEFT:
        actions.onLeft?.()
        break

      case MAPPED_KEYS.KEY_BACK:
      case MAPPED_KEYS.KEY_ESCAPE:
        actions?.onBack?.()
        break

      case MAPPED_KEYS.KEY_ENTER:
        actions?.onEnter?.()
        break
    }
  }

  private keyboardEvents = (event: KeyboardEvent) => {
    const getCurrentList = this.currentList.getValue()
    const getCurrentNode = this.currentNode.getValue()

    if(getCurrentList) this.keyListEvents(event)
    if(getCurrentNode) this.keyNodeEvents(event)
  }
}

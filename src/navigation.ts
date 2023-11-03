import { BehaviorSubject, fromEvent, interval, take, throttle } from 'rxjs'
import { Storage } from './storage'
import { CurrentList } from './instances/CurrentList'
import { MAPPED_KEYS } from './types/keys'
import type { IDirection } from './types'
import { getPosition } from './utils/position'
import { dispatchNavigationEvent } from './utils/events'

export class Navigation {
  public storage: Storage
  public readonly currentList: BehaviorSubject<CurrentList | undefined>

  constructor() {
    this.storage = Storage.getInstance()
    this.currentList = new BehaviorSubject<CurrentList | undefined>(undefined)

    fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(throttle(() => interval(150)))
      .subscribe(this.keyboardEvents)
  }

  init = (callback: () => void) => {
    fromEvent(document, 'DOMContentLoaded')
      .pipe(take(1))
      .pipe(throttle(() => interval(100)))
      .subscribe(callback)
  }

  destroy = () => {
    this.currentList.next(undefined)
  }

  mouseEvents = (key: string, ref: () => Element) => {
    const currentList = this.storage.getListRef(key, ref)

    if (!currentList) return

    const listElement = ref?.()

    if (currentList.actions?.onEnter) {
      listElement.addEventListener(
        'click',
        (event) => {
          event.stopPropagation()
          currentList.actions?.onEnter?.()
        },
        false,
      )
    }

    listElement.addEventListener(
      'mouseenter',
      (event) => {
        event.stopPropagation()
        this.setCurrentList(key, currentList.index)
      },
      false,
    )
  }

  /** List **/
  setCurrentList(key: string, index: number) {
    const getList = this.storage.getList(key)
    if (!getList) {
      console.error(`List ${key} does not exist`)
      return
    }

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

  private navigate = (direction: IDirection) => {
    const currentListValue = this.currentList.getValue()
    if (!currentListValue) return

    const { key, index } = currentListValue
    if (typeof index !== 'number') return

    const currentListFromStorage = this.storage.getList(key)

    if (!currentListFromStorage) return

    const newIndex =
      direction === 'left' || direction === 'bottom' ? index - 1 : index + 1

    if (typeof currentListFromStorage.childrens[newIndex]?.index === 'number') {
      this.setCurrentList(key, newIndex)
    }
  }

  private keyboardEvents = (event: KeyboardEvent) => {
    const getCurrentList = this.currentList.getValue()

    if (!getCurrentList) return

    const currentList = this.storage.getList(getCurrentList.key)
    const currentChildren = this.storage.getListIndex(
      getCurrentList.key,
      getCurrentList.index,
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
            dispatchNavigationEvent(ref?.(), 'navigationonstart')
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
            dispatchNavigationEvent(ref?.(), 'navigationonend')
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
            dispatchNavigationEvent(ref?.(), 'navigationonend')
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
            dispatchNavigationEvent(ref?.(), 'navigationonstart')
          } else {
            this.navigate('left')
          }
        }
        break

      case MAPPED_KEYS.KEY_BACK:
        actions?.onBack?.()
        break

      case MAPPED_KEYS.KEY_ENTER:
        actions?.onEnter?.()
        break
    }
  }
}

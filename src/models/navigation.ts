import { BehaviorSubject, fromEvent, interval, throttle } from 'rxjs'
import { IConfig, MAPPED_KEYS, type IDirection } from '../types'
import { getPosition } from '../utils/position'
import { CurrentList } from './currentList'
import { Item as CurrentItem } from './item'
import { LastKey } from './lastKey'
import { Storage } from './storage'

export class Navigation {
  public storage: Storage

  public readonly currentItem: BehaviorSubject<CurrentItem | null>
  public readonly currentList: BehaviorSubject<CurrentList | null>
  public lastKey: LastKey | null

  constructor(config?: IConfig) {
    this.storage = Storage.getInstance()
    this.currentItem = new BehaviorSubject<CurrentItem | null>(null)
    this.currentList = new BehaviorSubject<CurrentList | null>(null)
    this.lastKey = null

    fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(throttle(() => interval(config?.throttleInterval ?? 150)))
      .subscribe(this.keyboardEvents)
  }

  destroy = () => {
    const getValues = {
      item: {
        value: this.currentItem.getValue(),
        items: this.storage.getItems(),
      },
      list: {
        value: this.currentList.getValue(),
        lists: this.storage.getLists(),
      },
    }

    if (getValues.item.value) {
      this.currentItem.next(null)
    }

    if (getValues.item.items) {
      this.storage.clearItems()
    }

    if (getValues.list.value) {
      this.currentList.next(null)
    }

    if (getValues.list.lists) {
      this.storage.clearLists()
    }
  }

  setCurrentItem(key: string, item: CurrentItem) {
    const getItem = this.storage.getItem(key)
    const getCurrentList = this.currentList.getValue()

    if (!getItem) {
      console.error(`Item with ${key} does not exist`)
      return
    }

    if (getCurrentList) {
      this.currentList.next(null)
    }

    this.currentItem.next(item)
  }

  setCurrentList(key: string, index: number) {
    const getList = this.storage.getList(key)
    const getCurrentItem = this.currentItem.getValue()

    if (!getList) {
      console.error(`List with ${key} does not exist`)
      return
    }

    if (getCurrentItem) {
      this.currentItem.next(null)
    }

    const currentList = new CurrentList(key, index)
    this.currentList.next(currentList)
  }

  private navigate = (currentList: CurrentList, direction: IDirection) => {
    const { key, index } = currentList

    const getList = this.storage.getList(key)

    if (!getList) return

    const newPosition =
      direction === 'left' || direction === 'top' ? index - 1 : index + 1

    if (!getList.children[newPosition]) {
      console.error('position not found')
      return
    }

    this.setCurrentList(key, newPosition)
  }

  private keyListEvents = (event: KeyboardEvent) => {
    const getCurrentList = this.currentList.getValue()

    if (!getCurrentList) return

    const currentList = this.storage.getList(getCurrentList.key)
    const currentListSize = currentList?.children.length
    const currentListChildren = currentList?.children[getCurrentList.index]

    if (!currentListChildren || !currentList || !currentListSize) return

    const { direction } = currentList
    const { actions } = currentListChildren || {}

    const { first, last } = getPosition(getCurrentList.index, currentListSize)

    if (event.keyCode === 461) {
      actions?.onBack?.()
      return
    }

    switch (event.key) {
      case MAPPED_KEYS.KEY_UP:
        if (actions?.onUp) {
          actions.onUp()
        } else if (direction === 'vertical') {
          if (first) {
            actions?.onStart?.()
          } else {
            this.navigate(getCurrentList, 'top')
          }
        }
        break

      case MAPPED_KEYS.KEY_RIGHT:
        if (actions?.onRight) {
          actions.onRight()
        } else if (direction === 'horizontal') {
          if (last) {
            actions?.onEnd?.()
          } else {
            this.navigate(getCurrentList, 'right')
          }
        }
        break

      case MAPPED_KEYS.KEY_DOWN:
        if (actions?.onDown) {
          actions.onDown()
        } else if (direction === 'vertical') {
          if (last) {
            actions?.onEnd?.()
          } else {
            this.navigate(getCurrentList, 'bottom')
          }
        }
        break

      case MAPPED_KEYS.KEY_LEFT:
        if (actions?.onLeft) {
          actions.onLeft()
        } else if (direction === 'horizontal') {
          if (first) {
            actions?.onStart?.()
          } else {
            this.navigate(getCurrentList, 'left')
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
    const getCurrentItem = this.currentItem.getValue()

    if (!getCurrentItem) return

    const { actions } = getCurrentItem || {}

    if (event.keyCode === 461) {
      actions?.onBack?.()
      return
    }

    switch (event.key) {
      case MAPPED_KEYS.KEY_UP:
        actions?.onUp?.()
        break

      case MAPPED_KEYS.KEY_RIGHT:
        actions?.onRight?.()
        break

      case MAPPED_KEYS.KEY_DOWN:
        actions?.onDown?.()
        break

      case MAPPED_KEYS.KEY_LEFT:
        actions?.onLeft?.()
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

  private keyboardEvents = (event: KeyboardEvent) => {
    const getCurrentList = this.currentList.getValue()
    const getCurrentItem = this.currentItem.getValue()

    if (getCurrentList) this.keyListEvents(event)
    if (getCurrentItem) this.keyNodeEvents(event)
  }
}

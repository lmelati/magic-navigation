import {
  BehaviorSubject,
  Observable,
  Subscription,
  filter,
  fromEvent,
  pairwise,
  startWith,
} from 'rxjs'
import {
  onCleanup,
  onMount,
} from 'solid-js'
import type {
  IMagicListNavigation,
  IMagicListNavigationOptions,
  IMagicNavigationEventNames,
} from './types'
import { getPosition } from './utils/position'
import { useMagicNavigation } from './core'

export function createMagicListNavigation({
  key,
  actions,
  direction = 'horizontal',
  size,
  index,
  ref,
  isActive,
}: IMagicListNavigationOptions): IMagicListNavigation {
  const context = useMagicNavigation()
  const subscription = new Subscription()
  const currentIsActive = new BehaviorSubject<boolean>(false)
  const events: Record<string, Observable<unknown>> = {}

  /** Init  **/
  context.storage.setList({
    key,
    direction,
    size,
    children: {
      ref,
      actions,
      index,
      isActive: currentIsActive.getValue(),
    },
  })

  onMount(() => {
    const { first, last } = getPosition(index, size)

    if (first && ref) {
      // @ts-ignore
      events.onNavigationStart = navigationEvent('navigationonstart')
    }

    if (last && ref) {
      // @ts-ignore
      events.onNavigationEnd = navigationEvent('navigationonend')
    }

    /** Bind mouse events **/
    context.mouseEvents(key, ref)
  })

  const navigationEvent = (eventName: IMagicNavigationEventNames) => {
    if(!ref) return
    return fromEvent<IMagicNavigationEventNames>(ref(), eventName)
  }

  if (isActive?.()) {
    context.setCurrentList(key, index)
  }

  onCleanup(() => {
    const currentListKey = context.currentList.getValue()?.key
    if (key === currentListKey) {
      subscription.unsubscribe()
      context.destroy()
    }
  })

  subscription.add(
    context.currentList
      .pipe(
        startWith(undefined),
        pairwise(),
        filter(([prev, current]) => prev?.key === key || current?.key === key)
      )
      .subscribe(([prev, current]) => {
        const getPrev = prev?.key === key && prev.index === index
        const getCurrent = current?.key === key && current.index === index

        const getList = context.storage.getList(key)

        if (!getList) return

        const currentListKey = context.currentList.getValue()?.key
        const isCurrentActive = currentIsActive.getValue()

        if (getPrev) {
          const prevChildIndex = getList.childrens.findIndex(
            (child) => child.index === prev.index && isCurrentActive
          )
          currentIsActive.next(false)
          if (prevChildIndex !== -1 && key === currentListKey) {
            // @ts-ignore
            getList.childrens[prevChildIndex].isActive = false
          }
        }

        if (getCurrent) {
          const currentChildIndex = getList.childrens.findIndex(
            (child) => child.index === current.index && !isCurrentActive
          )
          if (currentChildIndex !== -1) {
            currentIsActive.next(true)
            // @ts-ignore
            getList.childrens[currentChildIndex].isActive = true
          }
        }
      })
  )

  return {
    setActiveNode: context.setActiveNode,
    setActive: context.setActive,
    setActiveIndex: context.setActiveIndex,
    onStatusChange: (callback) =>
      subscription.add(currentIsActive.subscribe(callback)),
    onNavigationStart: (callback: () => void) => {
      setTimeout(() => events.onNavigationStart?.subscribe(callback), 150)
    },
    onNavigationEnd: (callback: () => void) => {
      setTimeout(() => events.onNavigationEnd?.subscribe(callback), 150)
    },
    onCurrentChange: (callback) => {
      subscription.add(
        context.currentList.subscribe((current) => {
          if (current?.key && currentIsActive.getValue()) {
            callback(current.index)
          }
        })
      )
    },
  }
}

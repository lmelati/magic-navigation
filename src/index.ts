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
  createComponent,
  createContext,
  onCleanup,
  onMount,
  useContext,
} from 'solid-js'
import { Navigation } from './navigation'
import type {
  IMagicListNavigation,
  IMagicListNavigationOptions,
  IMagicNavigationEventNames,
  IMagicNavigationProps,
} from './types'
import { getPosition } from './utils/position'

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

function useMagicNavigation(): Navigation {
  const ctx = useContext(MagicNavigationContext)

  if (!ctx) {
    throw new Error('Missing `<MagicNavigation>`')
  }

  return ctx
}

export const clearList = (key: string) => {
  const context = useMagicNavigation()
  return context.storage.clearList(key)
}

export const clearAllList = () => {
  const context = useMagicNavigation()
  return context.storage.clearAllList()
}

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

    if (first) {
      events.onNavigationStart = navigationEvent('navigationonstart')
    }

    if (last) {
      events.onNavigationEnd = navigationEvent('navigationonend')
    }

    /** Bind mouse events **/
    context.mouseEvents(key, ref)
  })

  const navigationEvent = (eventName: IMagicNavigationEventNames) =>
    fromEvent<IMagicNavigationEventNames>(ref?.(), eventName)

  if (isActive?.()) {
    context.setCurrentList(key, index)
  }

  onCleanup(() => {
    subscription.unsubscribe()
    context.destroy()
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

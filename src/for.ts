import { Subscription, filter, pairwise, startWith } from 'rxjs'
import { createEffect, createSignal, onCleanup, onMount } from 'solid-js'
import { useMagicNavigation } from './core'
import { List } from './models/list'
import type { IAppend, IListChildren, IMagicList } from './types'

export function useMagicFor({
  key,
  direction = 'horizontal',
  mouseEvents = true,
  element,
  isActive,
  actions,
}: IMagicList & IAppend) {
  const [active, setActive] = createSignal(false)
  const navigation = useMagicNavigation()
  const subscription = new Subscription()
  let index = 0

  const getList = navigation.storage.getList(key)
  const children: IListChildren = {
    element,
    isActive: isActive?.() ? true : false,
    ...(actions && { actions }),
  }

  if (!getList) {
    const list = new List({
      key,
      direction,
      children: [children],
    })

    navigation.storage.setList(key, list)
  } else {
    index = getList.children.length
    getList.children.push(children)
  }

  function mouseEnterEvent(event: Event, key: string, index: number) {
    event.stopPropagation()
    const getCurrentList = navigation.currentList.getValue()
    if (getCurrentList?.index === index && getCurrentList?.key === key) return
    navigation.setCurrentList(key, index)
  }

  function mouseClickEvent(event: Event) {
    event.stopPropagation()
    if (!actions?.onEnter) return
    actions.onEnter()
  }

  function bindMouseEvents() {
    if (typeof element?.() === 'undefined') {
      console.error(`Element with key ${key} not exists`)
      return
    }

    const getCurrentListElement = navigation.storage.getListElement(
      key,
      element,
    )

    if (!getCurrentListElement?.children) {
      console.error(`List ${key} with element not exits`)
      return
    }

    const { children, index } = getCurrentListElement
    const ref = children.element?.()

    if (!ref) return

    ref.addEventListener(
      'mouseenter',
      (event) => mouseEnterEvent(event, key, index),
      false,
    )
    ref.addEventListener('click', (event) => mouseClickEvent(event), false)

    onCleanup(() => {
      ref.removeEventListener(
        'mouseenter',
        (event) => mouseEnterEvent(event, key, index),
        false,
      )
      ref.removeEventListener('click', (event) => mouseClickEvent(event), false)
    })
  }

  onMount(() => {
    if (mouseEvents && element) {
      bindMouseEvents()
    }
  })

  onCleanup(() => {
    subscription.unsubscribe()
    navigation.storage.clearList(key)
  })

  if (isActive?.()) {
    navigation.setCurrentList(key, index)
  }

  subscription.add(
    navigation.currentList
      .pipe(
        startWith(null),
        pairwise(),
        filter(([prev, current]) => prev?.key === key || current?.key === key),
      )
      .subscribe(([prev, current]) => {
        const getPrev = prev?.key === key && prev.index === index
        const getCurrent = current?.key === key && current.index === index
        const getList = navigation.storage.getList(key)

        if (!getList) return

        if (getPrev) {
          const prevChildren = getList.children.find(
            (_, index) => index === prev.index,
          )

          if (prevChildren && prevChildren.isActive && key === current?.key) {
            prevChildren.isActive = false
          }

          setActive(false)
        }

        if (getCurrent) {
          const currentChildren = getList.children.find(
            (_, index) => index === current.index,
          )

          if (currentChildren && !currentChildren.isActive) {
            currentChildren.isActive = true
          }

          setActive(true)
        }
      }),
  )

  return {
    onCurrentChange: (callback: (current: number) => void) => {
      createEffect(() => {
        if (active()) {
          callback(index)
        }
      })
    },
    onFocusChange: (callback: (status: boolean) => void) => {
      createEffect(() => callback(active()))
    },
    setCurrent: ({ key, index }: { key: string; index?: number }) => {
      const getList = navigation.storage.getList(key)
      if (!getList) {
        console.error(`List ${key} does not exists`)
        return
      }

      if (index) {
        const getListIndex = getList.children[index]
        if (!getListIndex) {
          console.error(`List ${key} with index ${index} does not exists`)
          return
        }
        navigation.setCurrentList(key, index)
      } else {
        const getLastActiveIndex = getList.children?.findIndex(
          (child) => child?.isActive,
        )
        if (getLastActiveIndex > -1) {
          navigation.setCurrentList(key, getLastActiveIndex)
        } else {
          navigation.setCurrentList(key, 0)
        }
      }
    },
    setCurrentItem: ({ key }: { key: string }) => {
      const getItem = navigation.storage.getItem(key)

      if (!getItem) {
        console.error(`Item with ${key} does not exists`)
        return
      }

      navigation.setCurrentItem(key, getItem)
    },
  }
}

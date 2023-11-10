import { Subscription } from 'rxjs'
import { createEffect, createSignal, onCleanup, onMount } from 'solid-js'
import { useMagicNavigation } from './core'
import { Item } from './models/item'
import type { IMagicItem, IMagicItemNavigation } from './types/item'

export function useMagicItem({
  key,
  mouseEvents = true,
  element,
  isActive,
  actions,
}: IMagicItem): IMagicItemNavigation {
  const [isFocused, setIsFocused] = createSignal(false)
  const navigation = useMagicNavigation()
  const subscription = new Subscription()
  const getItem = navigation.storage.getItem(key)

  if (getItem) {
    navigation.storage.deleteItem(key)
  }

  const item = new Item({
    key,
    element,
    actions,
  })

  navigation.storage.setItem(key, item)

  function mouseEnterEvent(event: Event) {
    event.stopPropagation()
    const getCurrentItem = navigation.currentItem.getValue()
    if (getCurrentItem?.key === key) return
    navigation.setCurrentItem(key, item)
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

    const ref = element()
    ref.addEventListener('mouseenter', (event) => mouseEnterEvent(event), false)
    ref.addEventListener('click', (event) => mouseClickEvent(event), false)
    onCleanup(() => {
      ref.removeEventListener(
        'mouseenter',
        (event) => mouseEnterEvent(event),
        false,
      )
      ref.removeEventListener('click', mouseClickEvent, false)
    })
  }

  onMount(() => {
    if (mouseEvents) {
      bindMouseEvents()
    }
  })

  onCleanup(() => {
    subscription.unsubscribe()
    navigation.storage.clearItem(key)
  })

  if (isActive?.()) {
    navigation.setCurrentItem(key, item)
  }

  subscription.add(
    navigation.currentItem.subscribe((item) => {
      const getCurrent = item?.key === key
      setIsFocused(getCurrent)
    }),
  )

  return {
    onFocusChange: (callback: (isFocused: boolean) => void) =>
      createEffect(() => callback(isFocused())),
    setCurrent: ({ key }: { key: string }) => {
      const getItem = navigation.storage.getItem(key)

      if (!getItem) {
        console.error(`Item with ${key} does not exists`)
        return
      }

      navigation.setCurrentItem(key, getItem)
    },
    setCurrentList: ({ key, index }: { key: string; index?: number }) => {
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
        const getLastActiveIndex = getList.children.findIndex(
          (child) => child.isActive,
        )
        if (getLastActiveIndex > -1) {
          navigation.setCurrentList(key, getLastActiveIndex)
        } else {
          navigation.setCurrentList(key, 0)
        }
      }
    },
  }
}

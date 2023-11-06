import { BehaviorSubject, Subscription } from "rxjs";
import { useMagicNavigation } from "./core";
import type { IMagicNavigation, IMagicNavigationOptions } from "./types/single";
import { onCleanup, onMount } from "solid-js";

export function createMagicNavigation({
  key,
  ref,
  actions,
  isActive
}: IMagicNavigationOptions): IMagicNavigation {
  const context = useMagicNavigation()
  const subscription = new Subscription()

  const active = new BehaviorSubject<boolean>(false)

  if(context.storage.getNode(key)) {
    context.storage.deleteNode(key)
  }

  context.storage.setNode({
    key,
    ref,
    actions
  })

  onMount(() => {
    /** Bind mouse events **/
    context.mouseEvents(key, ref, 'single')
  })

  if (isActive?.()) {
    context.setCurrentNode(key)
  }

  onCleanup(() => {
    subscription.unsubscribe()
    context.destroy()
  })

  subscription.add(
    context.currentNode.subscribe((node) => {
      if (node?.key === key) {
        if (!active.getValue()) {
          active.next(true)
        }
      } else if (active.getValue() && node?.key !== key) {
        active.next(false)
      }
    }),
  )

  return {
    setActive: context.setActive,
    onCurrentChange: (callback) => {
      subscription.add(
        context.currentNode.subscribe((node) => {
          if (node?.key && active.getValue()) {
            callback(node.key)
          }
        }),
      )
    },
    onStatusChange: (callback) => {
      subscription.add(active.subscribe(callback))
    },
  }
}
import { BehaviorSubject, fromEvent, interval, throttle } from 'rxjs'
import { NavigationNode, NavigationStorage } from './storage'
import type { NavigationNodeConfig } from './types'
import { MAPPED_KEYS } from './types/keys'

export abstract class Navigation {
  public navigationStorage: NavigationStorage
  public readonly currentNode: BehaviorSubject<NavigationNode | null>

  constructor() {
    this.navigationStorage = NavigationStorage.getInstance()
    this.currentNode = new BehaviorSubject<NavigationNode | null>(null)

    fromEvent(document, 'DOMContentLoaded').subscribe(() => this.onLoad)
    fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(throttle(() => interval(150)))
      .subscribe(this.keyboardEvents)
  }

  public setNode = (key: string) => {
    const getNode = this.navigationStorage.getNode(key)
    if (!getNode) {
      console.error(`Key ${key} does not exist`)
      return
    }
    this.currentNode.next(getNode)
  }

  public addNote = (config: NavigationNodeConfig, isActive?: () => boolean) => {
    this.navigationStorage.addNode(config)
    if (isActive?.()) {
      this.setNode(config.key)
    }
  }

  public toggleClass = () => {
    const currentNode = this.currentNode.getValue()
    if (currentNode?.ref) {
      currentNode.ref().classList.toggle('focused')
    }
  }

  public onLoad = (callback?: () => void) => callback?.()

  public destroy = () => {
    this.currentNode.next(null)
  }

  public mouseEvents = (ref: Element) => {
    if (!ref) return

    ref.addEventListener(
      'click',
      (event) => {
        event.stopPropagation()
        const currentNode = this.findCurrentNodeWithRef(ref)
        if (currentNode?.value?.actions?.onEnter) {
          currentNode.value.actions.onEnter()
        }
      },
      false
    )

    ref.addEventListener(
      'mouseenter',
      (event) => {
        event.stopPropagation()
        const currentNode = this.findCurrentNodeWithRef(ref)
        if (currentNode?.key) this.setNode(currentNode.key)
      },
      false
    )
  }

  private findCurrentNodeWithRef = (ref: Element) => {
    for (const [key, value] of this.navigationStorage.getNodes()) {
      if (value.ref?.() === ref) {
        return { key, value }
      }
    }
  }

  private keyboardEvents = (event: KeyboardEvent) => {
    if (!this.currentNode.getValue()) return
    const { actions } = this.currentNode.getValue() || {}
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
        actions?.onBack?.()
        break
      case MAPPED_KEYS.KEY_ENTER:
        actions?.onEnter?.()
        break
    }
  }
}

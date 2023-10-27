import { NavigationNode, NavigationStorage } from './storage'
import { BehaviorSubject, fromEvent, map } from 'rxjs'
import { MAPPED_KEYS } from './types/keys'
import { NavigationNodeConfig } from './types'

export abstract class Navigation {
  private navigationStorage: NavigationStorage
  public readonly currentNode: BehaviorSubject<NavigationNode | null>

  constructor() {
    this.navigationStorage = NavigationStorage.getInstance()
    this.currentNode = new BehaviorSubject<NavigationNode | null>(null)

    fromEvent(document, 'keydown')
      .pipe(map((event) => event as KeyboardEvent))
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

  public getNode = (key: string) => this.navigationStorage.getNode(key)

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

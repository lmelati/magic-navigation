import type { IItem } from '../types'

export class Item implements IItem {
  public key: string
  public element?: () => Element
  public actions?: Partial<{
    onUp: () => void
    onRight: () => void
    onDown: () => void
    onLeft: () => void
    onEnter: () => void
    onBack: () => void
    onStart: () => void
    onEnd: () => void
  }>

  constructor(item: IItem) {
    this.key = item.key
    this.element = item.element
    this.actions = item.actions
  }
}

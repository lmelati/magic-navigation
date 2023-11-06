import type { INavigationNode } from "src/types/single"

export class NavigationNode implements INavigationNode {
  public key: string
  public ref: () => Element
  public actions: {
    onUp?: () => void
    onRight?: () => void
    onDown?: () => void
    onLeft?: () => void
    onEnter?: () => void
    onBack?: () => void
  }

  constructor(config: INavigationNode) {
    this.key = config.key
    this.ref = config.ref
    this.actions = config.actions || {}
  }
}
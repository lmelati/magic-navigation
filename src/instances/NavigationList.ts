import type { IAxis, IListNavigationChildren, INavigationList } from "src/types"

export class NavigationList implements INavigationList {
  public key: string
  public direction: IAxis
  public size: number
  public childrens: Array<IListNavigationChildren>

  constructor(config: INavigationList) {
    this.key = config.key
    this.direction = config.direction
    this.size = config.size
    this.childrens = config.childrens
  }
}
import type { IAxis, IList, IListChildren } from '../types'

export class List implements IList {
  public key: string
  public direction: IAxis
  public children: Array<IListChildren>

  constructor(list: IList) {
    this.key = list.key
    this.direction = list.direction
    this.children = list.children
  }
}

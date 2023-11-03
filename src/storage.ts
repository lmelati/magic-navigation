import { NavigationList } from './instances/NavigationList'
import type { IListNavigationChildren, INavigationList } from './types'

export class Storage {
  private static instance: Storage
  private list: Map<string, NavigationList> = new Map()

  public static getInstance() {
    if (!Storage.instance) {
      Storage.instance = new Storage()
    }
    return Storage.instance
  }

  /** List **/
  getLists() {
    return this.list
  }

  getList(key: string) {
    return this.list.get(key)
  }

  getListRef(key: string, ref: () => Element) {
    const getList = this.getList(key)

    if (!getList) return

    for (const children of getList.childrens) {
      if (children.ref === ref) {
        return children
      }
    }
  }

  getListIndex(key: string, index: number) {
    const getList = this.getList(key)

    if (!getList) return

    for (const children of getList.childrens) {
      if (children.index === index) {
        return children
      }
    }
  }

  setList(list: Pick<INavigationList, 'key' | 'direction' | 'size'> & { children: IListNavigationChildren }) {
    const getList = this.getList(list.key)

    if(getList) {
      getList.childrens.push(list.children)
      return
    }

    const newList = new NavigationList({
      key: list.key,
      direction: list.direction,
      size: list.size,
      childrens: [list.children],
    })

    this.list.set(list.key, newList)
  }

  clearList(key: string) {
    this.list.delete(key)
  }
}

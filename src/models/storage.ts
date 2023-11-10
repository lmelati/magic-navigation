import { Item } from './item'
import { List } from './list'

export class Storage {
  private static instance: Storage

  private items: Map<string, Item> = new Map()
  private lists: Map<string, List> = new Map()

  public static getInstance() {
    if (!Storage.instance) {
      Storage.instance = new Storage()
    }
    return Storage.instance
  }

  setItem(key: string, item: Item) {
    return this.items.set(key, item)
  }

  getItems() {
    return this.items
  }

  getItem(key: string) {
    return this.items.get(key)
  }

  deleteItem(key: string) {
    this.items?.delete(key)
  }

  clearItems() {
    this.getItems()?.clear()
  }

  clearItem(key: string) {
    this.items?.delete(key)
  }

  setList(key: string, list: List) {
    return this.lists.set(key, list)
  }

  getLists() {
    return this.lists
  }

  getList(key: string) {
    return this.lists.get(key)
  }

  getListElement(key: string, element: () => Element) {
    const getList = this.getList(key)

    if (!getList) {
      console.error(`List with key ${key} not found`)
      return
    }

    for (const [index, children] of getList.children.entries()) {
      if (children?.element === element) {
        return {
          children,
          index
        }
      }
    }
  }

  deleteList(key: string) {
    this.lists?.delete(key)
  }

  clearLists() {
    this.getLists()?.clear()
  }

  clearList(key: string) {
    this.lists?.delete(key)
  }

  clearListChildrens(key: string) {
    const getList = this.getList(key)
    if (!getList) {
      console.error(`List ${key} does not exists`)
      return
    }

    getList.children = []
  }
}

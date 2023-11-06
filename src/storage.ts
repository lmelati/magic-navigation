import { NavigationList } from './instances/NavigationList'
import { NavigationNode } from './instances/NavigationNode'
import type { IListNavigationChildren, INavigationList } from './types'
import { INavigationNode } from './types/single'

export class Storage {
  private static instance: Storage

  private nodes: Map<string, NavigationNode> = new Map()
  private list: Map<string, NavigationList> = new Map()

  public static getInstance() {
    if (!Storage.instance) {
      Storage.instance = new Storage()
    }
    return Storage.instance
  }

  /** Node **/
  setNode(node: INavigationNode) {
    const getNode = this.getNode(node.key)

    if(getNode) {
      console.error(`Node ${node.key} already exists`)
      return
    }

    const newNode = new NavigationNode(node)
    this.nodes.set(node.key, newNode)
  }

  getNode(key: string) {
    return this.nodes.get(key)
  }

  getNodes() {
    return this.nodes
  }

  deleteNode(nodeId: string) {
    this.nodes?.delete(nodeId)
  }

  clearNodes() {
    this.getNodes()?.clear()
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

  clearLists() {
    this.list.clear()
  }
}

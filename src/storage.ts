import type { NavigationNodeConfig, magicNavigationKeys } from './types';

export class NavigationNode implements magicNavigationKeys {
  public key: string;
  public ref?: (() => Element) | undefined;
  public actions: {
    onUp?: () => void;
    onRight?: () => void;
    onDown?: () => void;
    onLeft?: () => void;
    onEnter?: () => void;
    onBack?: () => void;
  }

  constructor(config: NavigationNodeConfig) {
    this.key = config.key;
    this.ref = config.ref;
    this.actions = config.actions || {}
  }
}

export class NavigationStorage {
  private static instance: NavigationStorage | null = null;
  private nodes: Map<string, NavigationNode> = new Map();

  public static getInstance() {
    if (!NavigationStorage.instance) {
      NavigationStorage.instance = new NavigationStorage();
    }
    return NavigationStorage.instance;
  }

  public addNode({ key, actions, ref }: NavigationNodeConfig) {
    if (this.nodes.has(key)) {
      console.error(`Node ${key} already exists`);
      return;
    }
    const node = new NavigationNode({ key, actions, ref });
    this.nodes.set(key, node);
  }

  public updateRef({ key, ref }: Pick<NavigationNodeConfig, 'key' | 'ref'>) {
    const node = this.nodes.get(key);
    if (node && ref) {
      node.ref = ref
    }
  }

  public getNode(key: string) {
    return this.nodes.get(key);
  }

  public getNodes() {
    return this.nodes;
  }

  public clearNodes() {
    this.getNodes()?.clear()
  }
}

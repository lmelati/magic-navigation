export interface magicNavigationKeys {
  actions: {
    onUp?: () => void;
    onRight?: () => void;
    onDown?: () => void;
    onLeft?: () => void;
    onEnter?: () => void;
    onBack?: () => void;
  }
}

export interface NavigationNodeConfig extends Partial<magicNavigationKeys> {
  key: string;
  ref?: (() => Element) | undefined;
}

export interface magicNavigationOptions extends Partial<magicNavigationKeys> {
  key: string
  ref: () => Element
  enableHover?: boolean
  toggleActiveClass?: boolean
  isActive?: () => boolean
}

export interface magicNavigation {
  onStatusChange(callback: (status: boolean) => void): void
  onCurrentChange(callback: (current: string) => void): void
  setCurrent(current: string): void
}

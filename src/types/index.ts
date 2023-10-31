import type { JSX } from 'solid-js'

export interface magicNavigationKeys {
  actions: {
    onUp?: () => void
    onRight?: () => void
    onDown?: () => void
    onLeft?: () => void
    onEnter?: () => void
    onBack?: () => void
  }
}

export interface NavigationNodeConfig extends Partial<magicNavigationKeys> {
  key: string
  ref?: (() => Element) | undefined
}

export interface magicNavigationOptions extends Partial<magicNavigationKeys> {
  key: string
  ref: () => Element
  toggleActiveClass?: boolean
  isActive?: () => boolean
}

export interface magicNavigation {
  onStatusChange(callback: (status: boolean) => void): void
  onCurrentChange(callback: (current: string) => void): void
  setCurrent(current: string): void
  clearNodes(): void
}

export interface MagicNavigationProps {
  children?: JSX.Element
  config: {
    enableHover: boolean
  }
}

import { IMagicNavigationKeys } from "./keys"

export interface IMagicNavigationOptions extends Partial<IMagicNavigationKeys> {
  key: string
  ref?: () => Element
  isActive?: () => boolean
}

export interface IMagicNavigation {
  onStatusChange(callback: (status: boolean) => void): void
  onCurrentChange(callback: (current: string) => void): void
  setActive(key: string): void
}

export interface INavigationNode extends Partial<IMagicNavigationKeys> {
  key: string,
  ref?: () => Element
}
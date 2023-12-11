import type { LastKey } from '../models/lastKey'
import { IMagicNavigationKeys } from './keys'

export interface IMagicItem extends Partial<IMagicNavigationKeys> {
  key: string
  mouseEvents?: boolean
  element?: () => Element
  isActive?: () => boolean
}

export interface IMagicItemNavigation {
  onFocusChange(callback: (isFocused: boolean) => void): void
  setCurrent({ key }: { key: string }): void
  setCurrentList({ key, index }: { key: string; index?: number }): void
  getLastKey(): LastKey | null
}

export interface IItem extends Partial<IMagicNavigationKeys> {
  key: string
  element?: () => Element
}

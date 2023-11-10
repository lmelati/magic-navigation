import type { IMagicNavigationKeys } from './keys'

export type IDirection = 'top' | 'right' | 'bottom' | 'left'
export type IAxis = 'horizontal' | 'vertical'

export interface IMagicList {
  key: string
  direction?: IAxis
  mouseEvents?: boolean
}

export interface IAppend extends Partial<IMagicNavigationKeys> {
  isActive?: () => boolean
  element?: () => Element
}

export interface IListChildren extends Partial<IMagicNavigationKeys> {
  isActive: boolean
  element?: () => Element
}

export interface IList {
  key: string
  direction: IAxis
  children: Array<IListChildren>
}

export interface IAppendNavigation {
  onCurrentChange(callback: (current: number) => void): void
  onFocusChange(callback: (isFocused: boolean) => void): void
  setCurrent({ key, index }: { key: string; index?: number }): void
  setCurrentItem({ key }: { key: string }): void
}

export interface IMagicListNavigation {
  onFocusChange(callback: (isFocused: boolean) => void): void
  appendChildren({ element, isActive, actions }: IAppend): IAppendNavigation
}

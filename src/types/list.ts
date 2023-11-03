import { IMagicNavigationKeys } from "./keys"

export type IDirection = 'top' | 'right' | 'bottom' | 'left'
export type IAxis = 'horizontal' | 'vertical'
export type SetActiveIndexProps = { key: string, index: number }

export interface IMagicListNavigationOptions extends Partial<IMagicNavigationKeys> {
  key: string
  index: number
  ref: () => Element
  size: number
  direction?: IAxis,
  isActive?: () => boolean
}

export interface IMagicListNavigation {
  onStatusChange(callback: (status: boolean) => void): void
  onCurrentChange(callback: (current: unknown) => void): void
  onNavigationStart(callback: () => void): void
  onNavigationEnd(callback: () => void): void
  setActive(key: string): void
  setActiveIndex({ key, index }: SetActiveIndexProps): void
  clearList(key: string): void
}

export interface IListNavigationChildren extends Partial<IMagicNavigationKeys> {
  index: number,
  isActive: boolean,
  ref: () => Element
}

export interface INavigationList {
  key: string,
  direction: IAxis,
  size: number,
  childrens: Array<IListNavigationChildren>
}
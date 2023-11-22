import type { JSX } from 'solid-js'

export interface IMagicNavigation {
  children: JSX.Element
  config?: IConfig
}

export interface IConfig {
  throttleInterval?: number
}

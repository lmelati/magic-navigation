export enum MAPPED_KEYS {
  KEY_UP = 'ArrowUp',
  KEY_RIGHT = 'ArrowRight',
  KEY_DOWN = 'ArrowDown',
  KEY_LEFT = 'ArrowLeft',
  KEY_ENTER = 'Enter',
  KEY_BACK = 'GoBack',
  KEY_ESCAPE = 'Escape',
}

export interface IMagicNavigationKeys {
  actions: {
    onUp?: () => void
    onRight?: () => void
    onDown?: () => void
    onLeft?: () => void
    onEnter?: () => void
    onBack?: () => void
  }
}

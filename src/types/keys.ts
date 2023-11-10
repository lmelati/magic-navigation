export enum MAPPED_KEYS {
  KEY_UP = 'ArrowUp',
  KEY_RIGHT = 'ArrowRight',
  KEY_DOWN = 'ArrowDown',
  KEY_LEFT = 'ArrowLeft',
  KEY_ENTER = 'Enter',
  KEY_BACK = 'GoBack',
  KEY_BACK_TIZEN = 'XF86Back',
  KEY_ESCAPE = 'Escape',
}

export interface IMagicNavigationKeys {
  actions: Partial<{
    onUp: () => void
    onRight: () => void
    onDown: () => void
    onLeft: () => void
    onEnter: () => void
    onBack: () => void
    onStart: () => void
    onEnd: () => void
  }>
}

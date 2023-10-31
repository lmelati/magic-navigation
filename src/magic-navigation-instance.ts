import { Navigation } from './navigation'

export class MagicNavigationInstance extends Navigation {
  private static instance: MagicNavigationInstance

  public static getInstance() {
    if (!MagicNavigationInstance.instance) {
      MagicNavigationInstance.instance = new MagicNavigationInstance()
    }
    return MagicNavigationInstance.instance
  }
}

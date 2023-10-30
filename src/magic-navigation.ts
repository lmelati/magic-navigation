import { Navigation } from "./navigation"

export class MagicNavigation extends Navigation {
  private static instance: MagicNavigation

  public static getInstance() {
    if (!MagicNavigation.instance) {
      MagicNavigation.instance = new MagicNavigation()
    }
    return MagicNavigation.instance
  }
}
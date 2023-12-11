export class LastKey {
  public key: string
  public type: 'list' | 'item'

  constructor(key: string, type: 'list' | 'item') {
    this.key = key
    this.type = type
  }
}

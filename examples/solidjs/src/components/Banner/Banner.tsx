import './Banner.css'

import { createMagicListNavigation } from '../../../../../build/lib'
import { createSignal } from 'solid-js'

export const Banner = () => {
  let bannerRef!: HTMLDivElement
  const [isActive, setIsActive] = createSignal(false)
  const { onStatusChange, setActive } = createMagicListNavigation({
    key: 'banner',
    index: 0,
    ref: () => bannerRef,
    isActive: () => true,
    direction: 'horizontal',
    size: 1,
    actions: {
      onDown: () => {
        setActive('cards')
      }
    }
  })

  onStatusChange(setIsActive)

  return (
    <div class="bannerContainer">
      <div ref={bannerRef} class="banner" classList={{ focused: isActive() }}>
        <h1>Banner</h1>
      </div>
    </div>
  )
}

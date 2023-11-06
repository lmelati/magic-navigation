import './Banner.css'

import { createMagicNavigation } from '../../../../../build/lib'
import { createSignal } from 'solid-js'

export const Banner = () => {
  let bannerRef!: HTMLDivElement
  const [isActive, setIsActive] = createSignal(false)
  const { onStatusChange, setActive } = createMagicNavigation({
    key: 'banner',
    ref: () => bannerRef,
    isActive: () => true,
    actions: {
      onDown: () => setActive('cards'),
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

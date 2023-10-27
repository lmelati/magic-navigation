import './Banner.css'

import { createMagicNavigation } from '../../../../../build/lib'

export const Banner = () => {
  let bannerRef!: HTMLDivElement

  const { onStatusChange, onCurrentChange, setCurrent } = createMagicNavigation({
    key: 'banner',
    ref: () => bannerRef,
    toggleActiveClass: true,
    isActive: () => true,
    actions: {
      onDown: () => setCurrent('card-0')
    }
  })

  onCurrentChange((current) => console.log('current', current))
  onStatusChange((status) => console.log('status', status))

  return (
    <div class="bannerContainer">
      <div ref={bannerRef} class="banner">
        <h1>Banner</h1>
      </div>
    </div>
  )
}

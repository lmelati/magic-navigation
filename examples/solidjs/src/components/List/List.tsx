import './List.css'
import { For, createSignal } from 'solid-js'

import { createMagicListNavigation } from '../../../../../build/lib'

export const List = () => {
  let listRef!: HTMLDivElement
  const cards = [...Array(10).keys()]

  return (
    <div ref={listRef} class="list">
      <For each={cards}>
        {(item, index) => {
          let cardRef!: HTMLDivElement
          const [isActive, setIsActive] = createSignal(false)
          const { onStatusChange, setActive, onNavigationStart, onNavigationEnd } = createMagicListNavigation({
            key: 'cards',
            index: index(),
            ref: () => cardRef,
            size: cards.length,
            direction: 'horizontal',
            actions: {
              onEnter: () => console.log('clicou', item),
              onUp: () => {
                setActive('banner')
              },
            },
          })

          onStatusChange(setIsActive)
          onNavigationStart(() => console.log('UHUL DEU CERTO COMEÇO'))
          onNavigationEnd(() => console.log('UHUL DEU CERTO FIM'))

          return (
            <div ref={cardRef} class='card' classList={{ focused: isActive()}}>
              <span>{index()}</span>
            </div>
          )
        }}
      </For>
    </div>
  )
}

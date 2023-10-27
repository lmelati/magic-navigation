import './List.css'
import { For } from 'solid-js'

import { createMagicNavigation } from '../../../../../build/lib'

export const List = () => {
  let listRef!: HTMLDivElement
  const cards = [...Array(10).keys()]

  return (
    <div ref={listRef} class="list">
      <For each={cards}>
        {(_, index) => {
          let cardRef!: HTMLDivElement

          const { setCurrent } = createMagicNavigation({
            key: `card-${index()}`,
            ref: () => cardRef,
            toggleActiveClass: true,
            actions: {
              onUp: () => {
                setCurrent('banner')
              },
              onRight: () => {
                setCurrent(`card-${index() + 1}`)
              },
              onLeft: () => {
                setCurrent(`card-${index() - 1}`)
              },
            },
          })

          return (
            <div ref={cardRef} class="card">
              <span>{index()}</span>
            </div>
          )
        }}
      </For>
    </div>
  )
}

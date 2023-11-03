/* @refresh reload */
import { render } from 'solid-js/web'

import './index.css'
import App from './App'
import { MagicNavigation } from '../../../build/lib'

const root = document.getElementById('root')

render(() => (
  <MagicNavigation>
    <App />
  </MagicNavigation>
), root!)

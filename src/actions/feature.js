import { handleAction } from 'redux-actions'
import { rpc } from '../utils'

const randImgs = rpc.call('db-random', 32)

export const reducer = handleAction(
  'FEATURE_SETUP',
  state => state,
  { imgs: randImgs }
)

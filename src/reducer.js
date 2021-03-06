import isFunction from 'lodash/isFunction'
import omitBy from 'lodash/omitBy'

import { HISTORY_CREATE, HISTORY_LEARN, HISTORY_RESTORE } from './actions'
import { getFirstIndex, getLastIndex, getKeyIndex } from './select'

export const initState = {
  activeKey: null,
  firstKey: null,
  key: {},
  lastKey: null,
  refresh: false,
}
export function createNewState({ firstKey, refresh }, { id }, key) {
  return {
    activeKey: id,
    firstKey: firstKey || id,
    key,
    lastKey: id,
    refresh,
  }
}
export function removeForwardItems(items, index) {
  return omitBy(items, item => item.index >= index)
}
export function createNewHistory({ key }, { location, id, title, lastVisit }, index) {
  // Remove all entries with index equal or more.
  const items = removeForwardItems(key, index)
  items[id] = {
    index,
    lastVisit,
    location,
    id,
    title,
  }
  return items
}
export function historyCreate(state, payload) {
  const key = createNewHistory(state, payload, getKeyIndex(state) + 1)
  return createNewState(state, payload, key)
}
export function getLastKey(state, { id, index }) {
  if (!state.lastKey) return id
  const lastIndex = getLastIndex(state)
  if (index > lastIndex) return id
  return state.lastKey
}
export function getFirstKey(state, { id, index }) {
  if (!state.firstKey) return id
  const firstIndex = getFirstIndex(state)
  if (index < firstIndex) return id
  return state.firstKey
}
export function learnState(state, payload, key) {
  return {
    activeKey: payload.id,
    firstKey: getFirstKey(state, payload),
    key,
    lastKey: getLastKey(state, payload),
    refresh: true,
  }
}
function historyLearn(state, payload) {
  const key = createNewHistory(state, payload, payload.index)
  return learnState(state, payload, key)
}
function historyRestore({ key, ...state }, activeKey) {
  return {
    ...state,
    activeKey,
    key: {
      ...key,
      [activeKey]: {
        ...key[activeKey],
        lastVisit: Date.now(),
      },
    },
  }
}
const reducers = {
  [HISTORY_CREATE]: historyCreate,
  [HISTORY_LEARN]: historyLearn,
  [HISTORY_RESTORE]: historyRestore,
}
/**
 * This reducer will update the state with the most recent history key and location.
 */
export default function reducer(state = initState, action) {
  if (action.error || !action.type || !isFunction(reducers[action.type])) return state
  return reducers[action.type](state, action.payload)
}

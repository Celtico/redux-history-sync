import { HISTORY_CREATE, HISTORY_RESTORE, create } from './actions'

const initialState = {
  activeKey: null,
  firstKey: null,
  length: 0,
  key: {}
}
/**
 * This reducer will update the state with the most recent history key and location.
 */
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case HISTORY_RESTORE:
      return { ...state, activeKey: action.payload }
    case HISTORY_CREATE:
      const { payload: { key, location, title } } = action
      return {
        firstKey: state.firstKey || key,
        activeKey: key,
        length: state.length + 1,
        key: {
          ...state.key,
          [key]: {
            index: state.length,
            key,
            title,
            location
          }
        }
      }
    default:
      return state
  }
}

export function getInitState(location, title) {
  const action = create(location, title)
  const state = reducer(undefined, action)
  return state
}

export function makeHydratable(reducer) {
  return function hydratableReducer(state, action) {
    switch (action.type) {
      case HISTORY_RESTORE:
        // Replace state with that of history.
        return reducer(action.state, action)
      default:
        return reducer(state, action)
    }
  }
}

export function selectHistoryState(state) {
  return state.history
}

export function selectActiveKey(historyState) {
  const { activeKey, key } = historyState
  return key[activeKey]
}

export function selectActiveKeyDefault(state) {
  return selectActiveKey(selectHistoryState(state))
}
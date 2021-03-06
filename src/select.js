export function selectHistoryState(state) {
  return state.history
}
export function getKey(state, keyId) {
  const key = state.key[keyId]
  if (!key) throw new Error(`Missing history for key ${key}.`)
  return key
}
export function selectKey(keyType) {
  return (state, emptyKey = null) => {
    const keyId = state[keyType]
    if (keyId === null) return emptyKey
    return getKey(state, keyId)
  }
}
export const selectActiveKey = selectKey('activeKey')
export const selectFirstKey = selectKey('firstKey')
export const selectLastKey = selectKey('lastKey')
export function getIndex(selector) {
  return state => selector(state, { index: 0 }).index
}
export const getFirstIndex = getIndex(selectFirstKey)
export const getKeyIndex = getIndex(selectActiveKey)
export const getLastIndex = getIndex(selectLastKey)
export function selectActiveKeyDefault(state) {
  return selectActiveKey(selectHistoryState(state))
}
export function historyMatch(reduxHistory, windowHistory) {
  if (!windowHistory || !windowHistory.id) throw new Error('Missing window.history.state')
  const activeKey = selectActiveKey(reduxHistory)
  return activeKey.id === windowHistory.id
}
export function keyMatch(reduxHistory, windowHistory) {
  return reduxHistory.activeKey === windowHistory.id
}
export function getLength(reduxHistory) {
  if (!reduxHistory.lastKey) return 0
  return getLastIndex(reduxHistory) + 1
}
export function activeLastMatch({ activeKey, lastKey }) {
  return activeKey === lastKey
}
export function isNewHistory(reduxHistory) {
  // const length = getLength(reduxHistory)
  // console.log(browserState.length, length)
  return activeLastMatch(reduxHistory)// && browserState.length === (length - 1)
}
export function browserHistory(reduxHistory) {
  return {
    ...selectActiveKey(reduxHistory),
    length: getLength(reduxHistory),
  }
}
export function lengthMatch(reduxHistory, windowHistory) {
  return getLength(reduxHistory) === windowHistory.length
}
export function browserHasHistory(windowHistory) {
  return windowHistory.state && windowHistory.state.id
}

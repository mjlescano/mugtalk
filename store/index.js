import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'

let store = null

const defaultState = {
  talk: null,
  me: null,
  peers: [],
  messages: []
}

const reducers = {
  CONNECT (state, action) {
    return Object.assign({}, state, {
      talk: action.talk,
      me: action.me
    })
  },

  DISCONNECT (state, action) {
    return Object.assign({}, state, defaultState)
  },

  PEER_CONNECT (state, action) {
    const newState = Object.assign({}, state)

    newState.peers = newState.peers.concat(action.peer)

    return newState
  },

  PEER_DISCONNECT (state, action) {
    const newState = Object.assign({}, state)

    newState.peers = newState.peers.filter((p) => {
      return p.id !== action.id
    })

    return newState
  },

  SAY (state, { message }) {
    const newState = Object.assign({}, state)

    const currentIndex = newState.messages.findIndex((m) => m.id === message.id)

    newState.messages = newState.messages.slice()

    if (currentIndex !== -1) {
      newState.messages[currentIndex] = message
    } else {
      newState.messages.unshift(message)
    }

    return newState
  }
}

export function reducer (state = defaultState, action) {
  if (!reducers[action.type]) return state
  return reducers[action.type](state, action)
}

export function initStore (state = defaultState) {
  if (typeof window === 'undefined') {
    return createStore(reducer, state, applyMiddleware(thunkMiddleware))
  }

  if (!store) {
    store = createStore(
      reducer, state, composeWithDevTools(applyMiddleware(thunkMiddleware))
    )
  }

  return store
}

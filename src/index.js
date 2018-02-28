import { Provider, connect } from 'react-redux'
import React from 'react'
import {
  createStore,
  applyMiddleware,
  compose,
  bindActionCreators,
  combineReducers
} from 'redux'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

let middlewares = [thunkMiddleware]

const isDev =
  (typeof __DEV__ !== 'undefined' && __DEV__) ||
  (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined')

export const configureStore = (reducer, preloadState, moreMiddlewares = []) => {
  let enhancer = composeWithDevTools(
    applyMiddleware(...middlewares.concat(moreMiddlewares))
  )
  return preloadState
    ? createStore(reducer, preloadState, enhancer)
    : createStore(reducer, enhancer)
}

export function connected(mapStateToProps = state => state, actions = {}) {
  return Component => {
    const mapActionToProps = dispatch => ({
      dispatch,
      actions: bindActionCreators(actions, dispatch)
    })
    return connect(mapStateToProps, mapActionToProps)(Component)
  }
}

export function wrapper(store) {
  return Component => {
    return props => {
      return (
        <Provider store={store}>
          <Component {...props} />
        </Provider>
      )
    }
  }
}

export default function(
  rootReducer,
  initialState = {},
  actions = {},
  mapStateToProps = state => state
) {
  return Component => {
    const store = configureStore(rootReducer, initialState)
    const ConnectedComponent = connected(mapStateToProps, actions)(Component)
    return wrapper(store)(ConnectedComponent)
  }
}

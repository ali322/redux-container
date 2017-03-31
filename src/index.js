import { Provider, connect } from "react-redux"
import React from "react"
import { createStore, applyMiddleware, compose, bindActionCreators } from "redux"
import thunkMiddleware from "redux-thunk"
import { createLogger } from 'redux-logger'
import { composeWithDevTools } from 'remote-redux-devtools'

let middlewares = [thunkMiddleware]

const isDev = (typeof __DEV__ !== 'undefined' && __DEV__) ||
    (process.env.NODE_ENV !== 'production' && typeof window !== "undefined")
const port = process.env.REDUX_REMOTE_PORT || 8000
if (isDev) {
    middlewares.push(createLogger())
}

let composeEnhancers = composeWithDevTools({ realtime: !isDev });

if (typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()
}

export const configureStore = (reducer, preloadState) => {
    return createStore(reducer, preloadState, composeEnhancers(applyMiddleware(...middlewares)))
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
        return class extends React.Component {
            render() {
                return (
                    <Provider store={store}>
                    <Component {...this.props}/>
                    </Provider>
                )
            }
        }
    }
}

export default function(rootReducer, initialState = {}, actions = {}, mapStateToProps = state => state) {
    return Component => {
        const store = configureStore(rootReducer, initialState)
        const ConnectedComponent = connected(mapStateToProps, actions)(Component)
        return wrapper(store)(ConnectedComponent)
    }
}
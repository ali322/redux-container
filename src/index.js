import { Provider, connect } from "react-redux"
import React, { Component } from "react"
import { createStore, applyMiddleware, compose, bindActionCreators } from "redux"
import thunkMiddleware from "redux-thunk"
import createLogger from "redux-logger"
import { composeWithDevTools } from 'redux-devtools-extension'

let middlewares = [thunkMiddleware]

const isDev = (typeof __DEV__ !== 'undefined' && __DEV__) ||
    (process.env.NODE_ENV !== 'production' && typeof window !== "undefined")

if (isDev) {
    middlewares.push(createLogger())
}

export function configureStore(rootReducer,initialState,reducerPath){
    const _configureStore = compose(isDev ? composeWithDevTools(applyMiddleware(...middlewares)) :
        applyMiddleware(...middlewares))(createStore)
    const store = _configureStore(rootReducer,initialState)
    if(isDev && module.hot){
        module.hot.accept(reducerPath, () => {
            const nextRootReducer = require(reducerPath)
            store.replaceReducer(nextRootReducer)
        })
    }
    return store
}

export function connected(actions = {}, mapStateToProps = state => state) {
    return OriginalComponent => {
        const mapActionToProps = dispatch => ({
            dispatch,
            actions: bindActionCreators(actions, dispatch)
        })
        return connect(mapStateToProps, mapActionToProps)(OriginalComponent)
    }
}

export function wrapper(store) {
    return OriginalComponent => {
        return class extends Component {
            render() {
                return (
                    <Provider store={store}>
                    <OriginalComponent {...this.props}/>
                    </Provider>
                )
            }
        }
    }
}

export default function(rootReducer, initialState = {}, actions = {}, mapStateToProps = state => state) {
    return OriginalComponent => {
        const store = configureStore(rootReducer, initialState)
        const ConnectedComponent = connected(actions, mapStateToProps)(OriginalComponent)
        return wrapper(store)(ConnectedComponent)
    }
}
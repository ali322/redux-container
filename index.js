import {Provider,connect} from "react-redux"
import React,{Component} from "react"
import {createStore,applyMiddleware,compose,bindActionCreators} from "redux"
import thunkMiddleware from "redux-thunk"
import createLogger from "redux-logger"

let middlewares = [thunkMiddleware]

const isDev = (typeof __DEV__ !== 'undefined' && __DEV__) || process.env.NODE_ENV !== 'production'

if(isDev && typeof window !== "undefined"){
    middlewares.push(createLogger())
}

const configureStore = compose(applyMiddleware(...middlewares))(createStore)

export function connected(actions={},mapStateToProps=state=>state){
    return OriginalComponent=>{
        const mapActionToProps = dispatch=>({
            dispatch,
            actions:bindActionCreators(actions,dispatch)
        })
        return connect(mapStateToProps,mapActionToProps)(OriginalComponent)
    }
}

export function wrapper(rootReducer,initialState){
    return OriginalComponent=>{
        const store = configureStore(rootReducer,initialState)
        return class extends Component{
            render(){
                return (
                    <Provider store={store}>
                    <OriginalComponent {...this.props}/>
                    </Provider>
                )
            }
        }
    }
}

export default function (rootReducer,initialState={},actions={},mapStateToProps=state=>state){
    return OriginalComponent=>{
        const store = configureStore(rootReducer,initialState)
        const ConnectedComponent = connected(actions,mapStateToProps)(OriginalComponent)
        return wrapper(rootReducer,initialState)(ConnectedComponent)
    }
}
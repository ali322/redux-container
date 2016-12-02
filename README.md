Redux Container [![npm version](https://badge.fury.io/js/redux-container.svg)](https://badge.fury.io/js/redux-container)
===
[![NPM](https://nodei.co/npm/redux-container.png)](https://nodei.co/npm/redux-container/)

simple redux container for react component

Install
===

```javascript
npm install redux-container --save
```

Useage
===

use it in ES7 decorator or plain function 

```javascript
@container(rootReducer,initialState,actions)
class App extends Component{
    render(){}
}
```

## Todo

- fix some unknow bugs
- add more api documents


## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
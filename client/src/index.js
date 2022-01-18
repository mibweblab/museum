import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App.js";
import {Provider} from "react-redux"
import {createStore} from "redux"
import framesReducer from "./components/reducer.js";
import 'semantic-ui-css/semantic.min.css'

const store = createStore(framesReducer);

// renders React Component "Root" into the DOM element with ID "root"
ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById("root"));

// allows for live updating
module.hot.accept();

import React, {Component} from "react";
import { Provider } from "react-redux";
import store from "./Store";
import Routes from "./Routes";

export default class main extends Component{
    render(){
        return (
            <Provider store={store}>
                <Routes />
            </Provider>
        );
    }
}

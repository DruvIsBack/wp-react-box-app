import { createStore, applyMiddleware } from 'redux';
import {is_production} from './APIS';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import { allSagas } from './sagas';

import rootReducer from "./reducers/index";

const sagaMiddleware = createSagaMiddleware();
let store = null;
if(!is_production){
    store = createStore(
        rootReducer,
        composeWithDevTools(
            applyMiddleware(sagaMiddleware)
        )
    );
}else{
    store = createStore(
        rootReducer,
        applyMiddleware(sagaMiddleware)
    );
}

sagaMiddleware.run(allSagas);
export default store;

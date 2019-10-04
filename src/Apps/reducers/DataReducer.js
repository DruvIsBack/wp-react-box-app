import { UNSET_QUOTE_RESULT, SET_GLOBAL_DATA, SET_SCREENSHOT_FILE } from "../constants/action-types";

const appInitialState = {
    data: false,
    screenshot: false
};

export default (state = appInitialState, {type, payload})=>{
    switch(type){
        case SET_GLOBAL_DATA:
            return {...state, data: payload};
        case SET_SCREENSHOT_FILE:
            return {...state, screenshot: payload};
        case UNSET_QUOTE_RESULT:
            return {...state, screenshot: false};
        default:
            return {...state};
    }
};

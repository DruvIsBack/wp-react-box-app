import { SET_QUOTE, SET_QUOTE_RESULT, UNSET_QUOTE_RESULT } from "../constants/action-types";

const quoteInitialState = {
    wall_a: false,
    wall_b: false,
    wall_c1: false,
    wall_c2: false,
    result: false
};

export default (state = quoteInitialState, {type, payload})=>{
    switch(type){
        case SET_QUOTE:
            return {...state, ...payload};
        case SET_QUOTE_RESULT:
            return {...state, ...{result: payload}};
        case UNSET_QUOTE_RESULT:
            return {...quoteInitialState};
        default:
            return {...state, ...{result: false}};
    }
};

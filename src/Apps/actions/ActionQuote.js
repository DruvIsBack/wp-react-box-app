import {SET_QUOTE, SET_QUOTE_RESULT, UNSET_QUOTE_RESULT} from '../constants/action-types';

export let setQuote = (wall_a = false, wall_b = false, wall_c1 = false, wall_c2 = false)=>{
    let result = {
        type: SET_QUOTE,
        payload: {
            wall_a: wall_a,
            wall_b: wall_b,
            wall_c1: wall_c1,
            wall_c2: wall_c2
        }
    };
    return result;
};

export let setQuoteWallA = (wall_a)=>{
    return {
        type: SET_QUOTE,
        payload: {
            wall_a: wall_a
        }
    };
};

export let setQuoteWallB = (wall_b)=>{
    return {
        type: SET_QUOTE,
        payload: {
            wall_b
        }
    };
};

export let setQuoteWallC1 = (wall_c1)=>{
    return {
        type: SET_QUOTE,
        payload: {
            wall_c1
        }
    };
};

export let setQuoteWallC2 = (wall_c2)=>{
    return {
        type: SET_QUOTE,
        payload: {
            wall_c2
        }
    };
};

export let setResult = (data) => {
    return {
        type: SET_QUOTE_RESULT,
        payload: data
    };
};

export let clearResult = () => {
    return {
        type: UNSET_QUOTE_RESULT,
        payload: {}
    };
};

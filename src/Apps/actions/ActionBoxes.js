import {SET_BOXES, CLEAR_BOXES} from '../constants/action-types';

export let setBoxData = (arrData)=>{
    return {
        type: SET_BOXES,
        payload: arrData
    };
};
export let clearBoxData = ()=>{
    return {
        type: CLEAR_BOXES
    };
};

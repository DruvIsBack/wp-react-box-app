import { SET_BOXES, CLEAR_BOXES } from "../constants/action-types";

const initialState = {
    boxes: []
};

export default (state = initialState, {type, payload})=>{
    switch(type){
        case SET_BOXES:
            return {...state, boxes: payload};
        case CLEAR_BOXES:
            return {...state, boxes: []};
        default:
            return state;
    }
};

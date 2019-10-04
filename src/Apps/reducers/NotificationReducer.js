import { ALERT_OFF, ALERT_ON, ALERT_COUNTDOWN } from "../constants/action-types";

const initialState = {
    have: false,
    message: false,
    type: false,
    countdown: false
};

export default (state = initialState, {type, payload})=>{
    switch(type){
        case ALERT_ON:
            return payload;
        case ALERT_OFF:
            return payload;
        case ALERT_COUNTDOWN:
             return {countdown: payload, ...state};
        default:
            return {...state};
    }
};

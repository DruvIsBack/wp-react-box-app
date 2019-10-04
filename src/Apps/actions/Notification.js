import {ALERT_ON,ALERT_OFF, ALERT_COUNTDOWN} from '../constants/action-types';

export let sendNotification = (message, type = 0)=>{
    return {
        type: ALERT_ON,
        payload: {
            have: true,
            message,
            type,
            countdown: 10
        }
    };
};

export let discardNotification = ()=>{
    return {
        type: ALERT_OFF,
        payload: {
            have: false,
            message: false,
            type: false,
            countdown: false
        }
    };
};


export let countdownNotification = (val = false)=>{
    if(val <= 0){
        val = false;
        return discardNotification();
    }
    return {
        type: ALERT_COUNTDOWN,
        payload: val
    };
};

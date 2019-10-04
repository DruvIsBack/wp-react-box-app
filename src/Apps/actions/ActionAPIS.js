import {FETCH_BOX_DATA, SUBMIT_CONTACT_DATA} from '../constants/action-types';

export let fetchBoxData = ()=>{
    return {
        type: FETCH_BOX_DATA
    };
};

export let submitContactData = (data)=>{
    return {
        type: SUBMIT_CONTACT_DATA,
        payload: data
    };
};

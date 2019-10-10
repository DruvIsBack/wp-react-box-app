import {REDIRECT_TO_PATH, SET_QUOTE_BELOW_90_WARN, SET_SCREENSHOT_FILE, SET_GLOBAL_DATA, LOADING_START, LOADING_END, SET_QUOTE_ACTIVE, SET_QUOTE_IS_SPECIAL_WITH_REASON, SET_QUOTE_NOT_SPECIAL, REDIRECT_TO_CONTACT, SET_NEW_HISTORY,SET_HISTORY, UNSET_HISTORY} from '../constants/action-types';

export let isQuotActive = (active = true)=>{
    return {
        type: SET_QUOTE_ACTIVE,
        payload: {
            is_quote_selected: active
        }
    };
};
export const setSpecialCase = (reason, redirect_to_contact = true)=>{
    return {
        type : SET_QUOTE_IS_SPECIAL_WITH_REASON,
        payload: {
            is_special_cases: true,
            reason_special_cases: reason,
            redirect_to_contact_page: redirect_to_contact
        }
    };
};
export const setSpecialCase_below90cm = (status = true)=>{
    return {
        type : SET_QUOTE_BELOW_90_WARN,
        payload: status
    };
};
export const RedirectTo = (path)=>{
    return {
        type : REDIRECT_TO_PATH,
        payload: path
    };
};
export const RemoveRedirect = ()=>{
    return {
        type : REDIRECT_TO_PATH,
        payload: false
    };
};
export const redirectToContactPage = ()=>{
    return {
        type : REDIRECT_TO_CONTACT,
        payload: {
            redirect_to_contact_page: true
        }
    };
};
export const removeRedirectToContactPage = ()=>{
    return {
        type : REDIRECT_TO_CONTACT,
        payload: {
            redirect_to_contact_page: false
        }
    };
};

export const setNewHistory = (route)=>{
    return {
        type : SET_NEW_HISTORY,
        payload: {
            route
        }
    };
};
export const setHistory = (index, history)=>{
    return {
        type : SET_HISTORY,
        payload: {
            index, history
        }
    };
};
export const clearHistory = ()=>{
    return {
        type : UNSET_HISTORY
    };
};

export const removeSpecialCase = ()=>{
    return {
        type : SET_QUOTE_IS_SPECIAL_WITH_REASON,
        payload: {
            is_special_cases: false,
            reason_special_cases: false,
            redirect_to_contact_page: false
        }
    };
};

export const LoadingStart = (reason)=>{
    return {
        type : LOADING_START,
        payload: reason
    };
};
export const LoadingEnd = ()=>{
    return {
        type : LOADING_END
    };
};

export const setGlobalData = (data) => {
    return {
        type : SET_GLOBAL_DATA,
        payload: data
    };
};

export const setScreenshotFile = (file) => {
    return {
        type : SET_SCREENSHOT_FILE,
        payload: file
    };
};

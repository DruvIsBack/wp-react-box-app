import { REDIRECT_TO_PATH, SET_QUOTE_BELOW_90_WARN, LOADING_START, LOADING_END, SET_QUOTE_ACTIVE, REDIRECT_TO_CONTACT, SET_QUOTE_IS_SPECIAL_WITH_REASON,SET_NEW_HISTORY,SET_HISTORY, SET_HISTORY_INDEX, UNSET_HISTORY } from "../constants/action-types";

const appInitialState = {
    is_quote_selected: false,
    is_special_cases: false,
    reason_special_cases: false,
    redirect_to_contact_page: false,
    history: [],
    currentHistoryIndex: -1,
    loading: false,
    below90cm: false,
    redirectToPath: false
};

export default (state = appInitialState, {type, payload})=>{
    let data;
    switch(type){
        case LOADING_START:
            return {...state, loading: payload};
        case REDIRECT_TO_PATH:
            return {...state, redirectToPath: payload};
        case LOADING_END:
            return {...state, loading: false};
        case SET_QUOTE_ACTIVE:
            return {...state, ...payload};
        case REDIRECT_TO_CONTACT:
            data = {...state, ...payload};
            return data;
        case SET_QUOTE_IS_SPECIAL_WITH_REASON:
            return {...state,...payload};
        case SET_NEW_HISTORY:
            state.history.push(payload.route);
            state.currentHistoryIndex++;
            return {...state};
        case SET_QUOTE_BELOW_90_WARN:
            data = {...state, below90cm: payload};
            break;
        case SET_HISTORY:
            return {...state, ...{
                    history: payload.history,
                    currentHistoryIndex: payload.index
                }};
        default:
            return {...state};
    }
};

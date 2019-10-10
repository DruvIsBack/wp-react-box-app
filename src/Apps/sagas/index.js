import { takeLatest, all, put, call } from 'redux-saga/effects';
import {FETCH_BOX_DATA, SUBMIT_CONTACT_DATA} from '../constants/action-types';
import {fetch__GetAllBoxes, post__ContactData} from './APICalling';
import {setBoxData} from "../actions/ActionBoxes";
import {sendNotification} from "../actions/Notification";
import {generateRack} from '../components/QuoteRules';

export function* FETCH_BOX_LIST_ASYNC(){
    let result = yield call(fetch__GetAllBoxes);
    let data = yield result;
    if(data && data) {
        let finalData = [];
        data.map((item)=>{
            finalData.push(generateRack(item));
        });
        yield put(setBoxData(finalData));
    }
}
export function* SUBMIT_CONTACT_ASYNC({payload}){

    let result = yield call(post__ContactData, payload);
    let response = yield result;
    if(response) {
        yield put(sendNotification('Submitted! thank you, we will contact you soon!', 1));
    }else{
        yield put(sendNotification('Submission failed, Please try again!', -1));
    }
}

export function* allSagas(){
    yield all([
        yield takeLatest(FETCH_BOX_DATA, FETCH_BOX_LIST_ASYNC),
        yield takeLatest(SUBMIT_CONTACT_DATA, SUBMIT_CONTACT_ASYNC)
    ]);
}

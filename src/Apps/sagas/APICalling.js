import axios from 'axios';
import { takeLatest, all, put, call } from 'redux-saga/effects';
import APIS from '../APIS';
import {RedirectTo, LoadingEnd, LoadingStart} from "../actions/ActionApp";
import {sendNotification} from "../actions/Notification";

export const fetchAllBoxes = () =>{
    let config = {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        }
    }; 

    return axios.get(APIS.AJAX_GET_ALL_BOXES, config)
        .then(response => {
            let data = response.data;
            if(data.success){
                return data.data;
            }else{
                return false;
            }
        })
        .catch(err => {
            return false;
        });
};

export const submitContactData = (payload) =>{
    let config = {
        mode: 'no-cors',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        },
        withCredentials: true,
        credentials: 'same-origin',
    }; 

    return axios.post(APIS.AJAX_SUBMIT_CONTACT_DATA, payload, config)
    .then(response => {
        let data = response.data;
        if(data.success){
            return true;
        }
        return false;
    })
    .catch(err => {
        return false;
    });;
};

export function* fetch__GetAllBoxes() {
    yield put(LoadingStart('Fetching Box Data...'));
    let data = yield call(fetchAllBoxes);
    yield put(LoadingEnd());
    return data;
}
export function* post__ContactData(payload) {
    yield put(LoadingStart('Submit Contact Data...'));
    let result = yield call(submitContactData, payload);
    yield put(LoadingEnd());
    yield put(RedirectTo('/'));
    return result;
}

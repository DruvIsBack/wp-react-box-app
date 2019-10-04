import { combineReducers } from 'redux'
import NotificationReducer from '../reducers/NotificationReducer';
import QuoteReducer from '../reducers/QuoteReducer';
import AppReducer from '../reducers/AppReducer';
import BoxReducer from '../reducers/BoxReducer';
import DataReducer from '../reducers/DataReducer';

let allReducers = {
      notification: NotificationReducer,
      quote: QuoteReducer,
      app: AppReducer,
      box: BoxReducer,
      data: DataReducer
};
export default combineReducers(allReducers);



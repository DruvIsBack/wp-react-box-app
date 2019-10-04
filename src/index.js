import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Apps from './Apps';
import * as serviceWorker from './serviceWorker';
import {is_production} from './Apps/APIS';

let mode = is_production?'Production':'Development';
console.log('Currently running => '+mode);
ReactDOM.render(<Apps />, document.getElementById('root'));

serviceWorker.unregister();

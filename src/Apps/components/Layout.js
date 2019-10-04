import React, {Fragment} from 'react';

import Header from './Header';
import {discardNotification} from '../actions/Notification';

import {connect} from "react-redux";

const getNotificationTitle = (type)=>{
    switch(type){
        case 0:
            return "Notification!";
        case 1:
            return "Success!";
        case -1:
            return "Oops!";
    }
};

let getNotification = (notification, dispatch)=>{
    return (
        <div className="alert-area">
            <div className="alert-box">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">{getNotificationTitle(notification.type)}</h5>
                        <p className="card-text">{notification.message}</p>
                        <button onClick={(e)=>{dispatch(discardNotification())}} className="btn btn-primary">Ok</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

let Layout = (props)=>{

   return (
       <Fragment>
           <Header/>
           <div className="container" style={{flexDirection: "column", display: "flex", justifyContent: "center", alignItems: "center", padding: "50px 30px"}}>
           { props.children }
           </div>
           {(props.notification.have)?getNotification(props.notification, props.dispatch):false}
       </Fragment>
   );
};

export default connect(store=>({notification: store.notification}), dispatch => ({dispatch}))(Layout);

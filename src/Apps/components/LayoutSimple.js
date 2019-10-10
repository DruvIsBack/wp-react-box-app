import React, {Fragment, Component} from 'react'
import Loader from 'react-loader-spinner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBackward } from '@fortawesome/free-solid-svg-icons';
import {discardNotification,countdownNotification} from '../actions/Notification';
import {setHistory} from '../actions/ActionApp';
import {fetchBoxData} from '../actions/ActionAPIS';
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import {clearResult as clearQuote} from "../actions/ActionQuote";

let styles = {
    fullScreen: {
        backgroundColor: '#000000bd',
        position: 'fixed',
        zIndex: '99999999',
        height: '100vh',
        width: '100vw',
        top: 0,
        left: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
};

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

class Layout extends Component{

    componentDidMount() {
        this.props.dispatch(fetchBoxData());
    }

    state={
        redirectTo: false
    };
    componentDidUpdate() {
        if(this.state.redirectTo){
            this.setState({redirectTo: false});
        }
    }

    goForCustomQuery() {
        this.props.dispatch(clearQuote());
        this.setState({redirectTo: '/contact'});
        this.props.dispatch(discardNotification());
    }

    getNotification = (notification, dispatch)=>{
        setTimeout(()=>{
            dispatch(countdownNotification(--notification.countdown));
        },1000);
        return (
            <div className="alert-area">
                <div className="alert-box">
                    <div className="card">
                        <div className="card-body">
                            <div className='row'>
                                <div className='col-12 mb-4'>
                                    <h5 className="card-title">{getNotificationTitle(notification.type)}</h5>
                                    <p className="card-text">{notification.message}</p>
                                </div>
                                <div className='col-6 text-left'>
                                    <button onClick={this.goForCustomQuery.bind(this)} className="btn btn-outline-danger">Have custom query ?</button>
                                </div>
                                <div className='col-6 text-right'>
                                    <button onClick={(e)=>{dispatch(discardNotification())}} className="btn btn-outline-primary">Ok</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='progress-bar' style={{width: notification.countdown * 10+"%"}}/>
                </div>
            </div>
        );
    };

    redirectToHome = (e) => {
        e.preventDefault(true);
        this.setState({
            redirectTo: '/'
        });
    };

    redirectToBack = (e) => {
        e.preventDefault(true);
        let currentHistoryIndex = this.props.app.currentHistoryIndex;
        let history = this.props.app.history;
        if(currentHistoryIndex >= 0) {
            let newIndex = --currentHistoryIndex;
            let newHistory = history.slice(0, newIndex+1);
            this.setState({
                redirectTo: newHistory[newIndex]
            });
            this.props.dispatch(setHistory(newIndex, newHistory));
        }
    };

    fullScreenLoader = () => {
         return(
            <div style={styles.fullScreen}>
              <Loader
                 type="BallTriangle"
                 color="#00BFFF"
                 height={100}
                 width={100}
              />
            </div>
         );
    };

    render(){
        return (
            <Fragment>
                {(this.props.app.loading)?this.fullScreenLoader():false}
                {(this.state.redirectTo)?<Redirect to={this.state.redirectTo}/>:false}
                <div className="container-fluid" style={{position: "fixed", top: "0px", zIndex: "999"}}>
                    <nav className="navbar navbar-expand-sm bg-light justify-content-center">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <a className="nav-link" href="#" onClick={this.redirectToHome}>
                                    <FontAwesomeIcon icon={faHome} /> Home
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#" onClick={this.redirectToBack}>
                                    <FontAwesomeIcon icon={faBackward} /> Back
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div className="container body-container" style={{
                    flexDirection: "column",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    maxWidth: "unset",
                    marginTop: "58px"
                }}>
                    {this.props.children}
                </div>
                {(this.props.notification.have) ? this.getNotification(this.props.notification, this.props.dispatch) : false}
            </Fragment>
        );
    }
}

export default connect(store=>({notification: store.notification, app: store.app}), dispatch => ({dispatch}))(Layout);

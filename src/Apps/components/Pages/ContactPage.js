import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import {sendNotification} from "../../actions/Notification";

import {Redirect} from 'react-router-dom';
import {setNewHistory, RemoveRedirect} from "../../actions/ActionApp";
import {submitContactData} from '../../actions/ActionAPIS';

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const redirectToHomePage = (bool)=> {
    return (bool) ? <Redirect to="/"/> : false;
};

class ContactPage extends Component{
    state = {
        redirect_to: false,
        full_name: false,
        email: false,
        subject: false
    };

    componentDidMount() {
        if(this.props.app.history[this.props.app.currentHistoryIndex] !== "/contact") {
            this.props.dispatch(setNewHistory('/contact'));
        }
    }

    componentDidUpdate(){
        let path = this.props.app.redirectToPath;
        if(path){
            this.props.dispatch(RemoveRedirect());
            this.setState({redirect_to: path});
        }
    }

    onSubmitForm = (e)=>{
        e.preventDefault();
        if(!this.state.full_name){
            this.props.dispatch(sendNotification("Please enter your full name.", -1));
        }else if(!this.state.email) {
            this.props.dispatch(sendNotification("Please enter your email.", -1));
        }else if(!validateEmail(this.state.email)){
            this.props.dispatch(sendNotification("Please enter valid email.", -1));
        }else if(!this.state.subject){
            this.props.dispatch(sendNotification("Please enter your extra requirement.", -1));
        }else{
            let haveSpecialCase = this.props.app.is_special_cases;

            let final_data = {
                data: this.props.data,
                screenshot: this.props.screenshot,
                contact_details: {
                    full_name: this.state.full_name,
                    email: this.state.email,
                    subject: this.state.subject
                },
                special: false
            };

            if(haveSpecialCase){
                final_data['special'] = this.props.app.reason_special_cases;
            }
            this.props.dispatch(submitContactData(final_data));
        }
    };
    onClickBack = (e) => {
        let lastRedirectLocation = '/';
        if(
            this.hasOwnProperty('props')
            && this.props.hasOwnProperty('location')
            && this.props.location.hasOwnProperty('state')
            && this.props.location.state.hasOwnProperty('redirect_back_path')
        ){
            lastRedirectLocation = this.props.location.state.redirect_back_path;
        }else{
            lastRedirectLocation = '/';
        }
        this.setState({redirect_to: lastRedirectLocation});
    };

    specialCases = () =>{
        if(this.props.app.is_special_cases){
            return (
                <div className="alert alert-warning" role="alert">
                    <h2>{this.props.app.reason_special_cases}</h2>
                </div>
            );
        }else{
            return false;
        }
    };

    render() {
        return (
            <Fragment>
                {(this.state.redirect_to !== false)?<Redirect to={this.state.redirect_to}/>:false}
                <div className='container p-4'>
                    {
                        (!!this.props.data)?
                            <div className="jumbotron p-2 mb-5">
                                <h3 className="display-6">Submit Quote</h3>
                                <p className="lead">Submit your quotes to admin.</p>
                            </div>
                            :
                            <div className="jumbotron p-2 mb-5">
                                <h3 className="display-6">Contact</h3>
                                <p className="lead">Submit your enquiry data to admin.</p>
                            </div>
                    }
                    <div className='row' style={{ display: "flex",
                        justifyContent: "center" }}>
                        {
                            (!!this.props.data)?
                                <div className="col-md-6 col-sm-12">
                                    <img className='img-responsive' src={this.props.screenshot}/>
                                </div>
                            :false
                        }
                        <div className="col-md-6 col-sm-12">
                            <form onSubmit={this.onSubmitForm.bind(this)}>
                            <div className="form-group">
                                <label htmlFor="exampleInputPassword1">Full Name</label>
                                <input onChange={e=>{let val = e.target.value; val = val.trim(); if(!val.length){val = false;} this.setState({full_name: val})}} className="form-control" name="full_name"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="exampleInputEmail1">Email address</label>
                                <input onChange={e=>{let val = e.target.value; val = val.trim(); if(!val.length){val = false;} this.setState({email: val})}} type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"/>
                                <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                            </div>
                            <div className="form-group">
                                <label htmlFor="exampleInputPassword1">Subject / Requirements</label>
                                <textarea onChange={e=>{let val = e.target.value; val = val.trim(); if(!val.length){val = false;} this.setState({subject: val})}} className="form-control" name="subject"/>
                            </div>
                            <button type="submit" className="btn btn-primary">Send</button>
                        </form>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default connect(store=>({notification: store.notification, quote: store.quote, app: store.app, data: store.data.data, screenshot: store.data.screenshot}), dispatch => ({dispatch}))(ContactPage);

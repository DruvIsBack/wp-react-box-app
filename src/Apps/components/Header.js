import React from 'react';
import {NavLink} from 'react-router-dom';
import {connect} from "react-redux";
import {sendNotification} from "../actions/Notification";

let Header = (props)=>{
    let onSubmitSearch = (e)=>{
        e.preventDefault();
        props.dispatch(sendNotification("This is an example when search entered."));
    };

    return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" target="_blank" href="https://cybetiq.com">Drag-Box V.3.21</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
                <li className="nav-item active">
                    <NavLink className="nav-link" to={'/'}>Home</NavLink>
                </li>
                <li className="nav-item active">
                    <NavLink className="nav-link" to='/self-service'>Self Service</NavLink>
                </li>
                <li className="nav-item active">
                    <NavLink className="nav-link" to='/contact'>Contact</NavLink>
                </li>
            </ul>
            <form onSubmit={onSubmitSearch} className="form-inline my-2 my-lg-0">
                <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"/>
                    <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
            </form>
        </div>
    </nav>
)};

export default connect(null, dispatch => ({dispatch}))(Header);

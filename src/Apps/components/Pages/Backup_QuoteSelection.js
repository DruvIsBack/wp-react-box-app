import React, {Component} from 'react';
import {connect} from "react-redux";

import {setQuote} from '../../actions/ActionQuote';
import {isQuotActive, setNewHistory, setHistory} from '../../actions/ActionApp';

import {sendNotification} from '../../actions/Notification';
import {Redirect} from "react-router-dom";

const redirectToQuotationPage = (bool)=> {
    return (bool) ? <Redirect to="/self-service"/> : false;
};
const redirectToContactPage = (bool)=> {
    return (bool) ? <Redirect to={{ pathname: '/contact', state: {redirect_back_path: '/'} }}/> : false;
};
const getTrimmedString = (str) => {
    if(typeof str == "string"){
        return str.trim();
    }else{
        return str;
    }
};

class QuoteSelection extends Component{

    state = {
      wall_a: "",
      wall_b: "",
      wall_c1: "",
      wall_c2: "",

      redirect_quotation: false,
      redirect_contact: false
    };

    componentDidMount() {
        if(this.props.app.history[this.props.app.currentHistoryIndex] !== "/") {
            this.props.dispatch(setHistory('0',['/']));
        }
    }

    onClickSubmit = (e)=>{
        e.preventDefault();
        let wall_a = getTrimmedString(this.state.wall_a);
        let wall_b = getTrimmedString(this.state.wall_b);
        let wall_c1 = getTrimmedString(this.state.wall_c1);
        let wall_c2 = getTrimmedString(this.state.wall_c2);

        if((!wall_a || wall_a.length <= 0) && (wall_a !== 0 || wall_a !== "0")){
            wall_a = false;
        }else{
            wall_a = parseInt(wall_a);
        }
        if((!wall_b || wall_b.length <= 0) && (wall_b !== 0 || wall_b !== "0")){
            wall_b = false;
        }else{
            wall_b = parseInt(wall_b);
        }
        if((!wall_c1 || wall_c1.length <= 0) && (wall_c1 !== 0 || wall_c1 !== "0")){
            wall_c1 = false;
        }else{
            wall_c1 = parseInt(wall_c1);
        }
        if((!wall_c2 || wall_c2.length <= 0) && (wall_c2 !== 0 || wall_c2 !== "0")){
            wall_c2 = false;
        }else{
            wall_c2 = parseInt(wall_c2);
        }


        if(!wall_a){
            this.props.dispatch(sendNotification("Wall-A is value is mandatory."));
        }else if(!wall_b){
            this.props.dispatch(sendNotification("Wall-B is value is mandatory."));
        }else{
            if(wall_a < 90){
                this.setState({wall_a: 90});
                this.props.dispatch(sendNotification("Wall-A value can't be less than 90cm."));
            }else{
                let result = setQuote(wall_a, wall_b, wall_c1, wall_c2);
                console.log({result});
                if(result) {
                    this.props.dispatch(result);
                    this.props.dispatch(isQuotActive());
                    this.setState({redirect_quotation: true});
                }else{
                    this.props.dispatch(sendNotification("Wall-A & Wall-B is mandatory, if you have confusion please contact us."));
                    this.setState({redirect_contact: true});
                }
            }
        }
    };

    onBlurWallA = ()=>{
        if(this.state.wall_a.length > 0) {
            let val = this.state.wall_a;
            if (val < 1) {
                this.props.dispatch(sendNotification("Please provide Wall-A value correctly."));
                val = 90;
            } else if (val > 360) {
                val = 360;
                this.props.dispatch(sendNotification("Wall A should be less than or equals 3.6m."));
            }
            this.setState({wall_a: val});
        }else{
            this.props.dispatch(sendNotification("If you have confusion you can contact us."));
        }
    };
    onBlurWallB = ()=>{
        if(this.state.wall_b.length > 0) {
            let val = this.state.wall_b;
            if (val < 1) {
                this.props.dispatch(sendNotification("Please provide Wall-B value correctly."));
                val = 90;
            } else if (val > 360) {
                val = 360;
                this.props.dispatch(sendNotification("Wall B should be less than or equals 3.6m."));
            }
            this.setState({wall_b: val});
        }else{
            this.props.dispatch(sendNotification("If you have confusion you can contact us."));
        }
    };
    onBlurWallC1 = ()=>{
        if(this.state.wall_c1.length > 0) {
            let val = this.state.wall_c1;
            if (this.state.wall_a > 0 && this.state.wall_b > 0) {
                let available_space = this.state.wall_a - 90 - this.state.wall_c2;
                if (available_space < val) {
                    if (available_space < 0) {
                        let c2 = parseInt(this.state.wall_c2) + parseInt(available_space);
                        this.setState({wall_c2: c2, wall_c1: 0});
                    } else {
                        this.setState({wall_c1: available_space});
                    }
                    this.props.dispatch(sendNotification("C1 & C2 should be equals or less than (Wall-A - 90), where 90cm is the minimum door of the container."));
                } else {
                    this.setState({wall_c1: val});
                }
            } else {
                this.setState({wall_c1: ""});
                this.props.dispatch(sendNotification("Please enter Wall-A & Wall-B value first."));
            }
        }
    };
    onBlurWallC2 = ()=>{
        if(this.state.wall_c2.length > 0) {
            let val = this.state.wall_c2;
            if (this.state.wall_a.length > 0 && this.state.wall_b.length > 0) {
                let available_space = this.state.wall_a - 90 - this.state.wall_c1;
                if (available_space < val) {
                    if (available_space < 0) {
                        let c1 = parseInt(this.state.wall_c1) + parseInt(available_space);
                        this.setState({wall_c1: c1});
                        this.setState({wall_c2: 0});
                    } else {
                        this.setState({wall_c2: available_space});
                    }
                    this.props.dispatch(sendNotification("C1 & C2 should be equals or less than (Wall-A - 90), where 90cm is the minimum door of the container."));
                } else {
                    this.setState({wall_c2: val});
                }
            } else {
                this.setState({wall_c2: ""});
                this.props.dispatch(sendNotification("Please enter Wall-A & Wall-B value first."));
            }
        }
    };

    onChangeWallA = (e)=>{
        let val = e.target.value;
        this.setState({wall_a: val});
    };
    onChangeWallB = (e)=>{
        let val = e.target.value;
        this.setState({wall_b: val});
    };
    onChangeWallC1 = (e)=>{
        let val = e.target.value;
        this.setState({wall_c1: val});
    };
    onChangeWallC2 = (e)=>{
        let val = e.target.value;
        this.setState({wall_c2: val});
    };

    render() {
        return (
            <form onSubmit={this.onClickSubmit}>
                {redirectToQuotationPage(this.state.redirect_quotation)}
                {redirectToContactPage(this.state.redirect_contact)}
                <div className="form-group">
                    <label>Enter length of Wall-A (**Mandatory)</label>
                    <input value={this.state.wall_a} onBlur={this.onBlurWallA} onChange={this.onChangeWallA} type="number" className="form-control" placeholder="Enter length in Centimeter"/>
                    <small className="form-text text-muted">Please put length as centimeter unit.</small>
                </div>
                <div className="form-group">
                    <label>Enter length of Wall-B (**Mandatory)</label>
                    <input value={this.state.wall_b} onBlur={this.onBlurWallB} onChange={this.onChangeWallB}  type="number" className="form-control" placeholder="Enter length in Centimeter"/>
                    <small className="form-text text-muted">Please put length as centimeter unit.</small>
                </div>
                <div className="form-group">
                    <label>Enter length of C1</label>
                    <input value={this.state.wall_c1} onBlur={this.onBlurWallC1} onChange={this.onChangeWallC1} type="number" className="form-control" placeholder="Enter length in Centimeter"/>
                    <small className="form-text text-muted">Please put length as centimeter unit.</small>
                </div>
                <div className="form-group">
                    <label>Enter length of C2</label>
                    <input value={this.state.wall_c2} onBlur={this.onBlurWallC2} onChange={this.onChangeWallC2}  type="number" className="form-control" placeholder="Enter length in Centimeter"/>
                    <small className="form-text text-muted">Please put length as centimeter unit.</small>
                </div>
                <div className="form-group">
                    <button onClick={this.onClickSubmit} type="submit" className="btn btn-primary">Submit</button>
                </div>
            </form>
        );
    }
}

export default connect(store=>({notification: store.notification, quote: store.quote, app: store.app}), dispatch => ({dispatch}))(QuoteSelection);

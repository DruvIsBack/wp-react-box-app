import React, {Component, Fragment} from 'react';
import Tabs from 'react-responsive-tabs';
import 'react-responsive-tabs/styles.css';
import './styles.css';
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import {sendNotification} from "../../actions/Notification";
import {checkAllWalls, getClosestMinimumSizeRack, getScreenshotOfElement, dataURLtoFile} from '../QuoteRules';
import imgBox from '../../../assets/imgs/wood.jpg';
import {setGlobalData, setNewHistory, setScreenshotFile} from "../../actions/ActionApp";
import {setQuote} from '../../actions/ActionQuote';

const getOffset = (el) => {
    if(el) {
        const elComputed = window.getComputedStyle(el);

        let _x = 0;
        let _y = 0;
        while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
            _x += el.offsetLeft;
            _y += el.offsetTop - el.scrollTop;
            el = el.offsetParent;
        }

        let result = {
            left: _x,
            top: _y,
            height: parseInt((elComputed.height).replace("px", "")),
            width: parseInt((elComputed.width).replace("px", "")),
        };

        result = {...result, right: result.width + result.left, bottom: result.top + result.height};
        return result;
    }else{
        return false;
    }
};
const setLeft = (el, px, countWidth = false, countHeight = false) =>{
    let el_Offset = getOffset(el);
    let extraWidth = el_Offset.width;
    let extraHeight = el_Offset.height;

    let str = px.left;
    if(countWidth){
        str -= extraWidth;
    }
    if(countHeight){
        str -= extraHeight;
    }
    if(px){
        str += "px";
    }else{
        str += "%";
    }
    el.style.left = str;
};
const setBottom = (el, px, countWidth = false, countHeight = false) =>{
    let el_Offset = getOffset(el);
    let extraWidth = el_Offset.width;
    let extraHeight = el_Offset.height;

    let str = px.bottom;
    if(countWidth){
        str -= extraWidth;
    }
    if(countHeight){
        str -= extraHeight;
    }
    if(px){
        str += "px";
    }else{
        str += "%";
    }
    el.style.top = str;
};
const setRight = (el, px, countWidth = false, countHeight = false) =>{
    let el_Offset = getOffset(el);
    let extraWidth = el_Offset.width;
    let extraHeight = el_Offset.height;

    let str = px.right;
    if(countWidth){
        str -= extraWidth;
    }
    if(countHeight){
        str -= extraHeight;
    }
    if(px){
        str += "px";
    }else{
        str += "%";
    }
    el.style.left = str;
};
const setRightInner = (el, px, countWidth = false, countHeight = false) =>{
    let el_Offset = getOffset(el);
    let str = px.right - (el_Offset.right - el_Offset.left);
    let extraWidth = el_Offset.width;
    let extraHeight = el_Offset.height;

    if(countWidth){
        str -= extraWidth;
    }
    if(countHeight){
        str -= extraHeight;
    }
    if(px){
        str += "px";
    }else{
        str += "%";
    }
    el.style.left = str;
};
const setBottomInner = (el, px, countWidth = false, countHeight = false) =>{
    let el_Offset = getOffset(el);
    let extraWidth = el_Offset.width;
    let extraHeight = el_Offset.height;

    let str = px.bottom - (el_Offset.bottom - el_Offset.top);
    if(countWidth){
        str -= extraWidth;
    }
    if(countHeight){
        str -= extraHeight;
    }
    if(px){
        str += "px";
    }else{
        str += "%";
    }
    el.style.top = str;
};
const setTop = (el, px, countWidth = false, countHeight = false) =>{
    let el_Offset = getOffset(el);
    let extraWidth = el_Offset.width;
    let extraHeight = el_Offset.height;

    let str = px.top;
    if(countWidth){
        str -= extraWidth;
    }
    if(countHeight){
        str -= extraHeight;
    }
    if(px){
        str += "px";
    }else{
        str += "%";
    }
    el.style.top = str;
};
const setHeight = (el, px, countWidth = false, countHeight = false) =>{
    let el_Offset = getOffset(el);
    let extraWidth = el_Offset.width;
    let extraHeight = el_Offset.height;

    let str = px.height;
    if(countWidth){
        str -= extraWidth;
    }
    if(countHeight){
        str -= extraHeight;
    }
    if(px){
        str += "px";
    }else{
        str += "%";
    }
    el.style.height = str;
};
const setWidth = (el, px, countWidth = false, countHeight = false) =>{
    let el_Offset = getOffset(el);
    let extraWidth = el_Offset.width;
    let extraHeight = el_Offset.height;

    let str = px.width;
    if(countWidth){
        str -= extraWidth;
    }
    if(countHeight){
        str -= extraHeight;
    }
    if(px){
        str += "px";
    }else{
        str += "%";
    }
    el.style.width = str;
};

const box_styles = {
    //background: `url(${imgBox})`,
    backgroundSize: "cover",
    //boxShadow: "black 1px 1px 5px",
    border: "inset #804c0a thin"
};

class SelfService extends Component{

    //Page Re-directions...
        redirectToHomePage = (bool)=> {
            this.props.dispatch(sendNotification("You need to select basic requirement of the app."));
            return (bool) ? <Redirect to="/"/> : false;
        };

    //DOM Declaration...
        dom_omgArea = null;
        dom_omgContainer = null;
        dom_omgContainerPadding = null;

        dom_wall_top = null;
        dom_wall_left = null;
        dom_wall_right = null;
        dom_wall_bottom_left = null;
        dom_wall_bottom_right = null;

        dom_input_wall_a = null;
        dom_input_wall_b = null;
        dom_input_wall_c1 = null;
        dom_input_wall_c2 = null;

        dom_box1_dom = null;
        dom_box2_dom = null;

    screenHeight = false;
    screenWidth = false;

    //State declaration...
        state = {
            currentTab: 0,

            screenHeight: false,
            screenWidth: false,

            //Actual Vars...
            boxExtraZoom: 1.8,
            totalBoxes: 1,
            boxes: {
                a: false,
                b: false
            },
            isBoxDirectionLeft: true,

            wall_a: 0,
            wall_b: 0,
            wall_c1: 0,
            wall_c2: 0,

            input_wall_a: 0,
            input_wall_b: 0,
            input_wall_c1: 0,
            input_wall_c2: 0,

            containerPadding: 5,
            normalLength: 300,
            thickness: 7,

            boxAHeight: 120,
            boxAWidth: 45,
            boxALeft: 0,
            boxATop: 0,

            boxBHeight: 120,
            boxBWidth:45,
            boxBLeft: 0,
            boxBTop: 0,

            //Perceptual Vars...
            perceptualBoxAHeight: 0,
            perceptualBoxAWidth: 0,

            perceptualBoxBHeight: 0,
            perceptualBoxBWidth: 0,

            perceptualWallThickness: 0,
            perceptualContainerPadding: 0,
            perceptualMaxLength: 0,
            perceptualWallA: 0,
            perceptualWallB: 0,
            perceptualWallC1: 0,
            perceptualWallC2: 0,


            //Validation & Switches...
            do_WallRuleUpdate: false,
            do_InitializeDoms: false,
            do_DrawBoxEdges: false,
            do_PerseptualCalculation: false,
            do_SmartPlaceBoxes: false,
            do_RefreshScreenLengths: false,
            do_SetArgs: false,
            do_GetRequireBoxesAndDirection: false,
            do_redirectToContact: false,

            alreadyLoaded: false
        };

    //Extra variables...
        dragBox1 = false;
        dragBox2 = false;
        dragging = false;

        allActions = [];

    //Input Events...
        onChangeWallA = (e)=>{
            let val = e.target.value;
            this.setState({
                input_wall_a: val
            });
        };

        onChangeWallB = (e)=>{
            let val = e.target.value;
            this.setState({
                input_wall_b: val
            });
        };

        onChangeWallC1 = (e)=>{
            let val = e.target.value;
            this.setState({
                input_wall_c1: val
            });
        };

        onChangeWallC2 = (e)=>{
            let val = e.target.value;
            this.setState({
                input_wall_c2: val
            });
        };

        onBlurWallA = ()=>{
            let val = this.state.input_wall_a;

            if(val > 360){
                val = 360;
                this.props.dispatch(sendNotification("Wall-A should be less or equals 3.6m"));
            }else if(val < 90){
                val = 90;
                this.props.dispatch(sendNotification("Wall-A should be greater or equals 90cm"));
            }

            this.setState({
                wall_a: val,
                input_wall_a: val,
                do_WallRuleUpdate: true,
                do_GetRequireBoxesAndDirection: true,
                do_PerseptualCalculation: true,
                do_DrawBoxEdges: true,
                do_SmartPlaceBoxes: true,
                do_RefreshScreenLengths: true
            });
            //this.props.dispatch(setQuoteWallA(val));
            this.refreshScreenLengths(true);
        };

        onBlurWallB = ()=>{
            let val = this.state.input_wall_b;

            if(val > 360){
                val = 360;
                this.props.dispatch(sendNotification("Wall-B should be less or equals 3.6m"));
            }else if(val < 90){
                val = 90;
                this.props.dispatch(sendNotification("Wall-B should be greater or equals 90cm"));
            }

            this.setState({
                wall_b: val,
                input_wall_b: val,
                do_WallRuleUpdate: true,
                do_GetRequireBoxesAndDirection: true,
                do_PerseptualCalculation: true,
                do_DrawBoxEdges: true,
                do_SmartPlaceBoxes: true,
                do_RefreshScreenLengths: true
            });
            this.refreshScreenLengths(true);
        };

        onBlurWallC1 = ()=>{
            let val = this.state.input_wall_c1;

            if(val < 0){
                val = 0;
                this.props.dispatch(sendNotification("Wall-C1 should be greater or equals 0cm"));
            }

            this.setState({
                wall_c1: val,
                input_wall_c1: val,
                do_WallRuleUpdate: true,
                do_PerseptualCalculation: true,
                do_GetRequireBoxesAndDirection: true,
                do_DrawBoxEdges: true,
                do_SmartPlaceBoxes: true,
                do_RefreshScreenLengths: true
            });
        };

        onBlurWallC2 = () => {
            let val = this.state.input_wall_c2;

            if(val < 0){
                val = 0;
                this.props.dispatch(sendNotification("Wall-C2 should be greater or equals 0cm"));
            }

            this.setState({
                wall_c2: val,
                input_wall_c2: val,
                do_WallRuleUpdate: true,
                do_PerseptualCalculation: true,
                do_GetRequireBoxesAndDirection: true,
                do_DrawBoxEdges: true,
                do_SmartPlaceBoxes: true,
                do_RefreshScreenLengths: true
            });
        };

    //Component Hooks...
        onScreenScroll = () => {
            this.refreshScreenLengths(true);
        };

        componentDidUpdate(){
            this.consoleApp("componentDidUpdate() => ");
            this.quickSetup();
        }
        componentDidMount() {

            if(this.props.app.history[this.props.app.currentHistoryIndex] !== "/self-service") {
                this.props.dispatch(setNewHistory('/self-service'));
            }
            this.consoleApp("componentDidMount() => ");
            window.addEventListener("resize", ()=>this.refreshScreenLengths(true));
            document.querySelector('.omg-part.omg-part-1').addEventListener('scroll', this.onScreenScroll);
            this.setState({
                do_InitializeDoms: true,
                do_SetArgs: true,
                do_WallRuleUpdate: true,
                do_GetRequireBoxesAndDirection: true,
                do_PerseptualCalculation: true,
                do_DrawBoxEdges: true,
                do_SmartPlaceBoxes: true,
                do_RefreshScreenLengths: true
            });
        }
        componentWillReceiveProps(nextProps, nextContext) {
            this.consoleApp("componentWillReceiveProps()");
        }
        componentWillUnmount() {
            document.removeEventListener('mousemove', this.onMouseMove);
            document.removeEventListener('mouseup', this.onMouseUp);
            window.removeEventListener("resize", ()=>this.refreshScreenLengths(true));
            document.querySelector('.omg-part.omg-part-1').removeEventListener("scroll", this.onScreenScroll);
        }

    //Basic Functions...
        redirectToContactPage = (bool)=> {
            if(bool) {
                return <Redirect to={{pathname: '/contact', state: {redirect_back_path: '/'}}}/>;
            }else{
                return false;
            }
        };

        consoleApp = (label, data = false) => {
            if(data !== false ){
                console.log("APP: " + label + " => ", data);
            }else{
                console.log("APP: "+label);
            }
        };
        consoleTest = (label, data = false) => {
            if(data !== false ){
                console.log("TEST: "+label+" => ",data);
            }else{
                console.log("TEST: "+label);
            }
        };

        //Limitation Functions start...
            checkPerceptualWallThickness = (thickness)=>{
                if(thickness > 45){
                    thickness = 45;
                }
                return thickness;
            };
            checkPerceptualPadding = (padding)=>{
                if(padding > 15){
                    padding = 15;
                }
                return padding;
            };
        //Limitation Functions end...


        quickSetup = () => {
                if(this.state.do_RefreshScreenLengths) {
                    this.setState({
                        do_RefreshScreenLengths: false,
                        ...this.refreshScreenLengths(false)
                    });
                }
                else if(this.state.do_InitializeDoms){
                    this.setState({
                        do_InitializeDoms: false,
                        ...this.initializeDoms()
                    });
                }
                else if(this.state.do_SetArgs){
                    this.setState({
                        do_SetArgs: false,
                        ...this.setArgs()
                    });
                }
                else if(this.state.do_WallRuleUpdate){
                    const rules = this.wallsRulesCheck();
                    this.setState({
                        do_WallRuleUpdate: false,
                        ...rules
                    });
                    if(this.allActions.length) {
                        this.allActions.map((action, index) => {
                            return this.props.dispatch({...action});
                        });
                        this.allActions = [];
                    }
                }
                else if(this.state.do_GetRequireBoxesAndDirection){
                    this.setState({
                        do_GetRequireBoxesAndDirection: false,
                        ...this.getRequireBoxesAndDirection()
                    });
                }
                else if(this.state.do_PerseptualCalculation){
                    this.setState({
                        do_PerseptualCalculation: false,
                        ...this.perspectiveCalculation()
                    });
                }
                else if(this.state.do_DrawBoxEdges) {
                    this.setState({
                        do_DrawBoxEdges: false,
                        ...this.drawBoxEdges()
                    });
                }
                else if(this.state.do_SmartPlaceBoxes) {
                    this.setState({
                        do_SmartPlaceBoxes: false,
                        ...this.smartPlaceBoxes()
                    });
                }
        };

        initializeDoms = () =>{
            let changeState = {};

            this.dom_omgArea = document.querySelector('.omg-area');
            this.dom_omgContainer = this.dom_omgArea.querySelector('.omg-container');
            if(this.dom_omgContainer){
                this.dom_wall_top = this.dom_omgContainer.querySelector(".wall.wall-top");
                this.dom_wall_left = this.dom_omgContainer.querySelector(".wall.wall-left");
                this.dom_wall_right = this.dom_omgContainer.querySelector(".wall.wall-right");
                this.dom_wall_bottom_left = this.dom_omgContainer.querySelector(".wall.wall-bottom-left");
                this.dom_wall_bottom_right = this.dom_omgContainer.querySelector(".wall.wall-bottom-right");
                this.dom_box_doms = this.dom_omgContainer.querySelectorAll('.box');
                this.dom_box1_dom = this.dom_omgContainer.querySelector('.box.box-a');
                this.dom_box2_dom = this.dom_omgContainer.querySelector('.box.box-b');

                this.dom_input_wall_a = this.dom_omgArea.querySelector("input#lengthOfWallA");
                this.dom_input_wall_b = this.dom_omgArea.querySelector("input#lengthOfWallB");
                this.dom_input_wall_c1 = this.dom_omgArea.querySelector("input#lengthOfWallC1");
                this.dom_input_wall_c2 = this.dom_omgArea.querySelector("input#lengthOfWallC2");

                this.dom_omgContainerPadding = this.dom_omgContainer.querySelector('.container-padding');

                let isValid = (this.dom_wall_top && this.dom_wall_left && this.dom_wall_right && this.dom_wall_bottom_left
                    && this.dom_wall_bottom_right
                    /*&& this.dom_input_wall_a && this.dom_input_wall_b && this.dom_input_wall_c1 && this.dom_input_wall_c2*/
                     /*&& this.dom_box1_dom && this.dom_box2_dom*/
                    && this.dom_omgContainerPadding
                );
                if(isValid) {
                    document.addEventListener('mousemove', this.onMouseMove);
                    document.addEventListener('mouseup', this.onMouseUp);
                    changeState["alreadyLoaded"] = true;
                }else{
                    this.props.dispatch(sendNotification("Something is missing, some UI Elements not found..."));
                }
            }else{
                this.props.dispatch(sendNotification("Container not found!"));
            }

            return changeState;
        };
        setArgs = () => {
            let changeState = {};

            let wall_a = this.props.quote.wall_a;
            let wall_b = this.props.quote.wall_b;
            let wall_c1 = this.props.quote.wall_c1;
            let wall_c2 = this.props.quote.wall_c2;

            changeState = {
              wall_a, wall_b, wall_c1, wall_c2,
                input_wall_a: wall_a,
                input_wall_b: wall_b,
                input_wall_c1: wall_c1,
                input_wall_c2: wall_c2
            };

            return changeState;
        };
        wallsRulesCheck = ()=> {
            let changeState = {};

            let wall_a = this.state.wall_a;
            let wall_b = this.state.wall_b;
            let wall_c1 = this.state.wall_c1;
            let wall_c2 = this.state.wall_c2;

            let responseRules = checkAllWalls(this.props.boxes, wall_a, wall_b, wall_c1, wall_c2, this.state.containerPadding);
            if (responseRules.haveActions) {
                this.allActions = responseRules.actions;
            }

            if (responseRules.success) {
                let totalRacks = 0;
                if(responseRules.data.haveSingleRack){
                    totalRacks = 1;
                }else if(responseRules.data.haveDoubleRack){
                    totalRacks = 2;
                }


                wall_a = responseRules.data.a;
                wall_b = responseRules.data.b;
                wall_c1 = responseRules.data.c1;
                wall_c2 = responseRules.data.c2;
                this.setState({
                    totalBoxes: totalRacks,
                    input_wall_a: wall_a,
                    input_wall_b: wall_b,
                    input_wall_c1: wall_c1,
                    input_wall_c2: wall_c2,
                    wall_a, wall_b, wall_c1, wall_c2,
                });
                this.refreshScreenLengths(true);
            } else {
                this.redirectToContactPage(true);
            }

            return changeState;
        };
        perspectiveCalculation = () =>{
            let changeState = {};
            let ratio_WallA_WallB = this.state.wall_a / this.state.wall_b;
            let ratio_screen_height_width = this.state.screenHeight/this.state.screenWidth;
            //let boxZoomFactor;
            if(ratio_WallA_WallB >= 1) {
                //WallA is larger than WallB
                if(ratio_screen_height_width > 1){
                    //Where screen height is larger than width...
                    changeState["perceptualMaxLength"] = this.screenWidth/2;
                    changeState["perceptualWallA"] = changeState["perceptualMaxLength"];
                    changeState["perceptualWallB"] = changeState["perceptualMaxLength"] / ratio_WallA_WallB;
                }else{
                    //Where screen width is larger than height...
                    changeState["perceptualMaxLength"] = this.screenHeight/2;
                    changeState["perceptualWallA"] = changeState["perceptualMaxLength"];
                    changeState["perceptualWallB"] = changeState["perceptualMaxLength"] / ratio_WallA_WallB;
                }
                let actualThickness = ((this.state.normalLength / this.state.wall_a) * this.state.thickness);
                changeState["perceptualWallThickness"] = changeState["perceptualWallA"] * (actualThickness/this.state.wall_a);
                changeState["perceptualWallThickness"] = this.checkPerceptualWallThickness(changeState["perceptualWallThickness"]);
                let actualPadding = ((this.state.normalLength / this.state.wall_a) * this.state.containerPadding);
                changeState["perceptualContainerPadding"] = changeState["perceptualWallA"] * (actualPadding / this.state.wall_a);
                changeState["perceptualContainerPadding"] = this.checkPerceptualPadding(changeState["perceptualContainerPadding"]);

            }else{
                //WallB is larger than WallA

                if(ratio_screen_height_width > 1){
                    //Where screen height is larger than width...
                    changeState["perceptualMaxLength"]  = this.screenWidth/2;
                    changeState["perceptualWallB"] = changeState["perceptualMaxLength"];
                    changeState["perceptualWallA"] = changeState["perceptualMaxLength"] * ratio_WallA_WallB;
                }else{
                    //Where screen width is larger than height...
                    changeState["perceptualMaxLength"] = this.screenHeight/2;
                    changeState["perceptualWallB"] = changeState["perceptualMaxLength"];
                    changeState["perceptualWallA"] = changeState["perceptualMaxLength"] * ratio_WallA_WallB;
                }
                let actualThickness = ((this.state.normalLength / this.state.wall_b) * this.state.thickness);
                changeState["perceptualWallThickness"] = changeState["perceptualWallB"] * (actualThickness/this.state.wall_b);
                changeState["perceptualWallThickness"] = this.checkPerceptualWallThickness(changeState["perceptualWallThickness"]);
                let actualPadding = ((this.state.normalLength / this.state.wall_b) * this.state.containerPadding);
                changeState["perceptualContainerPadding"] = changeState["perceptualWallB"] * (actualPadding/this.state.wall_b);
                changeState["perceptualContainerPadding"] = this.checkPerceptualPadding(changeState["perceptualContainerPadding"]);
                //zoom = changeState["perceptualWallB"] / this.state.wall_b;
                //boxZoomFactor = this.state.wall_b / changeState["perceptualWallB"];
                //zoom = (this.state.normalLength / this.state.wall_b);
            }


            //TODO : box height








            //Box A - Height & Width...
            changeState["perceptualWallC1"] = changeState["perceptualWallA"] * (this.state.wall_c1/this.state.wall_a);
            changeState["perceptualWallC2"] = changeState["perceptualWallA"] * (this.state.wall_c2/this.state.wall_a);
            return changeState;
        };
        getRequireBoxesAndDirection = () => {
            let boxA = false;
            let boxB = false;
            let boxDirectionLeft = this.state.wall_c1 >= this.state.wall_c2;
            if (this.state.totalBoxes === 2) {
                let searchMaxHeight;
                let searchMaxWidth;
                    //For Box b - (vertically - height)
                      searchMaxHeight = this.state.wall_b - (this.state.containerPadding * 2);
                      searchMaxWidth = this.state.wall_a - (this.state.containerPadding * 2);
                      let rack = getClosestMinimumSizeRack(this.props.boxes, searchMaxWidth, searchMaxHeight);
                      if(rack){
                          boxB = rack;

                          //For Box a - (horizontally - width)
                          searchMaxHeight = this.state.wall_a - (this.state.containerPadding * 2) - boxB.width;
                          searchMaxWidth = this.state.wall_b - (this.state.containerPadding * 2);

                          rack = getClosestMinimumSizeRack(this.props.boxes, searchMaxWidth, searchMaxHeight);
                          if(rack){
                              boxA = rack;
                          }
                      }
            }else if(this.state.totalBoxes === 1){
                let searchMaxHeight;
                let searchMaxWidth;
                //For Box b - (vertically - height)
                searchMaxHeight = this.state.wall_b - (this.state.containerPadding * 2);
                searchMaxWidth = this.state.wall_a - (this.state.containerPadding * 2);

                let rack = getClosestMinimumSizeRack(this.props.boxes, searchMaxWidth, searchMaxHeight);
                if(rack){
                    boxA = rack;
                }
            }

            return {
                boxes: {
                    a: boxA,
                    b: boxB
                },
                isBoxDirectionLeft: boxDirectionLeft
            };
        };
        drawBoxEdges = () =>{
            let changeState = {};
            setHeight(this.dom_omgContainer, {height: this.state.perceptualWallB - this.state.perceptualWallThickness});
            setWidth(this.dom_omgContainer, {width: this.state.perceptualWallA - this.state.perceptualWallThickness});

            let containerOffset = getOffset(this.dom_omgContainer);

            //For right & left wall only...
            let elOffset = getOffset(this.dom_wall_right);
            let wall_fixed_height = containerOffset.height + (this.state.perceptualWallThickness * 2) - 0.5;

            //Left Wall...
            setWidth(this.dom_wall_left, {width: this.state.perceptualWallThickness});
            setLeft(this.dom_wall_left,containerOffset,true);
            setTop(this.dom_wall_left,containerOffset, true);
            setHeight(this.dom_wall_left, {height: wall_fixed_height});

            //Right Wall...
            setWidth(this.dom_wall_right, {width: this.state.perceptualWallThickness});
            setRight(this.dom_wall_right,{right:containerOffset.right + 1});
            setTop(this.dom_wall_right, containerOffset, true);
            setHeight(this.dom_wall_right, {height: wall_fixed_height});

            //Top Wall...
            setHeight(this.dom_wall_top, {height: this.state.perceptualWallThickness});
            setLeft(this.dom_wall_top,containerOffset);
            setTop(this.dom_wall_top, containerOffset, false, true);
            setWidth(this.dom_wall_top, {width: containerOffset.width + 1});

            //Bottom Left Wall...
            setHeight(this.dom_wall_bottom_left, {height: this.state.perceptualWallThickness});
            setLeft(this.dom_wall_bottom_left,containerOffset);
            setBottom(this.dom_wall_bottom_left, containerOffset, false, false);
            setWidth(this.dom_wall_bottom_left, { width: this.state.perceptualWallC1 });

            //Bottom Right Wall...
            setHeight(this.dom_wall_bottom_right, {height: this.state.perceptualWallThickness});
            setBottom(this.dom_wall_bottom_right, containerOffset);
            setWidth(this.dom_wall_bottom_right, { width: this.state.perceptualWallC2});
            setRightInner(this.dom_wall_bottom_right, {right: containerOffset.right + 1 });


            //Set Input of WALL A
            let offsetWallTop = getOffset(this.dom_wall_top);
            setTop(this.dom_input_wall_a, {top: offsetWallTop.top-5}, false, true);

            //Set Input of WALL B
            let offsetWallLeft = getOffset(this.dom_wall_left);
            setLeft(this.dom_input_wall_b, {left: offsetWallLeft.left}, true, false);

            //Set Input of WALL C1
            let offsetWallBottomLeft = getOffset(this.dom_wall_bottom_left);
            let offsetWallBottomRight = getOffset(this.dom_wall_bottom_right);
            let offsetWallRight = getOffset(this.dom_wall_right);

            setBottom(this.dom_input_wall_c1, {bottom: offsetWallBottomLeft.bottom+50}, false, true);
            setLeft(this.dom_input_wall_c1, {left: offsetWallBottomLeft.left}, false, true);

            //Set Input of WALL C2
            setBottom(this.dom_input_wall_c2, {bottom: offsetWallBottomLeft.bottom+50}, false, true);
            setRight(this.dom_input_wall_c2, {right: offsetWallRight.left}, false, true);

            return changeState;
        };
        smartPlaceBoxes = ()=>{
            let changeState = {};

            let containerCurrentOffset = getOffset(this.dom_omgContainerPadding);
            let containerActualOffset = {
                width: this.state.wall_a - (this.state.containerPadding * 2),
                height: this.state.wall_b - (this.state.containerPadding * 2)
            };

            if(this.state.totalBoxes === 2){
                changeState["perceptualBoxAHeight"] = (containerCurrentOffset.height / containerActualOffset.height) * this.state.boxes.a.width - 2;
                changeState["perceptualBoxAWidth"] = (containerCurrentOffset.width / containerActualOffset.width) * this.state.boxes.a.height  - 2;

                changeState["perceptualBoxBHeight"] = (containerCurrentOffset.height / containerActualOffset.height) * this.state.boxes.b.height - 2;
                changeState["perceptualBoxBWidth"] = (containerCurrentOffset.width / containerActualOffset.width) * this.state.boxes.b.width - 2;
            }else if (this.state.totalBoxes === 1) {
                changeState["perceptualBoxAHeight"] = (containerCurrentOffset.height / containerActualOffset.height) * this.state.boxes.a.height - 2;
                changeState["perceptualBoxAWidth"] = (containerCurrentOffset.width / containerActualOffset.width) * this.state.boxes.a.width - 2;
            }


            if(this.state.totalBoxes === 2) {
                this.dom_box1_dom = this.dom_omgContainer.querySelector('.box.box-a');
                this.dom_box2_dom = this.dom_omgContainer.querySelector('.box.box-b');

                let containerOffset = getOffset(this.dom_omgContainerPadding);
                let box1_offset = getOffset(this.dom_box1_dom);
                let box2_offset = getOffset(this.dom_box2_dom);


                    if(this.state.isBoxDirectionLeft){
                        box2_offset.left = containerOffset.left + 1;
                        box2_offset.top = containerOffset.top  + 1;

                        box1_offset.left = containerOffset.left + changeState["perceptualBoxBWidth"] + 1;
                        box1_offset.top = containerOffset.top  + 1;
                    }else{
                        box2_offset.right = containerOffset.right - 1;
                        box2_offset.width = changeState["perceptualBoxBWidth"];
                        box2_offset.left = box2_offset.right - box2_offset.width;
                        box2_offset.top = containerOffset.top + 1;

                        box1_offset.width = changeState["perceptualBoxAWidth"];
                        box1_offset.right = box2_offset.right;
                        box1_offset.left = containerOffset.right - 1 - box2_offset.width - box1_offset.width;
                        box1_offset.top = containerOffset.top + 1;
                        //box1_offset.bottom = box1_offset.top + box1_offset.height;
                    }

                setLeft(this.dom_box1_dom, box1_offset);
                setTop(this.dom_box1_dom, box1_offset);

                setLeft(this.dom_box2_dom, box2_offset);
                setTop(this.dom_box2_dom, box2_offset);
            }else{
                this.dom_box1_dom = this.dom_omgContainer.querySelector('.box.box-a');
                this.dom_box2_dom = this.dom_omgContainer.querySelector('.box.box-b');

                let containerOffset = getOffset(this.dom_omgContainerPadding);
                let box1_offset = getOffset(this.dom_box1_dom);

                box1_offset.left = containerOffset.left + 1;
                box1_offset.top = containerOffset.top + 1;
                box1_offset.right = box1_offset.left + this.perceptiveBoxAWidth;
                box1_offset.bottom = containerOffset.bottom + this.perceptiveBoxAHeight;

                setLeft(this.dom_box1_dom, box1_offset);
                setTop(this.dom_box1_dom, box1_offset);
            }
            return changeState;
        };

        onChangeWallACalculateC1AndC2 = (wall_a) =>{
            let available_space_for_c1_and_c2 = wall_a - 90;

            if(
                this.state.wall_c1 < 0 ||
                this.state.wall_c2 < 0 ||
                this.state.wall_c1 + this.state.wall_c2 > available_space_for_c1_and_c2
            ){
                let wall_c1 = available_space_for_c1_and_c2;
                let wall_c2 = 0;
                this.setState({
                    wall_c1,
                    input_wall_c1: wall_c1,
                    wall_c2,
                    input_wall_c2: wall_c2
                });
                this.perspectiveCalculation();
            }
        };
        onChangeWallC1CalculateC1AndC2 = (int_WallC1) =>{
            let int_WallC2 = parseInt(this.state.wall_c2);
            let int_WallA = parseInt(this.state.wall_a);
            let available_space_for_c1_and_c2 = int_WallA - 90;
            if(
                int_WallC1 < 0 ||
                int_WallC2 < 0 ||
                int_WallC1 + int_WallC2 > available_space_for_c1_and_c2
            ){
                int_WallC1 = available_space_for_c1_and_c2;
                int_WallC2 = 0;
                this.setState({
                    int_WallC1,
                    input_wall_c1: int_WallC1,
                    int_WallC2,
                    input_wall_c2: int_WallC2
                });
                //this.perspectiveCalculation();
            }
        };
        onChangeWallsCalculateC1AndC2 = () =>{
            let int_WallC1 = parseInt(this.state.wall_c1);
            let int_WallC2 = parseInt(this.state.wall_c2);
            let int_WallA = parseInt(this.state.wall_a);
            let available_space_for_c1_and_c2 = int_WallA - 90;
            if(
                int_WallC1 < 0 ||
                int_WallC2 < 0 ||
                int_WallC1 + int_WallC2 > available_space_for_c1_and_c2
            ){

                int_WallC1 = available_space_for_c1_and_c2;
                int_WallC2 = 0;
                this.setState({
                    int_WallC1,
                    input_wall_c1: int_WallC1,
                    int_WallC2,
                    input_wall_c2: int_WallC2
                });
                this.perspectiveCalculation();
            }
        };
        refreshScreenLengths = (updateState = false)=>{
            let changeState = {};

            let screenHeight = window.innerHeight;
            let screenWidth = window.innerWidth;

            this.screenHeight = screenHeight;
            this.screenWidth = screenWidth;

            changeState = {
                screenHeight,
                screenWidth
            };

            if(updateState === true){
                this.setState({...changeState, ...{
                    do_WallRuleUpdate: true,
                    do_DrawBoxEdges: true,
                    do_PerseptualCalculation: true,
                    do_SmartPlaceBoxes: true,
                }});
            }else {
                return changeState;
            }
        };

        onSubmitEntry = (e)=>{
            e.preventDefault(true);
            let containerOffset = getOffset(this.dom_omgContainer);
            getScreenshotOfElement(this.dom_omgContainer,0, 0, containerOffset.width, containerOffset.height, (log)=>{}).then(canvas => {
                let doc = document.querySelector('.container-fluid.omg-part.omg-part-2');
                doc.appendChild(canvas);
                let screenshot = dataURLtoFile(canvas.toDataURL(), 'screenshot');
                this.props.dispatch(setScreenshotFile(canvas.toDataURL()));

                let dom_box1_dom = this.dom_omgContainer.querySelector('.box.box-a');
                let dom_box2_dom = this.dom_omgContainer.querySelector('.box.box-b');
                let box1_offset = getOffset(dom_box1_dom);
                let box2_offset = getOffset(dom_box2_dom);
                this.props.dispatch(setGlobalData({...this.state, box1_offset: box1_offset, box2_offset: box2_offset}));
                this.props.dispatch(setQuote(this.state.wall_a, this.state.wall_b, this.state.wall_c1, this.state.wall_c2));
                this.setState({do_redirectToContact: true});
            });
        };
    //Move Functions...
        // calculate relative position to the mouse and set dragging=true
        onMouseDown_Box1 = (e) => {
            this.dom_box1_dom = this.dom_omgContainer.querySelector('.box.box-a');
            let cursorPosition = {x: e.pageX, y: e.pageY};
            if (e.button !== 0) return;
            let pos = getOffset(e.target);
            this.dragging = true;
            this.dragBox1 = true;
            this.dragBox2 = false;

            this.relativeDistance = {
                x: cursorPosition.x - pos.left,
                y: cursorPosition.y - pos.top
            };
            e.stopPropagation();
            e.preventDefault();
        };
        onMouseDown_Box2 = (e) => {
            this.dom_box2_dom = this.dom_omgContainer.querySelector('.box.box-b');
            let cursorPosition = {x: e.pageX, y: e.pageY};
            if (e.button !== 0) return;
            let pos = getOffset(e.target);
            this.dragging = true;
            this.dragBox1 = false;
            this.dragBox2 = true;

            this.relativeDistance = {
                x: cursorPosition.x - pos.left,
                y: cursorPosition.y - pos.top
            };
            e.stopPropagation();
            e.preventDefault();
        };
        haveBoxCollision = (box_type, currentCursorPosition) => {
            let have_collision = false;

            let container_offset = getOffset(this.dom_omgContainerPadding);


            let bottom_below_top;
            let bottom_below_bottom;
            let top_above_top;
            let top_above_bottom;
            let left_lefted_left;
            let left_righted_left;
            let left_lefted_right;
            let right_righted_right;
            let right_lefted_right;
            let right_righted_left;

            switch(box_type) {
                case 1:
                    let box1_future_offset = getOffset(this.dom_box1_dom);
                    let box2_current_offset = getOffset(this.dom_box2_dom);

                    box1_future_offset.left = currentCursorPosition.x - this.relativeDistance.x;
                    box1_future_offset.top = currentCursorPosition.y - this.relativeDistance.y;
                    box1_future_offset.bottom = box1_future_offset.top + box1_future_offset.height;
                    box1_future_offset.right = box1_future_offset.left + box1_future_offset.width;

                    if(box2_current_offset) {
                        bottom_below_top = (box1_future_offset.bottom >= box2_current_offset.top);      //
                        bottom_below_bottom = (box1_future_offset.bottom >= box2_current_offset.bottom);    //
                        top_above_top = (box1_future_offset.top <= box2_current_offset.top);    //
                        top_above_bottom = (box1_future_offset.top < box2_current_offset.bottom);  //
                        left_lefted_left = (box1_future_offset.left <= box2_current_offset.left);   //
                        left_righted_left = (box1_future_offset.left >= box2_current_offset.left);   //
                        left_lefted_right = (box1_future_offset.left <= box2_current_offset.right);     //
                        right_righted_right = (box1_future_offset.right >= box2_current_offset.right);  //
                        right_lefted_right = (box1_future_offset.right <= box2_current_offset.right);  //
                        right_righted_left = (box1_future_offset.right >= box2_current_offset.left);    //

                        if (bottom_below_top && top_above_bottom) {
                            if (left_lefted_left && right_righted_left) {
                                have_collision = true;
                            }
                            if (left_righted_left && right_lefted_right) {
                                have_collision = true;
                            }
                            if (right_righted_right && left_lefted_right) {
                                have_collision = true;
                            }
                        } else if (right_righted_left && left_lefted_right) {
                            if (top_above_top && bottom_below_top) {
                                have_collision = true;
                            }
                            if (bottom_below_bottom && top_above_bottom) {
                                have_collision = true;
                            }
                        }
                    }

                    if(
                        box1_future_offset.left < container_offset.left
                        ||
                        box1_future_offset.top < container_offset.top
                        ||
                        box1_future_offset.right > container_offset.right
                        ||
                        box1_future_offset.bottom > container_offset.bottom
                    ){
                        have_collision = true;
                    }

                    break;
                case 2:
                    let box2_future_offset = getOffset(this.dom_box2_dom);
                    let box1_current_offset = getOffset(this.dom_box1_dom);

                    box2_future_offset.left = currentCursorPosition.x - this.relativeDistance.x;
                    box2_future_offset.top = currentCursorPosition.y - this.relativeDistance.y;
                    box2_future_offset.bottom = box2_future_offset.top + box2_future_offset.height;
                    box2_future_offset.right = box2_future_offset.left + box2_future_offset.width;

                    bottom_below_top = (box2_future_offset.bottom >= box1_current_offset.top);      //
                    bottom_below_bottom = (box2_future_offset.bottom >= box1_current_offset.bottom);    //
                    top_above_top = (box2_future_offset.top <= box1_current_offset.top);    //
                    top_above_bottom = (box2_future_offset.top <= box1_current_offset.bottom);  //
                    left_lefted_left = (box2_future_offset.left <= box1_current_offset.left);   //
                    left_righted_left = (box2_future_offset.left >= box1_current_offset.left);
                    left_lefted_right = (box2_future_offset.left <= box1_current_offset.right);     //
                    right_righted_right = (box2_future_offset.right >= box1_current_offset.right);  //
                    right_lefted_right = (box2_future_offset.right <= box1_current_offset.right);
                    right_righted_left = (box2_future_offset.right >= box1_current_offset.left);    //


                    if (bottom_below_top && top_above_bottom) {
                        if (left_lefted_left && right_righted_left) {
                            have_collision = true;
                        }
                        if (left_righted_left && right_lefted_right) {
                            have_collision = true;
                        }
                        if (right_righted_right && left_lefted_right) {
                            have_collision = true;
                        }
                    }else if (right_righted_left && left_lefted_right) {
                        if (top_above_top && bottom_below_top) {
                            have_collision = true;
                        }
                        if (bottom_below_bottom && top_above_bottom) {
                            have_collision = true;
                        }
                    }

                    if(
                        box2_future_offset.left < container_offset.left
                        ||
                        box2_future_offset.top < container_offset.top
                        ||
                        box2_future_offset.right > container_offset.right
                        ||
                        box2_future_offset.bottom > container_offset.bottom
                    ){
                        have_collision = true;
                    }
                    break;
            }
            return have_collision;
        };

        onDragBox2 = (cursorPosition) => {
            if(!this.haveBoxCollision(2, cursorPosition)) {
                setLeft(this.dom_box2_dom, {left: cursorPosition.x - this.relativeDistance.x});
                setTop(this.dom_box2_dom, {top: cursorPosition.y - this.relativeDistance.y});
            }
        };

        onDragBox1 = (cursorPosition) => {
            if(!this.haveBoxCollision(1, cursorPosition)){
                setLeft(this.dom_box1_dom, {left: cursorPosition.x - this.relativeDistance.x});
                setTop(this.dom_box1_dom, {top: cursorPosition.y - this.relativeDistance.y});
            }
        };

        onMouseUp = (e) => {
            if(this.dragging){
                let box_pos_data = {
                    box1_offset: this.state.box1_offset,
                    box2_offset: this.state.box2_offset
                };

                if(this.dragBox1){
                    let box1_offset = getOffset(this.dom_box1_dom);
                    box_pos_data.box1_offset = box1_offset;
                }

                if(this.dragBox2){
                    let box2_offset = getOffset(this.dom_box2_dom);
                    box_pos_data.box2_offset = box2_offset;
                }

                this.dragging = false;
                this.dragBox1 = false;
                this.dragBox2 = false;
            }

            this.relativeDistance = {
                x: 0,
                y: 0
            };
            e.stopPropagation();
            e.preventDefault();
        };

        relativeDistance = {
            x: 0,
            y: 0
        };

        onMouseMove = (e) => {
            let cursorPosition = {x: e.pageX, y: e.pageY};
            if (!this.dragging) return;

            //let container_offset = getOffset(this.dom_omgContainer);

            if(this.dragBox1){
                this.onDragBox1(cursorPosition);
            }else if(this.dragBox2){
                this.onDragBox2(cursorPosition);
            }
            e.stopPropagation();
            e.preventDefault();
        };

        getRenderBoxes = () => {
            if(this.state.totalBoxes === 2) {
                return (
                    <Fragment>
                        <div style={{
                            height: this.state.perceptualBoxAHeight,
                            width: this.state.perceptualBoxAWidth,
                            left: this.state.boxALeft,
                            top: this.state.boxATop, ...box_styles
                        }} onMouseDown={this.onMouseDown_Box1} className="box box-a">
                            Box A
                        </div>
                        <div style={{
                            height: this.state.perceptualBoxBHeight,
                            width: this.state.perceptualBoxBWidth,
                            left: this.state.boxBLeft,
                            top: this.state.boxBTop, ...box_styles
                        }} onMouseDown={this.onMouseDown_Box2} className="box box-b">
                            Box B
                        </div>
                    </Fragment>
                );
            }else if(this.state.totalBoxes === 1){
                return (
                    <Fragment>
                        <div style={{
                            height: this.state.perceptualBoxAHeight,
                            width: this.state.perceptualBoxAWidth,
                            left: this.state.boxALeft,
                            top: this.state.boxATop, ...box_styles
                        }} onMouseDown={this.onMouseDown_Box1} className="box box-a">
                            Box A
                        </div>
                    </Fragment>
                );
            }else{
                return false;
            }
        };

        getRenderData = () => {
                return (
                    <Fragment>
                        <div className="container-fluid omg-parts">
                            <div className="container-fluid omg-part omg-part-1">
                                <div className="omg-area">
                                    <input type="number" onChange={this.onChangeWallA} onBlur={this.onBlurWallA} min="90" max="360" className="form-control" id="lengthOfWallA" placeholder="Length of wall A" value={this.state.input_wall_a}/>
                                    <input type="number" onChange={this.onChangeWallB} onBlur={this.onBlurWallB} min="90" max="360" className="form-control" id="lengthOfWallB" placeholder="Length of wall B" value={this.state.input_wall_b}/>
                                    <input type="number" onChange={this.onChangeWallC1} onBlur={this.onBlurWallC1} min="0" className="form-control" id="lengthOfWallC1" placeholder="Length of C1" value={this.state.input_wall_c1}/>
                                    <input type="number" onChange={this.onChangeWallC2} onBlur={this.onBlurWallC2} min="0" className="form-control" id="lengthOfWallC2" placeholder="Length of C2" value={this.state.input_wall_c2}/>
                                    <div className='omg-container' style={{padding: this.state.perceptualContainerPadding}}>
                                        <div className='container-padding'>
                                            {this.getRenderBoxes()}
                                            <div className='wall wall-top'/>
                                            <div className='wall wall-left'/>
                                            <div className='wall wall-right'/>
                                            <div className='wall wall-bottom-right'/>
                                            <div className='wall wall-bottom-left'/>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={this.onSubmitEntry} className="btn btn-primary">Submit Entry</button>
                            </div>
                            <div className="container-fluid omg-part omg-part-2" style={{alignItems: "unset"}}>
                                <Tabs showInkBar={true} onChange={this.onChangeTab} selectedTabKey={this.state.currentTab} items={this.getTabs()} />
                            </div>
                        </div>
                    </Fragment>
                );
        };

        onChangeTab = (index) => {
            this.setState({currentTab: index});
        };

        getMesurementInfo = ()=>(
            <Fragment>
                <div className="table-responsive">
                    <table className="table table-striped table-dark">
                        <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Component</th>
                            <th scope="col">Length</th>
                            <th scope="col">Depth</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th scope="row">01.</th>
                            <td>Wall-A</td>
                            <td>{this.state.wall_a} cms</td>
                            <td>--</td>
                        </tr>
                        <tr>
                            <th scope="row">02.</th>
                            <td>Wall-B</td>
                            <td>{this.state.wall_b} cms</td>
                            <td>--</td>
                        </tr>
                        <tr>
                            <th scope="row">03.</th>
                            <td>Wall-C1</td>
                            <td>{this.state.wall_c1} cms</td>
                            <td>--</td>
                        </tr>
                        <tr>
                            <th scope="row">04.</th>
                            <td>Wall-C2</td>
                            <td>{this.state.wall_c2} cms</td>
                            <td>--</td>
                        </tr>
                        <tr>
                            <th scope="row">05.</th>
                            <td>Inner Padding (Fixed)</td>
                            <td>--</td>
                            <td>{this.state.containerPadding} cms</td>
                        </tr>
                        <tr>
                            <th scope="row">06.</th>
                            <td>Wall Thickness (Fixed)</td>
                            <td>--</td>
                            <td>{this.state.thickness} cms</td>
                        </tr>
                        <tr>
                            <th scope="row">07.</th>
                            <td>Box-A</td>
                            <td>{this.state.boxes.a.height} cms</td>
                            <td>{this.state.boxes.a.width} cms</td>
                        </tr>
                        {(this.state.totalBoxes === 2)?
                            <tr>
                                <th scope="row">08.</th>
                                <td>Box-B</td>
                                <td>{this.state.boxes.b.height} cms</td>
                                <td>{this.state.boxes.b.width} cms</td>
                            </tr>
                        :false}
                        </tbody>
                    </table>
                </div>
            </Fragment>
        );

        getAvailableBoxByIndex = (index)=>{
            return this.props.boxes[index];
        };

        changeBoxASize = (event) => {
            let el = event.target;
            let val = el.options[el.selectedIndex].value;
            let selectedBox = this.getAvailableBoxByIndex(val);
            this.changeBoxSize('a', selectedBox);
        };

        changeBoxBSize = (event) => {
            let el = event.target;
            let val = el.options[el.selectedIndex].value;
            let selectedBox = this.getAvailableBoxByIndex(val);
            this.changeBoxSize('b', selectedBox);
        };

        changeBoxSize = (box_label,selectedBox)=>{
            let stateBoxes = {...this.state.boxes};
            let refine_box_data = {height: selectedBox.length, width: selectedBox.depth};
            let final_data = {
                boxes: stateBoxes,
                do_WallRuleUpdate: true,
                do_DrawBoxEdges: true,
                do_PerseptualCalculation: true,
                do_SmartPlaceBoxes: true,
            };
            switch(box_label){
                case "a":
                    stateBoxes.a = refine_box_data;
                    break;
                case "b":
                    stateBoxes.b = refine_box_data;
                    break;
            }
            final_data.boxes = stateBoxes;
            this.setState(final_data);
        };


    //Box A control events...
        onClick_increaseBoxA_width = ()=>{
            let available_boxes = this.props.boxes;
            let current_box = this.state.boxes.a;
            this.consoleTest('Box-A increase width...');

            let nextAvailableBox = false;
            available_boxes.map(box=>{
                if(box.enable && box.depth > current_box.width && !nextAvailableBox){
                    nextAvailableBox = box;
                }
                return false;
            });

            if(nextAvailableBox){
                this.changeBoxSize('a',nextAvailableBox);
            }else{
                this.props.dispatch(sendNotification("The depth more than "+current_box.width+"cm is not available for Box-A.",-1));
            }
        };

        onClick_increaseBoxA_height = ()=>{
            let available_boxes = this.props.boxes;
            let current_box = this.state.boxes.a;
            this.consoleTest('Box-A increase height...');
            let nextAvailableBox = false;
            available_boxes.map(box=>{
                if(box.enable && box.length > current_box.height && !nextAvailableBox){
                    nextAvailableBox = box;
                }
                return false;
            });

            if(nextAvailableBox){
                this.changeBoxSize('a',nextAvailableBox);
            }else{
                this.props.dispatch(sendNotification("The height more than "+current_box.height+"cm is not available for Box-A.",-1));
            }
        };

        onClick_decreaseBoxA_width = ()=>{
            this.consoleTest('Box-A decrease width...');
            let available_boxes = this.props.boxes;
            let current_box = this.state.boxes.a;

            let nextAvailableBox = false;
            for(let i = available_boxes.length - 1; 0 <= i; i--){
                let box = available_boxes[i];
                if(box.enable && box.depth < current_box.width && !nextAvailableBox){
                    nextAvailableBox = box;
                }
            }

            if(nextAvailableBox){
                this.changeBoxSize('a',nextAvailableBox);
            }else{
                this.props.dispatch(sendNotification("The depth less than "+current_box.width+"cm is not available for Box-A.",-1));
            }
        };

        onClick_decreaseBoxA_height = ()=>{
            this.consoleTest('Box-A decrease height...');
            let available_boxes = this.props.boxes;
            let current_box = this.state.boxes.a;

            let nextAvailableBox = false;
            for(let i = available_boxes.length - 1; 0 <= i; i--){
                let box = available_boxes[i];
                if(box.enable && box.length < current_box.height && !nextAvailableBox){
                    nextAvailableBox = box;
                }
            }

            if(nextAvailableBox){
                this.changeBoxSize('a',nextAvailableBox);
            }else{
                this.props.dispatch(sendNotification("The height less than "+current_box.height+"cm is not available for Box-A.",-1));
            }
        };


    //Box B control events...
        onClick_increaseBoxB_width = ()=>{
            let available_boxes = this.props.boxes;
            let current_box = this.state.boxes.b;
            this.consoleTest('Box-B increase width...');

            let nextAvailableBox = false;
            available_boxes.map(box=>{
                if(box.enable && box.depth > current_box.width && !nextAvailableBox){
                    nextAvailableBox = box;
                }
                return false;
            });

            if(nextAvailableBox){
                this.changeBoxSize('b',nextAvailableBox);
            }else{
                this.props.dispatch(sendNotification("The depth more than "+current_box.width+"cm is not available for Box-B.",-1));
            }
        };

        onClick_increaseBoxB_height = ()=>{
            let available_boxes = this.props.boxes;
            let current_box = this.state.boxes.b;
            this.consoleTest('Box-B increase height...');
            let nextAvailableBox = false;
            available_boxes.map(box=>{
                if(box.enable && box.length > current_box.height && !nextAvailableBox){
                    nextAvailableBox = box;
                }
                return false;
            });

            if(nextAvailableBox){
                this.changeBoxSize('b',nextAvailableBox);
            }else{
                this.props.dispatch(sendNotification("The height more than "+current_box.height+"cm is not available for Box-B.",-1));
            }
        };

        onClick_decreaseBoxB_width = ()=>{
            this.consoleTest('Box-B decrease width...');
            let available_boxes = this.props.boxes;
            let current_box = this.state.boxes.b;

            let nextAvailableBox = false;
            for(let i = available_boxes.length - 1; 0 <= i; i--){
                let box = available_boxes[i];
                if(box.enable && box.depth < current_box.width && !nextAvailableBox){
                    nextAvailableBox = box;
                }
            }

            if(nextAvailableBox){
                this.changeBoxSize('b',nextAvailableBox);
            }else{
                this.props.dispatch(sendNotification("The depth less than "+current_box.width+"cm is not available for Box-B.",-1));
            }
        };

        onClick_decreaseBoxB_height = ()=>{
            this.consoleTest('Box-B decrease height...');
            let available_boxes = this.props.boxes;
            let current_box = this.state.boxes.b;

            let nextAvailableBox = false;

            for(let i = available_boxes.length - 1; 0 <= i; i--){
                let box = available_boxes[i];
                if(box.enable && box.length < current_box.height && !nextAvailableBox){
                    nextAvailableBox = box;
                }
            }

            if(nextAvailableBox){
                this.changeBoxSize('b',nextAvailableBox);
            }else{
                this.props.dispatch(sendNotification("The height less than "+current_box.height+"cm is not available for Box-B.",-1));
            }
        };


        getBoxControls = ()=>(
            <Fragment>
                <div className="table-responsive">
                    <table style={{textAlign: 'center'}} className="table table-striped table-dark">
                        <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Box</th>
                            <th scope="col">Depth & Length</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th scope="row">01.</th>
                            <td>Box-A</td>
                            <td>
                                <select onChange={this.changeBoxASize} className="form-control">
                                    {this.props.boxes.map((box, index1) => {
                                        let selectedBoxA = this.state.boxes.a;
                                        let isSelected = (selectedBoxA.height === box.length) && (selectedBoxA.width === box.depth);
                                        if(box.enable) {
                                            return <option value={index1} selected={isSelected}>{box.depth}cm, {box.length}cm</option>;
                                        }else{
                                            return <option disabled={true} value={index1}>{box.depth}cm, {box.length}cm</option>;
                                        }
                                    })}
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">02.</th>
                            <td>Box-A</td>
                            <td>
                                <table>
                                    <thead>
                                        <tr>
                                            <td>Depth</td>
                                            <td>Length</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <div className="btn-group" role="group" aria-label="Basic example">
                                                    <button onClick={this.onClick_increaseBoxA_width.bind(this)} className='btn btn-sm btn-success'>Increase</button>
                                                    <button onClick={this.onClick_decreaseBoxA_width.bind(this)} className='btn btn-sm btn-danger'>Decrease</button>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="btn-group" role="group" aria-label="Basic example">
                                                    <button onClick={this.onClick_increaseBoxA_height.bind(this)} className='btn btn-sm btn-success'>Increase</button>
                                                    <button onClick={this.onClick_decreaseBoxA_height.bind(this)} className='btn btn-sm btn-danger'>Decrease</button>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        {(this.state.totalBoxes === 2)?
                            <Fragment>
                                <tr>
                                    <th scope="row">03.</th>
                                    <td>Box-B</td>
                                    <td>
                                        <select onChange={this.changeBoxBSize} className="form-control">
                                            {this.props.boxes.map((box, index1) => {
                                                let selectedBoxB = this.state.boxes.b;
                                                let isSelected = (selectedBoxB.height === box.length) && (selectedBoxB.width === box.depth);
                                                if(box.enable) {
                                                    return <option value={index1} selected={isSelected}>{box.depth}cm, {box.length}cm</option>;
                                                }else{
                                                    return <option disabled={true} value={index1}>{box.depth}cm, {box.length}cm</option>;
                                                }
                                            })}
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">04.</th>
                                    <td>Box-B</td>
                                    <td>
                                        <table>
                                            <thead>
                                            <tr>
                                                <td>Depth</td>
                                                <td>Length</td>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr>
                                                <td>
                                                    <div className="btn-group" role="group" aria-label="Basic example">
                                                        <button onClick={this.onClick_increaseBoxB_width.bind(this)} className='btn btn-sm btn-success'>Increase</button>
                                                        <button onClick={this.onClick_decreaseBoxB_width.bind(this)} className='btn btn-sm btn-danger'>Decrease</button>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="btn-group" role="group" aria-label="Basic example">
                                                        <button onClick={this.onClick_increaseBoxB_height.bind(this)} className='btn btn-sm btn-success'>Increase</button>
                                                        <button onClick={this.onClick_decreaseBoxB_height.bind(this)} className='btn btn-sm btn-danger'>Decrease</button>
                                                    </div>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </Fragment>
                            :false}
                        </tbody>
                    </table>
                </div>
            </Fragment>
        );

        getInstructionInfo = ()=>(
            <Fragment>
                <div className="alert alert-info" role="alert">
                    <h4 className="alert-heading">Well done! NOW,</h4>
                    <p>Click on the box to change the size or drag them around to re-arrange them.</p>
                    <hr/>
                    <p className="mb-0">Any confusion please <a href="#" onClick={()=>{this.setState({do_redirectToContact: true})}}>contact us</a>.</p>
                </div>
            </Fragment>
        );

        getBoxAvailibilityInfo = ()=>{
            return (
                <Fragment>
                    <div className="table-responsive">
                        <table className="table table-striped table-dark">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Depth</th>
                                    <th scope="col">Length</th>
                                    <th scope="col">Availability ?</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.props.boxes.map(({depth, length, enable}, index) => {
                                   return (
                                       <tr className={enable?'':'in-active'} key={index} aria-disabled={true}>
                                           <th scope="row">{index + 1}.</th>
                                           <td>{depth} cms</td>
                                           <td>{length} cms</td>
                                           <td>{enable?'Available':'Not Available'}</td>
                                       </tr>
                                   );
                                })}
                            </tbody>
                        </table>
                    </div>
                </Fragment>
            );
        };

        getTabs = () => {
            this.consoleApp('State', this.state);
            this.consoleApp('Props', this.props);
            const tabs = [
                { name: 'Instructions.', content: this.getInstructionInfo() },
                { name: 'Controls.', content: this.getBoxControls() },
                { name: 'Advance Info.', content: this.getMesurementInfo() },
                { name: 'Box Availibilities.', content: this.getBoxAvailibilityInfo() }];
            return tabs.map((president, index) => ({
                title: president.name,
                getContent: () => president.content,
                key: index,
                tabClassName: 'tab',
                panelClassName: 'panel',
            }));
        };



    //Render Layout...
    render(){
        return(
            <Fragment>
                {(!this.props.app.is_quote_selected)?this.redirectToHomePage(true):false}
                {this.redirectToContactPage(this.props.app.redirect_to_contact_page || this.state.do_redirectToContact)}
                {this.getRenderData()}
            </Fragment>
        );
    }
}

export default connect(store=>({boxes: store.box.boxes, notification: store.notification, quote: store.quote, app: store.app}), dispatch => ({dispatch}))(SelfService);

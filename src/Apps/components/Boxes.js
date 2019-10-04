import React, {Component} from 'react';
import {connect} from "react-redux";

const getBoxes = (props) => {
    return props.boxes;
};

export default connect(store=>({boxes: store.box.boxes}), dispatch => ({dispatch}))(getBoxes);

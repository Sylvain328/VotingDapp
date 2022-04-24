import React from 'react';
import WorkflowStatus from "../enums/WorkflowStatus.js";

export default class NextStepButton extends React.Component {

    constructor(props) {
        super(props);
    }

    render(){
        return(
            <button className={`NextStepButton ${this.props.isOwner && this.props.step != WorkflowStatus.VotesTallied ? "" : "HideComponent"}`} onClick={this.props.nextStep}>Next Step</button>
        )
    }
}
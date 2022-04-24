import React from 'react';
import WorkflowStatus from "../enums/WorkflowStatus.js";

export default class VoteResult extends React.Component {

    constructor(props) {
        super(props);
    }

    render(){
        return(
            <div className={`Action ${this.props.step == WorkflowStatus.VotesTallied ? "" : "HideComponent"}`}>
                <h2>Vote Result</h2>
                <div>
                    The winning proposal is :
                    <div id="winnerDiv">
                        <label>{this.props.winningProposalId} - {this.props.winningProposal == null ? "" : this.props.winningProposal.description} with {this.props.winningProposal == null ? "" : this.props.winningProposal.voteCount} votes </label>
                    </div>
                </div>
            </div>
        )
    }
}
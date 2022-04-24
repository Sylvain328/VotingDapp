import React from 'react';
import WorkflowStatus from "../enums/WorkflowStatus.js";

export default class ProposalChoice extends React.Component {

    constructor(props) {
        super(props);
    }

    vote = async (event) => {
        await this.props.setVote(event.target.id);
    }

    render(){
        return(
            <div className='Proposal'>
                {this.props.id} - {this.props.description}
                <label className={this.props.step == WorkflowStatus.VotingSessionStarted && this.props.hasVoted && this.props.votedProposalId == this.props.id ? "" : "HideComponent"}>- You vote for it!</label>
                <button id={this.props.id} className={`VoteButton ${this.props.step == WorkflowStatus.VotingSessionStarted && !this.props.hasVoted ? "" : "HideComponent"}`} onClick={this.vote}>Vote</button>
            </div>
        )
    }
}
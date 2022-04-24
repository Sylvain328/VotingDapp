import React from 'react';
import WorkflowStatus from "../enums/WorkflowStatus.js";

export default class ProposalAction extends React.Component {

    constructor(props) {
        super(props);
    }
    
    addProposal = async () => {
        const element = document.getElementById("ProposalAdding");
        // Reset the field
        element.innerHTML = "";
        await this.props.addProposal(this.proposal.value);
        await this.props.addNewProposal(this.proposal.value);
        element.innerHTML = "Proposal added !";
    };

    render(){
        return(
            <div className={`Action ${this.props.step == WorkflowStatus.ProposalsRegistrationStarted ? "" : "HideComponent"}`}>
                <h2>Proposal Registration</h2>
                <input className="ProposalInput" type="text" id="ToAddProposal" ref={(input) => { this.proposal = input }} />
                <div className='ProposalButtons'>
                    <button className='ProposalButton' onClick={this.addProposal}>Add</button>
                </div>
                <div id="ProposalAdding">
                </div>
            </div>
        )
    }
}

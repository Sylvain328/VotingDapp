import React from 'react';
import ProposalChoice from "./ProposalChoice.js";
import WorkflowStatus from "../enums/WorkflowStatus.js";

export default class ProposalList extends React.Component {
    state = { isLoaded: false };

    constructor(props) {
        super(props);
    }
    
    componentDidMount = async () => {
        await this.getProposals();
    }

    getProposals = async () => {

        try {

            var i = 0;

            do {
                let proposal = await this.props.getOneProposal(i);
                this.props.proposals.push(proposal);
                i++;
            } while(true);
        }
        catch(error) {
            this.isLoaded = true;
            this.setState({ isLoaded: true });
        }
    };

    render() {

        if (!this.isLoaded) {
            return (<div></div>);
        }

        return(
            <div id='ProposalList' className={`Action ${this.props.step != WorkflowStatus.RegisteringVoters ? "" : "HideComponent"}`}>
                <h2>All Proposals</h2>
                {this.props.proposals.map((proposal, index) => (
                    <ProposalChoice key={index} id={index} description={proposal.description} setVote={this.props.setVote} step={this.props.step} hasVoted={this.props.hasVoted} votedProposalId={this.props.votedProposalId}/>
                ))}
            </div>
        )
    }
}

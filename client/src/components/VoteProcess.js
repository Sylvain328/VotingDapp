import React from 'react';
import VoteStep from './VoteStep.js';
import WorkflowStatus from "../enums/WorkflowStatus.js";

export default class VoteProcess extends React.Component {

    constructor(props) {
        super(props);
    }

    render(){

        const items =['Voters registration','Proposals registration','Voting','Vote result'];
        const steps = [WorkflowStatus.RegisteringVoters, WorkflowStatus.ProposalsRegistrationStarted, WorkflowStatus.VotingSessionStarted, WorkflowStatus.VotesTallied];

        let itemList=[];

        items.forEach((item,index) => {
            itemList.push(<VoteStep key={index} number={index+1} stepLabel={item} currentStep={this.props.currentStep} activeStep={steps[index]}/>);
        });

        return(
            <div className='VoteProcess'>
                {itemList}
            </div>
        )
    }
}
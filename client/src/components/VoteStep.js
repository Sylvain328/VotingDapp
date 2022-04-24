import React from 'react';

export default class VoteStep extends React.Component {
    
    constructor(props) {
        super(props);
    }

    render(){
        return(
            <div className={this.props.currentStep == this.props.activeStep ? 'VoteStep active' : 'VoteStep'}>
                <label>{this.props.number}</label>
                <p>{this.props.stepLabel}</p>
            </div>
        )
    }
}
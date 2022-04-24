import React from 'react';
import WorkflowStatus from "../enums/WorkflowStatus.js";

export default class VoterAction extends React.Component {

    constructor(props) {
        super(props);
    }

    addVoter = async () => {
        const element = document.getElementById("VoterResult");
        // Reset the field
        element.innerHTML = "";
        
        await this.props.addVoter(this.address.value);

        document.getElementById("VoterResult").innerHTML = "Voter added !";
    };

    checkVoter = async () => {

        const element = document.getElementById("VoterResult");
        // Reset the field
        element.innerHTML = "";

        const voterData = await this.props.getVoter(this.address.value);

        let result = "";
        if(voterData.isRegistered) {
            result += "&#10004; it is a voter<br>";
        }
        else {
            result += "&#10060; it is not a voter<br>";
        }

        if(voterData.hasVoted) {
            result += "&#10004; it has voted for proposal " + voterData.votedProposalId + "<br>";
        }
        else {
            result += "	&#10060; it hasn't voted yet<br>"
        }

        element.innerHTML = result;
    };
    
    render(){
        return(
            <div className='Action'>
                <h2>Voter Data</h2>
                <input className="AddressInput" type="text" id="ToTreatAccount" ref={(input) => { this.address = input }} />
                <div className='VoterButtons'>
                    <button className={`VoterButton ${this.props.isOwner && this.props.step == WorkflowStatus.RegisteringVoters ? "" : "HideComponent"}`} onClick={this.addVoter}>Add Voter</button>
                    <button className={`VoterButton ${this.props.isVoter ? "" : "HideComponent"}`} onClick={this.checkVoter}>Check Voter</button>
                </div>
                <div id="VoterResult">
                </div>
            </div>
        )
    }
}

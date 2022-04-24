import React, { Component } from "react";
import VotingContract from "./contracts/Voting.json";
import getWeb3 from "./getWeb3";
import Header from "./components/Header.js";
import VoterAction from "./components/VoterAction.js";
import NextStepButton from "./components/NextStepButton.js";
import ProposalRegistrationAction from "./components/ProposalRegistrationAction.js";
import ProposalList from "./components/ProposalList.js";
import VoteProcess from "./components/VoteProcess.js";
import VoteResult from "./components/VoteResult.js";
import WorkflowStatus from "./enums/WorkflowStatus.js";

import "./App.css";

class App extends Component {
  state = { web3: null, 
    contract: null, 
    account: null, 
    isOwner: false, 
    isVoter: false, 
    step: null, 
    proposals: null, 
    hasVoted: false, 
    votedProposalId: null,
    winningProposalId: null,
    winningProposal: null
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = VotingContract.networks[networkId];
      const instance = new web3.eth.Contract(
        VotingContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      const owner = await instance.methods.owner().call();
      const isOwner = owner == accounts[0];

      // Get the process step
      const currentStep = await instance.methods.workflowStatus().call();
      
      // Set Voter data
      let isVoter = false;
      let hasVoted = false; 
      let votedProposalId = null;

      // try to get the voter data, if it fails, account is not a voter
      try {
        const voter = await instance.methods.getVoter(accounts[0]).call({from: accounts[0]});
        isVoter = voter.isRegistered;
        hasVoted = voter.hasVoted;
        votedProposalId = voter.votedProposalId;
      }
      catch(error) {
      }

      // If the process is on the VotesTallied step, we can set winningData
      let winningProposalId = null;
      let winningProposal = null;

      if(currentStep == WorkflowStatus.VotesTallied) {
        winningProposalId = await instance.methods.winningProposalID().call();;
        winningProposal = await instance.methods.getOneProposal(winningProposalId).call({from: accounts[0]});;
      }
      
      // Event options
      let options = {
        filter: {
            value: [],
        },
        fromBlock: 0
      };

      // Event - When a voter is registered, assign the isVoter to true
      // To show the logo on the top when the owner add himself as a voter
      await instance.events.VoterRegistered(options)
      .on('data', event => {

        if(event.returnValues[0] == accounts[0]) {
          this.setState({isVoter: true});
        }
      });

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, 
        contract: instance, 
        account: accounts[0], 
        isOwner: isOwner, 
        isVoter: isVoter, 
        step: currentStep, 
        proposals: [], 
        hasVoted: hasVoted, 
        votedProposalId: votedProposalId,
        winningProposalId: winningProposalId,
        winningProposal: winningProposal
      });
    
      
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  /** Process to the next voting step */
  nextStep = async () => {

    // Depending on actuel process step
    switch(this.state.step) {

      case WorkflowStatus.RegisteringVoters:
        await this.state.contract.methods.startProposalsRegistering().send({ from: this.state.account });
        this.setState({step: WorkflowStatus.ProposalsRegistrationStarted});
        break;

      case WorkflowStatus.ProposalsRegistrationStarted:
        await this.state.contract.methods.endProposalsRegistering().send({ from: this.state.account });
        await this.state.contract.methods.startVotingSession().send({ from: this.state.account });
        this.setState({step: WorkflowStatus.VotingSessionStarted});
        break;
      
      case WorkflowStatus.VotingSessionStarted:
        await this.state.contract.methods.endVotingSession().send({ from: this.state.account });
        await this.state.contract.methods.tallyVotes().send({ from: this.state.account });
        const winningProposalId = await this.state.contract.methods.winningProposalID().call();
        const winningProposal = await this.getOneProposal(winningProposalId);
        this.setState({step: WorkflowStatus.VotesTallied, winningProposalId: winningProposalId, winningProposal: winningProposal});
        break;
    }
  };

  /** Add a new voter on the smart contract */
  addVoter = async (address) => {
    await this.state.contract.methods.addVoter(address).send({from: this.state.account});
  }

  /** Get voter data from the smart contract */
  getVoter = async (address) => {
    return await this.state.contract.methods.getVoter(address).call({from: this.state.account});
  }

  /** Add a new proposal on the smart contract */
  addProposal = async (proposal) => {
    await this.state.contract.methods.addProposal(proposal).send({from: this.state.account});
  }

  /** Add a new proposal in the list of proposal */
  addNewProposal = async(description) => {
    const newId = this.state.proposals.length;
    this.state.proposals.push({description: description});
    this.setState({proposals: this.state.proposals});
  }

  /** Get proposal data from the smart contract */
  getOneProposal = async (id) => {
    return await this.state.contract.methods.getOneProposal(id).call({from: this.state.account});
  }

  /** Set a vote for a proposal on the smart contract */
  setVote = async (id) => {
    await this.state.contract.methods.setVote(id).send({from: this.state.account});
    this.setState({hasVoted: true, votedProposalId: id});
  }

  /** Get the winning proposal on the smart contract */
  getWinner = async() => {
    return await this.state.contract.methods.winningProposalID().call();
  }

  render() {

    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    // If it's not the owner and not a voter, show a message that indicate that you can't access
    if(!this.state.isOwner && !this.state.isVoter){
      return(
        <div className="App">
          <h1>{this.state.account} is not registered as a Voter</h1>
          <div>To access the voting system, contact the contract owner</div>
        </div>
      )
    }

    return (
      <div className="App">
        <Header account={this.state.account} isOwner={this.state.isOwner} isVoter={this.state.isVoter}/>
        <VoteProcess currentStep={this.state.step} nextStep={ this.nextStep }/>
        <div className="ActionContainer">
          <VoterAction addVoter={this.addVoter} getVoter={this.getVoter} isOwner={this.state.isOwner} isVoter={this.state.isVoter} step={this.state.step} />
          <ProposalRegistrationAction addProposal={this.addProposal} addNewProposal={this.addNewProposal} step={this.state.step}/>
          <VoteResult winningPropsalId={this.state.winningPropsalId} winningProposal={this.state.winningProposal} step={this.state.step}/>
          <ProposalList getOneProposal={this.getOneProposal} setVote={this.setVote} step={this.state.step} proposals={this.state.proposals} hasVoted={this.state.hasVoted} votedProposalId={this.state.votedProposalId}/>
        </div>
        <NextStepButton isOwner={this.state.isOwner} step={this.state.step} nextStep={this.nextStep}/>
      </div>
    );
  }
}

export default App;

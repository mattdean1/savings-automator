import React from "react";
import "./SandboxView.scss";
import URLSearchParams from "url-search-params";
import {Loader, Grid, Header, Container, Message} from "semantic-ui-react";
import Dashboard from "../../../components/Dashboard/Dashboard";

class SandboxView extends React.Component {

  static propTypes = {
    loadTransactions: React.PropTypes.func.isRequired,
    loadBalance: React.PropTypes.func.isRequired,
    loadCustomer: React.PropTypes.func.isRequired,
    setLoading: React.PropTypes.func.isRequired,
  };

  componentWillMount () {
    this.props.setLoading(true);
    this.props.loadTransactions();
    this.props.loadCustomer();
    this.props.loadBalance();
  }

  render () {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const {loading, transactions, balance, customer} = this.props.sandbox;
    return (
      <Grid>
        <br/>
        {loading ? <Loading/>
          : ( transactions && balance && customer ?
            <Dashboard mode={'sandbox'} customer={customer} transactions={transactions} balance={balance}/> : <AnonymousProfile />)}
        {error && error === 'access_denied' ? <UserDenied/> : null}
      </Grid>
    )
  }
}

const Loading = () => {
  return (
    <Loader active size="large"/>
  );
};

const AnonymousProfile = () => {
  return (
  <Message size="large" >
    <Header>No Sandbox Token</Header>
    <p>Enter one in the server config file.</p>
  </Message>

  );
};

const UserDenied = () => {
  return (
    <Message size="large">
      <Header>User Denied Access</Header>
      <p>When a user denies access Starling will callback with an error code</p>
    </Message>
  );
};

export default SandboxView

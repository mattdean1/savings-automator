import React from "react";
import URLSearchParams from "url-search-params";
import { Loader, Grid, Container, Segment, Header, Icon, Button } from "semantic-ui-react";
import Dashboard from "../../../components/Dashboard/Dashboard";
import UserDenied from "../../../components/UserDenied/UserDenied";
import { Link } from 'react-router'

class PersonalAccessView extends React.Component {

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

  componentWillUnmount () {
    window.location.href = ('/api/logout')
  }

  render () {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const {loading, transactions, balance, customer} = this.props.personalAccess;
    return (
      <Grid>
        <br/>
        {loading ? <Loading/>
          : ( transactions && balance ?
            <Dashboard mode={'Personal Access'} customer={customer} transactions={transactions} balance={balance}/> : <AnonymousProfile />)}
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
    <Container>
      <Link to="/">
        <Button>{`< Back`}</Button> </Link>
      <Segment size="large" textAlign="center">
        <Header as="h2" icon={true}>
          <Icon name="warning sign"/>
          No Personal Access Token
          <Header.Subheader>
            Enter one in the server config file.
          </Header.Subheader>
        </Header>
      </Segment>
    </Container>
  );
};

export default PersonalAccessView

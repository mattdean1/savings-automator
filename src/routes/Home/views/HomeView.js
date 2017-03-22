import React from 'react'
import './HomeView.scss'
import URLSearchParams from 'url-search-params'
import {Loader, Message, Statistic, Grid, Container, Segment, Header, Image, Icon, Label, Button} from 'semantic-ui-react'
import {TransactionTable} from '../../../components/TransactionTable/TransactionTable'
import {amountDisplay} from '../../../commons/utils'
import connect from '../../../assets/Oauth-button.png'
import { Link } from 'react-router'

class HomeView extends React.Component {

  static propTypes = {
    setLoading: React.PropTypes.func.isRequired,
  };

  componentWillMount () {
  }

  render () {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const {loading, transactions, balance, customer} = this.props.home;
    return (

        <Segment raised>
          <Container>
            <Grid columns={3} stackable divided={true} textAlign="center">
              <br/>
        <Header>Select your use case</Header>
        <Grid.Row>
          <Grid.Column>
            <Segment textAlign="center">
           <Link to="/oauth">
              <Button>OAuth</Button>
            </Link>
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment textAlign="center">
              <Link to="/sandbox">
              <Button>Sandbox</Button>
            </Link></Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment textAlign="center"> <Link to="/personal">
              <Button color="blue">Personal Access</Button>
            </Link></Segment>
          </Grid.Column>
        </Grid.Row>
            </Grid>
          </Container>
        </Segment>
    )
  }
}

const Loading = () => {
  return (
    <Loader active size="large"/>
  );
};


const UserDenied = () => {
  return (
    <Message size="small">
      <Header>User Denied Access</Header>
      <p>When a user denies access Starling will callback with an error code</p>
    </Message>
  );
};

export default HomeView

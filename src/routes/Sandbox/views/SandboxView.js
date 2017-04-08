import React from 'react'
import URLSearchParams from 'url-search-params'
import { Loader, Grid, Button, Header, Container, Message, Segment, Icon } from 'semantic-ui-react'
import Dashboard from '../../../components/SavingDash/Savings'
import { Link } from 'react-router'
import UserDenied from '../../../components/UserDenied/UserDenied'
import QuickTable from '../../../components/QuickTable'
import { transactionsProjection, transactionsSelection } from '../../../components/TransactionTable/TransactionTable'

class SandboxView extends React.Component {

  static propTypes = {
    loadTransactions: React.PropTypes.func.isRequired,
    loadBalance: React.PropTypes.func.isRequired,
    loadCustomer: React.PropTypes.func.isRequired,
    setLoading: React.PropTypes.func.isRequired
  };

  componentWillMount () {
    this.props.setLoading(true)
    this.props.loadTransactions()
    this.props.loadCustomer()
    this.props.loadBalance()
  }

  componentWillUnmount () {
    window.location.href = ('/api/logout')
  }

  render () {
    const urlParams = new URLSearchParams(window.location.search)
    const error = urlParams.get('error')
    const { loading, transactions, balance, customer } = this.props.sandbox
    return (
      <Grid>
        {loading ? <Loading />
          : (transactions && balance && customer
            ? <Dashboard mode={'Sandbox'} customer={customer} transactions={transactions} balance={balance}>
              {/* <QuickTable projection={transactionsProjection} selection={transactionsSelection} items={transactions} /> */}
            </Dashboard>
            : <AnonymousProfile />)}
        {error && error === 'access_denied' ? <UserDenied /> : null}
      </Grid>
    )
  }
}

const Loading = () => {
  return (
    <Loader active size='large' />
  )
}

const AnonymousProfile = () => {
  return (
    <Container>
      <Link to='/'>
        <Button>{`< Back`}</Button> </Link>
      <Segment size='large' textAlign='center'>
        <Header as='h2' icon>
          <Icon name='warning sign' />
          Access Denied
          <Header.Subheader>
            Check the sandbox refresh token in the server config is valid and try again.
          </Header.Subheader>
        </Header>
      </Segment>
    </Container>

  )
}

const goals = () => {
  return (
    <Container>
      <h1>Goals</h1>
    </Container>

  )
}

const plans = () => {
  return (
    <Container>
      <h1>Plans</h1>
    </Container>

  )
}

const rules = () => {
  return (
    <Container>
      <h1>Rules</h1>
    </Container>

  )
}

export default SandboxView

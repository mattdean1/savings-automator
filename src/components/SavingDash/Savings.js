import React from 'react'
import {
  Grid,
  Container,
  Segment,
  Header,
  Statistic,
  Icon,
  Label,
  Image,
  Card,
  Loader,
  List,
  Button,
  Menu
} from 'semantic-ui-react'
import SelectorDropdown from '../../components/SelectorDropdown/SelectorDropdown'
import { Link } from 'react-router'
import { amountDisplay } from '../../commons/utils'
import './Savings.scss'

class Dashboard extends React.Component {

  static propTypes = {
    balance: React.PropTypes.shape(),
    transactions: React.PropTypes.array,
    customer: React.PropTypes.shape(),
    mode: React.PropTypes.string.isRequired,
    children: React.PropTypes.element
  };

  constructor(props) {
    super(props);
    this.state = ({activeItem: 'goals'});

    this.handleItemClick = this.handleItemClick.bind(this);
    this.goals = this.goals.bind(this);
  }

   handleItemClick (e, { name }) {
     console.log('active item:' + name);
     this.setState({ activeItem: name });
   }

  render () {
    const { customer, balance, transactions, mode } = this.props
    const { firstName } = customer
    const name = customer && firstName ? firstName + "'s Account" : 'Your Account'

    return <Container style={{ maxWidth: '970px' }}>
      {this.goals({})}
    </Container>
  }

  goals ({ goals }) {
    return(
      <Menu>
          <Menu.Item
            name='editorials'
            active={this.state.activeItem === 'editorials'}
            onClick={this.handleItemClick}
          >
            Editorials
          </Menu.Item>

          <Menu.Item
            name='reviews'
            active={this.state.activeItem === 'reviews'}
            onClick={this.handleItemClick}
          >
            Reviews
          </Menu.Item>

          <Menu.Item
            name='upcomingEvents'
            active={this.state.activeItem === 'upcomingEvents'}
            onClick={this.handleItemClick}
          >
            Upcoming Events
          </Menu.Item>
        </Menu>
    )
  }
}

const Balance = (props) => {
  const { balance } = props
  if (balance) {
    if (balance.effectiveBalance === undefined) {
      return <OldBalance balance={balance} />
    }

    const effectiveBalance = balance.effectiveBalance ? amountDisplay(balance.effectiveBalance, balance.currency) : null
    const clearedBalance = balance.effectiveBalance ? amountDisplay(balance.clearedBalance, balance.currency) : null
    const pendingTransactions = balance.pendingTransactions
    return (
      <div>
        <Statistic size='tiny' style={{ textAlign: 'center', marginTop: '-40px' }} color='blue'>
          <Icon name='diamond' size='huge' style={{ textAlign: 'center', margin: '10px auto' }} />
          <Statistic.Value>{effectiveBalance}</Statistic.Value>
          <Statistic.Label>Effective Balance</Statistic.Label>
        </Statistic>
        <Grid columns={2}>
          <Grid.Column>
            <Statistic size='mini' style={{ textAlign: 'center' }} color='blue'>
              <Statistic.Value>{clearedBalance}</Statistic.Value>
              <Statistic.Label>Settled Balance</Statistic.Label>
            </Statistic>
          </Grid.Column>
          <Grid.Column>
            <Statistic size='mini' style={{ textAlign: 'center' }} color='blue'>
              <Statistic.Value>{pendingTransactions}</Statistic.Value>
              <Statistic.Label>Pending Txns</Statistic.Label>
            </Statistic>
          </Grid.Column>
        </Grid>
      </div>
    )
  } else {
    return (
      <div>
        <Header as='h2' icon textAlign='center'>
          <Icon name='warning sign' size='large' />
          Error loading Balance API
        </Header>
      </div>
    )
  }
}

const plans = ({ goals }) => {
  return (
    <div className='ui cards'>
      <div className='card'>
        <div className='content'>
          <div className='header'>
            Macbook Pro 2015
          </div>
          <div className='meta'>
            £362 out of £1,500
          </div>
          <div className='description'>
            Estimated Saving Days: <strong>44</strong>
          </div>
        </div>
        <div className='extra content'>
          <h4>Savings Allocation</h4>
          {/* <div className='ui two buttons'>
            <div className='ui basic green button'>Approve</div>
            <div className='ui basic red button'>Decline</div>
          </div> */}
        </div>
      </div>
      <div className='card'>
        <div className='content'>
          <div className='header'>
            Jenny Hess
          </div>
          <div className='meta'>
            New Member
          </div>
          <div className='description'>
            Jenny wants to add you to the group <b>best friends</b>
          </div>
        </div>
        <div className='extra content'>
          <div className='ui two buttons'>
            <div className='ui basic green button'>Approve</div>
            <div className='ui basic red button'>Decline</div>
          </div>
        </div>
      </div>
    </div>
  )
}



// While the API is different in demo and prod
const OldBalance = ({ balance }) => {
  return balance.amount ? <div>
    <Statistic size='tiny' style={{ textAlign: 'center', marginTop: '-40px' }} color='blue'>
      <Icon name='diamond' size='huge' style={{ textAlign: 'center', margin: '10px auto' }} />
      <Statistic.Value>{balance.amount ? amountDisplay(balance.amount, balance.currency) : null}</Statistic.Value>
      <Statistic.Label>Balance</Statistic.Label>
    </Statistic>
  </div> : null
}

const CustomerDetails = (props) => {
  const { customer } = props
  if (customer) {
    const { firstName, lastName, email, phone, dateOfBirth } = customer
    return (
      <List animated size='large' style={{ margin: '1em 2em' }} verticalAlign='bottom'>
        <List.Item>
          <List.Icon name='users' />
          <List.Content>{firstName + ' ' + lastName}</List.Content>
        </List.Item>
        <List.Item>
          <List.Icon name='phone' />
          <List.Content>{phone}</List.Content>
        </List.Item>
        <List.Item>
          <List.Icon name='mail' />
          <List.Content>
            <a href={`mailto:${email}`}>{email}</a>
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Icon name='birthday' />
          <List.Content>
            {dateOfBirth}
          </List.Content>
        </List.Item>
      </List>
    )
  } else {
    return (
      <div>
        <Header as='h2' icon textAlign='center'>
          <Icon name='warning sign' size='large' />
          Error loading Customer API
        </Header>
      </div>
    )
  }
}

export default Dashboard

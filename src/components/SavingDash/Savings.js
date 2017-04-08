import React from 'react'

import $ from 'jquery'
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
  Menu,
  Modal,
  Input
} from 'semantic-ui-react'
import SelectorDropdown from '../../components/SelectorDropdown/SelectorDropdown'
import { Link } from 'react-router'
import { amountDisplay } from '../../commons/utils'
import './Savings.scss'

const styles = {
  menu : {
    marginTop: -52,
    width: '100%',
    borderRadius: 0
  }
}

const goals = [{
  title : 'Macbook Pro',
  goal : 1500,
  raised : 346.54,
  percentage : 50,
  category: 'Technology',
  start_date : '08/03/17',
  estimated_end_date : '08/05/17',
  estimated_days : 44
}, {
  title : 'Holiday to Malta',
  goal : 800,
  raised : 12.54,
  percentage : 50,
  category: 'Holiday',
  start_date : '06/02/17',
  estimated_end_date : '08/12/17',
  estimated_days : 76
}]

class Dashboard extends React.Component {

  static propTypes = {
    balance: React.PropTypes.shape(),
    transactions: React.PropTypes.array,
    customer: React.PropTypes.shape(),
    mode: React.PropTypes.string.isRequired,
    children: React.PropTypes.element
  };

  constructor (props) {
    super(props)
    this.state = ({
      activeItem: 'goals',
      modal: false,
      goals,
      transactions: [],
    })

    this.handleItemClick = this.handleItemClick.bind(this)
    this.menu = this.menu.bind(this)
    this.startPolling = this.startPolling.bind(this);
    this.poll = this.poll.bind(this);
    this.getNewTransaction = this.getNewTransaction.bind(this);
  }

  getNewTransaction() {
    $.get('/api/sandbox/transactions', function(res) {
      console.log('Updated Transactions');
      this.setState({transactions: res});
    });
  }

  componentDidMount() {
    this.getNewTransaction();
    this.startPolling();
  }

  componentWillUnmount() {
      if (this._timer) {
        clearInterval(this._timer);
        this._timer = null;
      }
  }

  startPolling() {
      var self = this;
      setTimeout(function() {
        self.poll(); // do it once and then start it up ...
        self._timer = setInterval(self.poll.bind(self), 5000);
      }, 1000);
  }

  poll() {
      var self = this;
      $.get('/api/sandbox/ping', function(res) {
          if(res === 'true') {
            console.log('New response detected');
            this.getNewTransaction();
          }
      }).fail(function(response) {
        console.log('Fail');
        console.log(response);
      });
  }

  handleItemClick (e, { name }) {
    console.log('active item:' + name)
    this.setState({ activeItem: name })
  }

  render () {
    const { customer, balance, transactions, mode } = this.props
    const { firstName } = customer
    const name = customer && firstName ? firstName + "'s Account" : 'Your Account'
    console.log('test')
    if (this.state.activeItem === 'plan') {
      return (
        <Grid.Column>
          {this.menu()}
          <Container style={{ maxWidth: '970px' }}>
            {this.plansView(this.state.goals)}
          </Container>
        </Grid.Column>
      )
    } else if (this.state.activeItem === 'rules') {
      return (
        <Grid.Column>
          {this.menu()}
          <Container style={{ maxWidth: '970px' }}>
            {this.rulesView(this.state.goals)}
          </Container>
        </Grid.Column>
      )
    } else {
      return (
        <Grid.Column>
          {this.menu()}
          <Container style={{ maxWidth: '970px' }}>
            {this.goalsView(this.state.goals)}
          </Container>
        </Grid.Column>
      )
    }
  }

  plansView (goals) {
    const newArray = goals.map((goal) => {
      return (
        <div key={goal.title} className='ui cards'>
          <div style={{ width: '100%' }} className='card'>
            <div className='content'>
              <div className='header'>
                {goal.title}
              </div>
            </div>
            <div className='extra content'>
              <h4 style={{ display:'inline', paddingRight: 10, marginTop: 10 }}>Savings Allocation: <strong>{goal.percentage}%</strong></h4>
              <div style={{ float:'right' }} className='ui icon buttons'>
                <div className='decrement ui basic red button icon'><i className='minus icon' /></div>
                <div className='increment ui basic green button icon'><i className='plus icon' /></div>
              </div>
            </div>
          </div>
        </div>
      )
    })
    return (
      <div>{ newArray }</div>
    )
  }

  rulesView (goals) {
    const newArray = goals.map((goal) => {
      return (
        <div key={goal.title} className='ui cards'>
          <div style={{ width: '100%' }} className='card'>
            <div className='content'>
              <div className='header'>
                {goal.title}
              </div>
            </div>
            <div className='extra content'>
              <h4 style={{ display:'inline', paddingRight: 10, marginTop: 10 }}>Savings Allocation: <strong>{goal.percentage}%</strong></h4>
              <div style={{ float:'right' }} className='ui icon buttons'>
                <div className='decrement ui basic red button icon'><i className='minus icon' /></div>
                <div className='increment ui basic green button icon'><i className='plus icon' /></div>
              </div>
            </div>
          </div>
        </div>
      )
    })
    return (
      <div>{ newArray }</div>
    )
  }

  goalsView (goals) {
    const newArray = goals.map((goal) => {
      return (
        <div key={goal.title} className='ui cards'>
          <div style={{ width: '100%' }} className='card'>
            <div className='content'>
              <div className='header'>
                {goal.title}
              </div>
              <div className='meta'>
                £{goal.raised} out of £{goal.goal}
              </div>
              <div className='description'>
                Estimated Saving Days: <strong>{goal.estimated_days}</strong>
              </div>
            </div>
            <div className='extra content'>
              <h4 style={{ display:'inline', paddingRight: 10, marginTop: 10 }}>Savings Allocation: <strong>{goal.percentage}%</strong></h4>
              {/* <div className='ui icon buttons'>
                <div className='decrement ui basic red button icon'><i className='minus icon' /></div>
                <div className='increment ui basic green button icon'><i className='plus icon' /></div>
              </div> */}
            </div>
            <div className='ui bottom attached progress'>
              <div className='indicating bar' />
            </div>
          </div>
        </div>
      )
    })
    return (
      <div>{ newArray }
        <Button style={{ width: '100%', marginTop: '25px' }} positive floated='right' onClick={() => this.setState({ modal: true })}>Create a Goal</Button>
        <Modal
          style={{ maxWidth: '90%' }}
          open={this.state.modal}>
          <Modal.Header>Create a Goal</Modal.Header>
          <Modal.Content style={{ textAlign: 'center' }}>
            <Modal.Description>
              <div style={{ 'paddingBottom': 5 }}>
                <Input labelPosition='left' type='text' placeholder='Holiday to Malta'>
                  <Label basic style={{ width: 100 }}>Name</Label>
                  <input />
                </Input>
              </div>

              <div style={{ 'paddingBottom': 5 }}>
                <Input labelPosition='left' type='text' placeholder='1000'>
                  <Label basic style={{ width: 100 }}>Cost(£)</Label>
                  <input />
                </Input>
              </div>

              <div style={{ 'paddingBottom': 20 }}>
                <Input labelPosition='left' type='text' placeholder='Travel'>
                  <Label basic style={{ width: 100 }}>Category</Label>
                  <input />
                </Input>
              </div>
            </Modal.Description>
            <Modal.Actions>
              <Button basic color='red' onClick={() => this.setState({ modal: false })}>
                <Icon name='remove' /> Cancel
    </Button>
              <Button color='green' onClick={() => this.createGoal(name, cost, category)}>
                <Icon name='checkmark' /> Create
    </Button>
            </Modal.Actions>
          </Modal.Content>
        </Modal>
      </div>
    )
  }

  createGoal (name, cost, category) {
    // const goal =
  }

  menu () {
    return (
      <Menu style={styles.menu} fluid widths={3}>
        <Menu.Item
          name='goals'
          active={this.state.activeItem === 'goals'}
          onClick={this.handleItemClick}
          >
            Goals
          </Menu.Item>

        <Menu.Item
          name='plan'
          active={this.state.activeItem === 'plan'}
          onClick={this.handleItemClick}
          >
            Plan
          </Menu.Item>

        <Menu.Item
          name='rules'
          active={this.state.activeItem === 'rules'}
          onClick={this.handleItemClick}
          >
            Rules
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

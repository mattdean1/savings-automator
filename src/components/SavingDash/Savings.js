import React from 'react'

import update from 'immutability-helper'
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
  Input,
  Progress,
  Checkbox
} from 'semantic-ui-react'
import SelectorDropdown from '../../components/SelectorDropdown/SelectorDropdown'
import Slider from 'react-rangeslider'
import { Link } from 'react-router'
import { amountDisplay } from '../../commons/utils'
import './Savings.scss'
import 'react-rangeslider/lib/index.css'

const sampleGoals = [
  {
    title : 'Macbook Pro',
    goal : 1500,
    raised : 1500,
    percentage : 33,
    category: 'Technology',
    start_date : '08/03/17',
    estimated_end_date : '08/05/17',
    estimated_days : 44
  },
  {
    title : 'Holiday to Malta',
    goal : 800,
    raised : 12.54,
    percentage : 33,
    category: 'Holiday',
    start_date : '06/02/17',
    estimated_end_date : '08/12/17',
    estimated_days : 76
  },
  {
    title : 'goal3',
    goal : 800,
    raised : 12.54,
    percentage : 33,
    category: 'Holiday',
    start_date : '06/02/17',
    estimated_end_date : '08/12/17',
    estimated_days : 76
  }
]

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
      transactions: [],
      goals : sampleGoals,
      goalCount : 0,
      IN_Income_Savings : 0,
      OUT_RoundUp : false,
      OUT_PersonalTax: 0,
      slidervalue: 50
    })

    this.handleItemClick = this.handleItemClick.bind(this)
    this.menu = this.menu.bind(this)
    this.startPolling = this.startPolling.bind(this)
    this.poll = this.poll.bind(this)
    this.getNewTransaction = this.getNewTransaction.bind(this)
  }

  getNewTransaction () {
    var self = this
    $.get('/api/sandbox/transactions', function (res) {
      console.log('Updated Transactions')
      console.log(res.length)
      console.log(res)
      self.setState({ transactions: res })
    })
  }

  componentDidMount () {
    this.getNewTransaction()
    this.startPolling()
  }

  componentWillUnmount () {
    if (this._timer) {
      clearInterval(this._timer)
      this._timer = null
    }
  }

  startPolling () {
    var self = this
    setTimeout(function () {
      self.poll() // do it once and then start it up ...
      self._timer = setInterval(self.poll.bind(self), 5000)
    }, 1000)
  }

  poll () {
    var transaction = this.getNewTransaction
    var self = this
    $.get('/api/sandbox/ping', function (res) {
      console.log(res)
      if (res === 'true') {
        console.log('New response detected')
        transaction()
      }
    }).fail(function (response) {
      console.log('Fail')
      console.log(response)
    })
    this.createGoal = this.createGoal.bind(this)
  }

  handleItemClick (e, { name }) {
    console.log('active item:' + name)
    this.setState({ activeItem: name })
  }

  postRules () {
    const rules = {
      IN_Income_Savings : this.state.IN_Income_Savings,
      OUT_RoundUp : this.state.OUT_RoundUp,
      OUT_PersonalTax : this.state.OUT_PersonalTax
    }
    $.post('/api/sandbox/rules', rules, function (res) {
      console.log(res)
      if (res === 'true') {
        console.log('New response detected')
      }
    }).fail(function (response) {
      console.log('Fail')
      console.log(response)
    })
  }

  render () {
    const { customer, balance, transactions, mode } = this.props
    const { firstName } = customer
    const name = customer && firstName ? firstName + "'s Account" : 'Your Account'

    if (this.state.activeItem === 'plan') {
      return (
        <Grid.Column style={{ padding: 0 }}>
          {this.menu()}
          <Container style={{ maxWidth: '970px' }}>
            {this.plansView(this.state.goals)}
          </Container>
        </Grid.Column>
      )
    } else if (this.state.activeItem === 'rules') {
      return (
        <Grid.Column style={{ padding: 0 }}>
          {this.menu()}
          <Container style={{ maxWidth: '970px' }}>
            {this.rulesView(this.state.goals)}
          </Container>
        </Grid.Column>
      )
    } else {
      return (
        <Grid.Column style={{ padding: 0 }}>
          {this.menu()}
          <Container style={{ maxWidth: '970px' }}>
            {this.goalsView(this.state.goals)}
          </Container>
        </Grid.Column>
      )
    }
  }

  handleSlider (goalindex, oldvalue, newvalue) {
    // Get delta slide value
    const valueChange = newvalue - oldvalue

    // divvy that out to the other slides
    const numGoals = this.state.goals.length - 1
    const share = valueChange / numGoals

    // edge cases - odd number of goals?

    // Update state with new goal value
    const newGoals = this.state.goals.map((goal, index) => {
      const goalCopy = goal
      if (index === goalindex) {
        goalCopy.percentage = newvalue
        return goalCopy
      } else {
        goalCopy.percentage = goalCopy.percentage - share
        return goalCopy
      }
    })
    this.setState({ goals: newGoals })
  }

  plansView (goals) {
    const newArray = goals.map((goal, index) => {
      return (
        <div key={goal.title} className='ui cards'>
          <div style={{ width: '100%' }} className='card'>
            <div className='content'>
              <div className='header'>
                {goal.title}
                <span style={{ float: 'right' }}>{goal.percentage}%</span>
              </div>
            </div>
            <div className='extra content'>
              <div key={goal.title + '' + goal.start_date}>
                <div className='slider'>
                  <Slider
                    min={0}
                    max={100}
                    value={goal.percentage}
                    onChange={(newvalue) => this.handleSlider(index, goal.percentage, newvalue)}
                />
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    })
    return (
      <div>
        { newArray }
      </div>

    )
  }

  rulesView (goals) {
    return (

      <div className='ui cards'>
        <div style={{ width: '100%' }} className='card'>
          <Label attached='top'>How to set your rules</Label>
          <div className='content'>
            <div className='header'>
              Getting Started
              <div style={{ fontSize: 12 }} className='meta'>Assign rules to make the most of your outcome and income. All self 'taxes' will be sent to your savings account.</div>
            </div>
          </div>
        </div>
        <div style={{ width: '100%' }} className='card'>
          <Label attached='top'>Incoming</Label>
          <div className='content'>
            <div className='header'>
              <div className='checkbox'>
              Income Savings
                <Checkbox toggle name='example' style={{ float:'right', cursor: 'pointer' }} />
              </div>
              <span style={{ fontSize: 12 }} className='meta'>Take a % of your income and put it into your savings. Automatically!</span>
            </div>
          </div>
          <div className='extra content'>
            <h4 style={{ display:'inline', paddingRight: 10, marginTop: 10 }}><strong /></h4>
            <div style={{ float:'left' }}>
              <Input
                onChange={(e, data) => { console.log(data); this.setState({ 'IN_Income_Savings' : data.value }, () => { this.postRules() }) }}
                label={{ basic: true, content: '%' }}
                labelPosition='right'
                placeholder='Enter Percentage'
                value={this.state.IN_Income_Savings}
              />
            </div>
          </div>
        </div>

        <div style={{ width: '100%' }} className='card'>
          <Label attached='top'>Outgoing</Label>
          <div className='content'>
            <div className='header'>
              <div className='checkbox'>
              Personal Tax
                <Checkbox toggle name='example' style={{ float:'right', cursor: 'pointer' }} />
              </div>
              <span style={{ fontSize: 12 }} className='meta'>For all non-essential purchases, tax yourself to incentivise spending less</span>

            </div>
          </div>
          <div className='extra content'>
            <h4 style={{ display:'inline', paddingRight: 10, marginTop: 10 }}><strong /></h4>
            <div style={{ float:'left' }}>
              <Input
                onChange={(e, data) => { console.log(data); this.setState({ 'OUT_PersonalTax' : data.value }, () => { this.postRules() }) }}
                label={{ basic: true, content: '%' }}
                labelPosition='right'
                placeholder='Enter Percentage'
                value={this.state.OUT_PersonalTax}
              />
            </div>
          </div>
          <div className='content'>
            <div className='header'>
              <div className='checkbox'>
            Round-Up Change
                <Checkbox
                  onChange={(e, data) => { this.setState({ 'OUT_RoundUp' : data.checked }, () => { this.postRules() }) }}
                  toggle name='example' style={{ float:'right', cursor: 'pointer' }}
                  value={this.state.OUT_RoundUp}
                />
              </div>
              <span style={{ fontSize: 12 }} className='meta'>Each time you make a purchase the cost will be rounded to the pound and the excess saved!</span>
            </div>
          </div>
        </div>

      </div>
    )
  }

  goalsView (goals) {
    const newArray = goals.map((goal) => {
      const percentRaised = (goal.raised / goal.goal) * 100
      return (
        <div key={goal.title + '' + Math.random()} className='ui cards'>
          <div style={{ width: '100%' }} className='card'>
            <div className='content'>
              <div className='header'>
                {goal.title}
                {percentRaised === 100 ? <span style={{ float: 'right' }}>Completed!</span> : null}
              </div>
              <div className='meta'>
              £{goal.raised} out of £{goal.goal}
              </div>
              <div className='description'>
              Estimated Days To Achievement: <strong>{goal.estimated_days}</strong>
              </div>
            </div>
            <div className='extra content'>
              <h4 style={{ display:'inline', paddingRight: 10, marginTop: 10 }}>Savings Allocation: <strong>{goal.percentage}%</strong></h4>
              {/* <div className='ui icon buttons'>
              <div className='decrement ui basic red button icon'><i className='minus icon' /></div>
              <div className='increment ui basic green button icon'><i className='plus icon' /></div>
            </div> */}
            </div>
            <Progress
              percent={percentRaised}
              attached='bottom'
              color={percentRaised === 100 ? 'green' : 'violet'}
          />
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
                  <input onChange={e => this.setState({ 'newGoalTitle' : e.target.value })} />
                </Input>
              </div>

              <div style={{ 'paddingBottom': 5 }}>
                <Input labelPosition='left' type='text' placeholder='1000'>
                  <Label basic style={{ width: 100 }}>Cost(£)</Label>
                  <input onChange={e => this.setState({ 'newGoalCost' : e.target.value })} />
                </Input>
              </div>

              <div style={{ 'paddingBottom': 20 }}>
                <Input labelPosition='left' type='text' placeholder='Travel'>
                  <Label basic style={{ width: 100 }}>Category</Label>
                  <input onChange={e => this.setState({ 'newGoalCategory' : e.target.value })} />
                </Input>
              </div>
            </Modal.Description>
            <Modal.Actions>
              <Button basic color='red' onClick={() => this.setState({ modal: false })}>
                <Icon name='remove' /> Cancel
    </Button>
              <Button color='green' onClick={() => this.createGoal()}>
                <Icon name='checkmark' /> Create
    </Button>
            </Modal.Actions>
          </Modal.Content>
        </Modal>
      </div>
    )
  }

  createGoal () {
    const newGoal = this.state.newGoal
    newGoal.title = this.state.newGoalTitle
    newGoal.category = this.state.newGoalCategory
    newGoal.goal = this.state.newGoalCost
    newGoal.start_date = new Date()
    newGoal.key2 = '' + (+new Date())

    let goalsArray = update(this.state.goals, { $push: [newGoal] })

    this.setState({ goals: goalsArray })
    // this.setState({ goals: goalsArray, modal: false, goalCount: this.state.goalCount++ })
  }

  menu () {
    return (
      <Menu id='pillsmenu' fluid widths={3}>
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

export default Dashboard

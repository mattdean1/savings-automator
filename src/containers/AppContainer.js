import React, { Component, PropTypes } from 'react'
import { browserHistory, Router } from 'react-router'
import $ from 'jquery'
import { Provider } from 'react-redux'
import 'react-select/dist/react-select.css';

class AppContainer extends Component {
  static propTypes = {
    routes : PropTypes.object.isRequired,
    store  : PropTypes.object.isRequired
  };


  constructor(props) {
    super(props);
    this.startPolling = this.startPolling.bind(this);
    this.poll = this.poll.bind(this);
  }

  shouldComponentUpdate () {
    return false
  }

  componentDidMount() {
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
        if (!self.isMounted()) { return; } // abandon
        self.poll(); // do it once and then start it up ...
        self._timer = setInterval(self.poll.bind(self), 15000);
      }, 1000);
  }

  poll() {
      var self = this;
      $.get('/api/sandbox/ping', function(result) {
        if (self.isMounted()) {
          console.log('Success');
          console.log(result);
        }
      }).fail(function(response) {
        console.log('Fail');
        console.log(response);
      });
  }

  render () {
    const { routes, store } = this.props;

    return (
      <Provider store={store}>
        <div style={{ height: '100%' }}>
          <Router history={browserHistory} children={routes} />
        </div>
      </Provider>
    )
  }
}

export default AppContainer

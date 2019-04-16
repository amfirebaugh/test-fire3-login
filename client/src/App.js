import React, { Component } from 'react';

import Navbar from './components/Navbar';
// react router imports
import { Route, Switch } from 'react-router-dom';

// required for login
import Auth from './Auth/Auth';
import PrivateRoute from './components/PrivateRoute';
import AuthContext from './AuthContext';

// import pages
import Home from './pages/Home';
import Profile from './pages/Profile';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: new Auth(this.props.history),
      tokenRenewComplete: false
    };
  }

  componentDidMount() {
    this.state.auth.renewToken(() => {
      this.setState({ tokenRenewComplete: true });
    });
  }

  render() {
    const { auth } = this.state;
    if (!this.state.tokenRenewComplete) {
      return 'Loading...';
    }
    // {
    //   /* must enclose top-level jsx with the browser router */
    // }
    return (
      <AuthContext.Provider value={auth}>
        <div className="App">
          {/* Render Navbar */}
          <Navbar branding="Dummy Navbar" auth={auth} />
          {/* 
            set up the routes, ALL routes need to be imported at top 
            the '/' = Home and 'other routes contain '/', 
            they will be appended to home route in the browser window
            ** However **
            adding exact to '/' fixes this
          */}
          <Switch>
            <Route exact path="/" component={Home} auth={auth} />
            <PrivateRoute exact path="/Profile" component={Profile} />
            {/* 
              Profile is a placeholder route until we get auth ironed out 
              <Route exact path="/Profile" Component={Profile} /> 
            */}
          </Switch>
        </div>
      </AuthContext.Provider>
    );
  }
}

export default App;

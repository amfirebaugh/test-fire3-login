import React, { Component } from 'react';
import Navbar from './components/Navbar';
// react router imports
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// import pages
import Home from './pages/Home';
import Profile from './pages/Profile';

class App extends Component {
  render() {
    {
      /* must enclose top-level jsx with the browser router */
    }
    return (
      <BrowserRouter>
        <div className="App">
          {/* Render Navbar */}
          <Navbar branding="Dummy Navbar" />
          {/* 
            set up the routes, ALL routes need to be imported at top 
            the '/' = Home and 'other routes contain '/', 
            they will be appended to home route in the browser window
            ** However **
            adding exact to '/' fixes this
          */}
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/Profile" component={Profile} />
            {/* 
              Profile is a placeholder route until we get auth ironed out 
              <Route exact path="/Profile" Component={Profile} /> 
            */}
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;

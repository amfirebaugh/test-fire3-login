import React, { Component } from 'react';
//import { MyConsumer } from '../context';

class WelcomeHome extends Component {
  render() {
    return (
      // the component that needs to utilize the state data is wrapped in the 'Consumer' component.
      <div className="container jumbotron">
        <div className="row">
          <div className="col-md-6">
            <h4 className="text-success">Welcome Home!</h4>
            <p className="lead">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti
              dolorem at error vitae voluptate harum sequi accusantium soluta
              mollitia dolor iste velit ducimus odit facilis minus fugiat,
              magnam eaque aliquid?
            </p>
          </div>
          <div className="col-md-6">
            <h4 className="text-primary">Saved Searches!</h4>
            <p className="lead">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti
              dolorem at error vitae voluptate harum sequi accusantium soluta
              mollitia dolor iste velit ducimus odit facilis minus fugiat,
              magnam eaque aliquid?
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default WelcomeHome;

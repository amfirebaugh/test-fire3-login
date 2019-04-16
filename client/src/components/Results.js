import React, { Component } from 'react';
import { MyConsumer } from '../context';

class Results extends Component {
  render() {
    return (
      // the component that needs to utilize the state data is wrapped in the 'Consumer' component.
      // the immediate child of the consumer must be a function
      <MyConsumer>
        {value => {
          const { people } = value;
          console.log('people are :', people[0]);
          return (
            <div className="jumbotron">
              <h4 className="text-warning">
                Search Results from state using context api
              </h4>
              {people.map(person => (
                <ul key={person.id}>
                  <li>{person.name}</li>
                  <li>{person.age}</li>
                  <li>'is cool' : {person.cool}</li>
                </ul>
              ))}
            </div>
          );
        }}
      </MyConsumer>
    );
  }
}

export default Results;

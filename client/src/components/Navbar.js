import React from 'react';
// import bootstrap from node_modules
import 'bootstrap/dist/css/bootstrap.min.css';

// this is a function-based 'dumb' component
const Header = props => {
  // destructure (else enter: props.branding into <h3> )
  const { branding } = props;

  return (
    <div>
      {/* inline style */}
      <nav className="navbar navbar-expand-sm navbar-dark bg-primary mt-3 mb-3 py-0">
        <div className="container">
          <a href="/" className="navbar-brand">
            {/* js is passed into the jsx via brackets */}
            {branding}
          </a>
          <div>
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <a href="/" className="nav-link">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a href="/Profile" className="nav-link">
                  Profile
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

// create a default branding in-case no props are passed in
// props from App.js will supercede default
Header.defaultProps = {
  branding: 'app is cool'
};

export default Header;

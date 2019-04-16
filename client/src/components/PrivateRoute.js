import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';

// When we import this AuthContext now we don't have to pass the auth object to it (avoiding prop drilling)
import AuthContext from '../AuthContext';

// functional component, and immediately passing in the destructured props
// you can enhance this function to include roles as well

function PrivateRoute({ component: Component, scopes, ...rest }) {
  return (
    <AuthContext.Consumer>
      {auth => (
        <Route
          {...rest}
          render={props => {
            // 1. Redirect to login if not logged in
            if (!auth.isAuthenticated()) {
              return auth.login();
            }
            // 2. Display message if user lacks required scope(s)
            if (scopes.length > 0 && !auth.userHasScopes(scopes)) {
              return (
                <h1>
                  Unauthorized - You need the following scope(s) to view this
                  page: {scopes.join(',')}.
                </h1>
              );
            }
            // 3. Render component if 1 and 2 checkout good
            return <Component auth={auth} {...props} />;
          }}
        />
      )}
    </AuthContext.Consumer>
  );
}

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
  scopes: PropTypes.array
};

PrivateRoute.defaultProps = {
  scopes: []
};

export default PrivateRoute;

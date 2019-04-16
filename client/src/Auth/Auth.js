import auth0 from 'auth0-js';

// varialbes used for storing session in memory
// eslint-disable-next-line
let _idToken = null;
let _accessToken = null;
let _scopes = null;
let _expiresAt = null;

// below in scope, the openid will expose: {
// iss Issuer
// sub Subject
// aud Audience
// exp Expiration Time
// nbf Not Before
// iat Issued At
// }

// when the below method authorize() is called, it will redirect the browser to the Auth0 login page

export default class Auth {
  constructor(history) {
    this.history = history;
    this.userEmail = null;
    this.userProfile = null;
    this.requestedScopes = 'openid profile email';
    this.auth0 = new auth0.WebAuth({
      domain: process.env.REACT_APP_AUTH0_DOMAIN,
      clientID: process.env.REACT_APP_AUTH0_CLIENTID,
      redirectUri: process.env.REACT_APP_AUTH0_CALLBACK_URL,
      audience: process.env.REACT_APP_AUTH0_AUDIENCE,
      responseType: 'token id_token',
      scope: this.requestedScopes
    });
  }
  login = () => {
    this.auth0.authorize();
  };

  handleAuthentication = () => {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        this.history.push('/profile');
      } else if (err) {
        this.history.push('/');
        alert(`Error: ${err.error}. Check the console for further details.`);
        console.log(err);
      }
    });
  };

  setSession = authResult => {
    // set the time that the access token will expire
    _expiresAt = authResult.expiresIn * 1000 + new Date().getTime();
    _scopes = authResult.scope || this.requestedScopes || '';
    _accessToken = authResult.accessToken;
    _idToken = authResult.idToken;
    this.scheduleTokenRenewal();
  };

  isAuthenticated() {
    return new Date().getTime() < _expiresAt;
  }

  // video 6.2 in pluralsight tutorial his logout dind't work so he added different code, but mine works for now... so this is note for reference...
  logout = () => {
    this.history.push('/');
  };

  getAccessToken = () => {
    if (!_accessToken) {
      throw new Error('No access token found.');
    }
    return _accessToken;
  };

  getProfile = cb => {
    if (this.userProfile) {
      return cb(this.userProfile);
    }
    this.auth0.client.userInfo(this.getAccessToken(), (err, profile) => {
      if (profile) {
        this.userProfile = profile;
        cb(profile, err);
      }
    });
  };

  getEmail = cb => {
    if (this.userEmail) {
      return cb(this.userEmail);
    }
    this.auth0.client.userInfo(this.getAccessToken(), (err, email) => {
      if (email) {
        this.userEmail = email;
        cb(email, err);
      }
    });
  };

  // this function looks in localStorage for scopes, if there are none then it defaults to an empty string, then splits on that string, THEN iterates over each scope and returns true if every one of the scopes passed into the function are found within the scopes that are inside localStorage
  userHasScopes(scopes) {
    const grantedScopes = (_scopes || '').split(' ');
    return scopes.every(scope => grantedScopes.includes(scope));
  }

  // checkSession is provided by auth0
  renewToken(cb) {
    this.auth0.checkSession({}, (err, result) => {
      if (err) {
        console.log(`Error: ${err.error} - ${err.error_description}.`);
      } else {
        this.setSession(result);
      }
      if (cb) {
        cb(err, result);
      }
    });
  }

  scheduleTokenRenewal() {
    const delay = _expiresAt - Date.now();
    if (delay > 0) {
      setTimeout(() => this.renewToken(), delay);
    }
  }
}

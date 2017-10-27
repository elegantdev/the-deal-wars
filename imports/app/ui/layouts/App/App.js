/* eslint-disable jsx-a11y/no-href*/

// meteor
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';
import { Bert } from 'meteor/themeteorchef:bert';

// react
import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Grid, Alert, Button } from 'react-bootstrap';

// app
import Navigation from '../../components/Navigation/Navigation';
import Footer from '../../components/Footer/Footer';

import Index from '../../pages/Index/Index';
import NotFound from '../../pages/NotFound/NotFound';
import Terms from '../../pages/Terms/Terms';
import Privacy from '../../pages/Privacy/Privacy';
import ExamplePage from '../../pages/ExamplePage/ExamplePage';

import './App.scss';

// auth
import Authenticated from '../../../../auth/ui/components/Authenticated/Authenticated';
import Public from '../../../../auth/ui/components/Public/Public';

import Signup from '../../../../auth/ui/pages/Signup/Signup';
import Login from '../../../../auth/ui/pages/Login/Login';
import Logout from '../../../../auth/ui/pages/Logout/Logout';
import VerifyEmail from '../../../../auth/ui/pages/VerifyEmail/VerifyEmail';
import RecoverPassword from '../../../../auth/ui/pages/RecoverPassword/RecoverPassword';
import ResetPassword from '../../../../auth/ui/pages/ResetPassword/ResetPassword';
import Profile from '../../../../auth/ui/pages/Profile/Profile';

// documents
import Documents from '../../../../documents/ui/pages/Documents/Documents';
import NewDocument from '../../../../documents/ui/pages/NewDocument/NewDocument';
import ViewDocument from '../../../../documents/ui/pages/ViewDocument/ViewDocument';
import EditDocument from '../../../../documents/ui/pages/EditDocument/EditDocument';

const handleResendVerificationEmail = (emailAddress) => {
  Meteor.call('users.sendVerificationEmail', (error) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      Bert.alert(`Check ${emailAddress} for a verification link!`, 'success');
    }
  });
};

const App = props => (
  <Router>
    {!props.loading ? <div className="App">
      {props.userId && !props.emailVerified ? <Alert className="verify-email text-center"><p>Hey friend! Can you <strong>verify your email address</strong> ({props.emailAddress}) for us? <Button bsStyle="link" onClick={() => handleResendVerificationEmail(props.emailAddress)} href="#">Re-send verification email</Button></p></Alert> : ''}
      <Navigation {...props} />
      <Grid>
        <Switch>
          <Route exact name="index" path="/" component={Index} />
          <Authenticated exact path="/documents" component={Documents} {...props} />
          <Authenticated exact path="/documents/new" component={NewDocument} {...props} />
          <Authenticated exact path="/documents/:_id" component={ViewDocument} {...props} />
          <Authenticated exact path="/documents/:_id/edit" component={EditDocument} {...props} />
          <Authenticated exact path="/profile" component={Profile} {...props} />
          <Public path="/signup" component={Signup} {...props} />
          <Public path="/login" component={Login} {...props} />
          <Route path="/logout" component={Logout} {...props} />
          <Route name="verify-email" path="/verify-email/:token" component={VerifyEmail} />
          <Route name="recover-password" path="/recover-password" component={RecoverPassword} />
          <Route name="reset-password" path="/reset-password/:token" component={ResetPassword} />
          <Route name="terms" path="/terms" component={Terms} />
          <Route name="privacy" path="/privacy" component={Privacy} />
          <Route name="examplePage" path="/example-page" component={ExamplePage} />
          <Route component={NotFound} />
        </Switch>
      </Grid>
      <Footer />
    </div> : ''}
  </Router>
);

App.defaultProps = {
  userId: '',
  emailAddress: '',
};

App.propTypes = {
  loading: PropTypes.bool.isRequired,
  userId: PropTypes.string,
  emailAddress: PropTypes.string,
  emailVerified: PropTypes.bool.isRequired,
};

const getUserName = name => ({
  string: name,
  object: `${name.first} ${name.last}`,
}[typeof name]);

export default createContainer(() => {
  const loggingIn = Meteor.loggingIn();
  const user = Meteor.user();
  const userId = Meteor.userId();
  const loading = !Roles.subscription.ready();
  const name = user && user.profile && user.profile.name && getUserName(user.profile.name);
  const emailAddress = user && user.emails && user.emails[0].address;

  return {
    loading,
    loggingIn,
    authenticated: !loggingIn && !!userId,
    name: name || emailAddress,
    roles: !loading && Roles.getRolesForUser(userId),
    userId,
    emailAddress,
    emailVerified: user && user.emails ? user && user.emails && user.emails[0].verified : true,
  };
}, App);

// meteor
import { Meteor } from 'meteor/meteor';

// react
import React from 'react';
import { render } from 'react-dom';

// app
import App from '../../ui/layouts/App/App';
import '../../ui/stylesheets/app.scss';

Meteor.startup(() => render(<App />, document.getElementById('react-root')));

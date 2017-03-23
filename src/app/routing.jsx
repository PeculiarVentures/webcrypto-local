import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { Router, Route, browserHistory } from 'react-router';
import Store from './store';
import { getTheme } from './components/theme';
import { RootContainer, CreateContainer } from './containers';

// Build for gh-pages
const href = window.location.href;
let basicRoutePath = '/';
if (href.indexOf('github.io') !== -1) {
  basicRoutePath = '//webcrypto-local';
}

export default class Routing extends Component {

  render() {
    return (
      <Provider store={Store}>
        <ThemeProvider theme={getTheme()}>
          <Router history={browserHistory}>
            <Route path={basicRoutePath} component={RootContainer} />
            <Route path="certificate/:id" component={RootContainer} />
            <Route path="create" component={CreateContainer} />
          </Router>
        </ThemeProvider>
      </Provider>
    );
  }
}

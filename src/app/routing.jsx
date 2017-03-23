import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { Router, Route, browserHistory } from 'react-router';
import Store from './store';
import { getTheme } from './components/theme';
import { RootContainer, CreateContainer } from './containers';
import { getAppPath } from './helpers';

export default class Routing extends Component {

  render() {
    return (
      <Provider store={Store}>
        <ThemeProvider theme={getTheme()}>
          <Router history={browserHistory}>
            <Route path={getAppPath()} component={RootContainer} />
            <Route path={`${getAppPath()}certificate/:id`} component={RootContainer} />
            <Route path={`${getAppPath()}create`} component={CreateContainer} />
          </Router>
        </ThemeProvider>
      </Provider>
    );
  }
}

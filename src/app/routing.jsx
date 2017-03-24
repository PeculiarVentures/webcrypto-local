import React, { PropTypes, Component } from 'react';
import { Provider } from 'react-redux';
import isMobile from 'ismobilejs';
import { ThemeProvider } from 'styled-components';
import { Router, Route, browserHistory } from 'react-router';
import Store from './store';
import { getTheme } from './components/theme';
import { RootContainer, CreateContainer } from './containers';
import { getAppPath, Network } from './helpers';

export default class Routing extends Component {

  static childContextTypes = {
    deviceType: PropTypes.string,
    network: PropTypes.object,
  };

  static getDeviceType() {
    let deviceType = 'desktop';

    if (isMobile.tablet) {
      deviceType = 'tablet';
    } else if (isMobile.phone) {
      deviceType = 'phone';
    }

    return deviceType;
  }

  getChildContext() {
    return {
      deviceType: Routing.getDeviceType(),
      network: Network.getContext(),
    };
  }

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

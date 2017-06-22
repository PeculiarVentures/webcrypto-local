import React, { PropTypes, Component } from 'react';
import { Provider } from 'react-redux';
import isMobile from 'ismobilejs';
import { ThemeProvider } from 'styled-components';
import { Router, Route, browserHistory } from 'react-router';
import Store from './store';
import { getTheme } from './components/theme';
import { RootContainer, CreateContainer } from './containers';
import { getAppPath } from './helpers';
// import { RoutingController } from './controllers';
// import { AppActions } from './actions/state';

export default class Routing extends Component {

  static childContextTypes = {
    deviceType: PropTypes.string,
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
    };
  }

  // constructor() {
  //   super();
  //   window.onpopstate = ::this.processRouteAction;
  //   const pathname = window.location.pathname;
  //   const search = window.location.search;
  //   this.prevRoute = `${pathname}${search}`;
  // }
  //
  // shouldComponentUpdate() {
  //   return false;
  // }

  // processRouteAction() {
  //   const pathname = window.location.pathname;
  //   const search = window.location.search;
  //
  //   if (this.prevRoute && this.prevRoute !== `${pathname}${search}`) {
  //     const routingData = RoutingController.parseInitState(pathname, search);
  //     if (routingData) {
  //       Store.dispatch(AppActions.fromRoute(routingData));
  //     }
  //   }
  //   this.prevRoute = `${pathname}${search}`;
  // }

  render() {
    return (
      <Provider store={Store}>
        <ThemeProvider theme={getTheme()}>
          <Router history={browserHistory}>
            <Route path={getAppPath()} component={RootContainer} />
            <Route path={`${getAppPath()}certificate/:id`} component={RootContainer} />
            <Route path={`${getAppPath()}request/:id`} component={RootContainer} />
            <Route path={`${getAppPath()}key/:id`} component={RootContainer} />
            <Route path={`${getAppPath()}create`} component={CreateContainer} />
          </Router>
        </ThemeProvider>
      </Provider>
    );
  }
}

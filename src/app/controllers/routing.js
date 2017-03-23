import { browserHistory } from 'react-router';

const RoutingController = {
  push: (path) => {
    browserHistory.push(path);
  },
  goBack: () => {
    browserHistory.goBack();
  },
};

export default RoutingController;

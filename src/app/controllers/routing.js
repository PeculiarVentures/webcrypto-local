import { browserHistory } from 'react-router';
import { getAppPath } from '../helpers';

const RoutingController = {
  push: (path) => {
    browserHistory.push(`${getAppPath()}${path}`);
  },
  goBack: () => {
    browserHistory.goBack();
  },
};

export default RoutingController;

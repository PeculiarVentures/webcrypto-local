// import { browserHistory } from 'react-router';
// import { getAppPath } from '../helpers';
//
// const RoutingController = {
//   push: (path) => {
//     browserHistory.push(`${getAppPath()}${path}`);
//   },
//   goBack: () => {
//     browserHistory.goBack();
//   },
// };
//
// export default RoutingController;

import { State } from 'quantizer';
import { browserHistory } from 'react-router';
import { getAppPath, parseSearch } from '../helpers';
// import { ACTIONS_CONST } from '../constants';

class RoutingController extends State.Map {

  static go(path) {
    browserHistory.push(`${getAppPath()}${path}`);
  }

  constructor() {
    super({
      certificate: false,
      key: false,
      request: false,
      params: {
        provider: false,
      },
    });

    this.acceptedParams = ['provider'];
    this.parseInitState(
      window.location.pathname,
      window.location.search,
    );
    this.find('params').merge(this.filterParams(this.initialState.params));
  }

  filterParams(params) {
    const res = {};
    Object.keys(params).map((key) => {
      if (this.acceptedParams.indexOf(key) !== -1) {
        res[key] = params[key];
      }
      return key;
    });
    return res;
  }

  changeFromState(state) {
    this.set({
      certificate: false,
      key: false,
      request: false,
      params: this.get('params'),
    });
    const providers = state.find('providers');
    const selectedProvider = providers.where({ selected: true });

    if (selectedProvider) {
      this.merge({ params: { provider: selectedProvider.get().id } });
    }

    return this.compose();
  }

  compose() {
    // console.log(this.get());
    // const provider = this.get('provider');
    // if (provider) {
    //   this.pushChunk(`/provider/${request}`);
    //   return this.getPath();
    // }
    return `${this.joinParams()}`;
  }

  joinParams() {
    let params = '';
    const obj = this.get('params');
    Object.keys(obj).map((key) => {
      if (obj[key]) {
        params += params ? '&' : '?';
        params += `${key}=${obj[key]}`;
      }
      return true;
    });
    return params;
  }

  middleware() {
    return (store) => (next) => (payload) => {
      next(payload);
      let res = this.changeFromState(store.getState());
      // if (payload.type === ACTIONS_CONST.PROVIDER_SELECT) {
      // res = this.changeFromState(store.getState());
      // }
      RoutingController.go(res);
      return true;
    };
  }

  parseInitState(k, path) {
    const initWith = k.split('/');
    initWith.splice(0, 1);
    const result = { params: {} };
    result.params = parseSearch(path);
    // console.log(result);
    // if (initWith[0] === 'request') {
    //   result.request = initWith[1] ? initWith[1] : null;
    //   result.document = initWith[2] ? initWith[1] : null;
    // }
    // if (initWith[0] === 'envelope') {
    //   result.envelope = initWith[1] ? initWith[1] : null;
    //   result.document = initWith[2] ? initWith[2] : null;
    // }
    // if (initWith[0] === 'document') {
    //   result.document = initWith[1] ? initWith[1] : null;
    // }
    this.initialState = result;
    return result;
  }

}

export default new RoutingController();

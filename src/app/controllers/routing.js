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
      create: false,
      chuncks: [],
      params: {
        provider: false,
      },
    });

    this.acceptedParams = ['provider'];
    this.parseInitState(
      window.location.pathname,
      window.location.search,
    );
    this.merge(this.initialState);
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
      chuncks: [],
      certificate: false,
      key: false,
      request: false,
      create: this.get('create'),
      params: this.get('params'),
    });
    const providers = state.find('providers');
    const create = state.find('create');
    const selectedProvider = providers.where({ selected: true });

    if (selectedProvider) {
      this.merge({
        params: {
          provider: selectedProvider.get().id,
        },
      });

      const items = selectedProvider.find('items');
      const selectedItem = items.where({ selected: true });

      if (selectedItem) {
        const item = selectedItem.get();
        this.merge({
          [`${item.type}`]: item.id,
        });
      }
    }

    if (create.get()) {
      this.merge({
        create: true,
      });
    } else {
      this.merge({
        create: false,
      });
    }

    return this.compose();
  }

  compose() {
    this.merge({ chuncks: [] });
    const certificate = this.get('certificate');
    const request = this.get('request');
    const key = this.get('key');
    const create = this.get('create');

    if (create) {
      this.pushChunk('create');
      return this.getPath();
    }
    if (certificate) {
      this.pushChunk(`certificate/${certificate}`);
      return this.getPath();
    }
    if (request) {
      this.pushChunk(`request/${request}`);
      return this.getPath();
    }
    if (key) {
      this.pushChunk(`key/${key}`);
      return this.getPath();
    }

    return `${this.joinParams()}`;
  }

  getPath() {
    return `${this.joinPath()}${this.joinParams()}`;
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

  joinPath() {
    return this
      .get('chuncks')
      .join('');
  }

  middleware() {
    return store => next => (payload) => {
      next(payload);
      const res = this.changeFromState(store.getState());
      RoutingController.go(res);
      return true;
    };
  }

  pushChunk(str) {
    this
      .find('chuncks')
      .push(str);

    return this;
  }

  parseInitState(k, path) {
    const initWith = k.split('/');
    initWith.splice(0, 1);
    const result = { params: {} };
    result.params = parseSearch(path);
    if (initWith[0] === 'create') {
      result.create = true;
    }
    if (initWith[0] === 'certificate') {
      result.certificate = initWith[1] ? initWith[1] : null;
    }
    if (initWith[0] === 'request') {
      result.request = initWith[1] ? initWith[1] : null;
    }
    if (initWith[0] === 'key') {
      result.key = initWith[1] ? initWith[1] : null;
    }
    this.initialState = result;
    return result;
  }

}

export default new RoutingController();

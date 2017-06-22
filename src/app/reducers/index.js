import { AppStateModel } from '../state';
import { compose } from '../helpers';
import * as State from './state';
import * as UI from './ui';

const All = { ...State, ...UI };

const composed = compose(...Object.keys(All).map(key => All[key]));

export default (state = new AppStateModel(), payload) => composed(state, payload);

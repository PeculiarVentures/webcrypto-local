import { createStore, applyMiddleware, compose } from 'redux';
import { AppStateModel } from './state';
import RootReducer from './reducers';
import { AppMiddleware } from './middlewares';

const composeEnhancers = compose;

export default createStore(RootReducer, new AppStateModel(), composeEnhancers(applyMiddleware(
  AppMiddleware,
)));

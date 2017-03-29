import createSagaMiddleware from 'redux-saga';
import { createStore, applyMiddleware, compose } from 'redux';
import { AppStateModel } from './state';
import RootReducer from './reducers';
import { AppMiddleware } from './middlewares';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();
const composeEnhancers = compose;

export default createStore(RootReducer, new AppStateModel(), composeEnhancers(applyMiddleware(
  AppMiddleware,
  sagaMiddleware,
)));

sagaMiddleware.run(rootSaga);

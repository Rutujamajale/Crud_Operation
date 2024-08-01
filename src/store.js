import { createStore, combineReducers } from 'redux';
import customerReducer from './customerReducer';

const rootReducer = combineReducers({
  customers: customerReducer,
});

const store = createStore(rootReducer);

export default store;

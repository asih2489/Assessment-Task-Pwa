import { createStore, combineReducers, applyMiddleware } from "redux";
import logger from 'redux-logger'
import cart from "./reducers/cart";

const initialState = {
  cart: []
};

const reducer = combineReducers({
  cart,
});

export const initializeStore = (preloadedState = initialState) => {
  return createStore(reducer, preloadedState, applyMiddleware(logger));
};

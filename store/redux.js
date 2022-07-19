import { createConnect, createStore } from '../utils/redux.js';

const INITIAL_STATE = {
  origin: 'Worka, Ethiopia',
  roaster: 'Madcap Coffee Company',
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'UPDATE_FORM':
      return { ...state, ...payload };
    default:
      return state;
  }
};

export const store = createStore(reducer, INITIAL_STATE);
export const connect = createConnect(store);

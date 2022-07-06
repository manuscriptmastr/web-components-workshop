import { createConnect, createStore } from '../utils/store.js';

export const store = createStore({
  origin: 'Worka, Ethiopia',
  roaster: 'Madcap Coffee Company',
});

export const { update } = store;

export const connect = createConnect(store);

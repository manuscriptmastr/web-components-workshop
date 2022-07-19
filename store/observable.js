import { BehaviorSubject } from 'https://unpkg.com/rxjs@7.5.5/dist/esm/internal/BehaviorSubject.js';
import { persist } from '../utils/persistence.js';

const form$ = new BehaviorSubject({
  origin: 'Worka, Ethiopia',
  roaster: 'Madcap Coffee Company',
});

export const formStore = persist(sessionStorage, 'form', form$);

const settings$ = new BehaviorSubject({
  inputColor: 'green',
  labelColor: 'blue',
});

export const settingsStore = persist(localStorage, 'settings', settings$);

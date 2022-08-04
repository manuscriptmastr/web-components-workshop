import { BehaviorSubject } from 'https://unpkg.com/rxjs@7.5.5/dist/esm/internal/BehaviorSubject.js';
import { persist } from '../utils/persistence.js';

export const formStore = persist(
  sessionStorage,
  'form',
  new BehaviorSubject({
    origin: 'Worka, Ethiopia',
    roaster: 'Madcap Coffee Company',
  })
);

export const settingsStore = persist(
  localStorage,
  'settings',
  new BehaviorSubject({
    inputColor: 'green',
    labelColor: 'blue',
  })
);

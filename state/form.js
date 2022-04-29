import { atom } from '../utils/atom.js';
import { persist } from '../utils/persistence.js';

export const FormState = persist(
  { key: 'form' },
  atom({
    origin: '',
    roaster: '',
  })
);

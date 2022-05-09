import { BehaviorSubject } from 'https://unpkg.com/rxjs@7.5.5/dist/esm/internal/BehaviorSubject.js';
import { persist } from '../utils/persistence.js';

const FormState$ = new BehaviorSubject({ origin: '', roaster: '' });
FormState$.toString = () => 'FORM_STATE';

export const FormState = persist(localStorage, FormState$);

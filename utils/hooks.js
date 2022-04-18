const elementQueue = new Map();

let elementKey;
let hookKey;

export const set = (key, element) => elementQueue.set(key, element);
export const unset = (key) => elementQueue.delete(key);
export const focus = (key) => {
  elementKey = key;
  hookKey = -1;
};
export const unfocus = () => {
  elementKey = undefined;
  hookKey = undefined;
};
const getCurrentElement = () => {
  if (elementKey === undefined || !elementQueue.has(elementKey)) {
    throw new Error(`Cannot find element "${elementKey}"`);
  }
  return elementQueue.get(elementKey);
};

export const useState = (initialValue) => {
  hookKey++;
  const KEY = hookKey;
  const element = getCurrentElement();
  if (!element.state.hasOwnProperty(KEY)) {
    element.constructor.createState(element, KEY, initialValue);
  }
  return [element.state[KEY], (newValue) => (element.state[KEY] = newValue)];
};

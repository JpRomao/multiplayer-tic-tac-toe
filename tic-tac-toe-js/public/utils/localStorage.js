export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

export function setLocalStorage(key, value) {
  localStorage.setItem(key, value);
}

export function removeLocalStorage(key) {
  localStorage.removeItem(key);
}

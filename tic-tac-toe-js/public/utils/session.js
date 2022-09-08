export function setSession(key, value) {
  sessionStorage.setItem(key, JSON.stringify(value));
}

export function getSession(key) {
  if (sessionExists) {
    return JSON.parse(sessionStorage.getItem(key));
  }

  return null;
}

export function removeSession(key) {
  sessionStorage.removeItem(key);
}

export function clearSession() {
  sessionStorage.clear();
}

function sessionExists(key) {
  return getSession(key) !== null;
}

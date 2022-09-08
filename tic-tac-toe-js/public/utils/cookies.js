export function setCookie(cookieName, cookieValue, daysToExpire = 365) {
  var date = new Date();

  date.setTime(date.getTime() + daysToExpire * 24 * 60 * 60 * 1000);

  document.cookie =
    cookieName + "=" + cookieValue + "; expires=" + date.toGMTString();
}

export function getCookie(cookieName) {
  const name = cookieName + "=";
  const allCookieArray = document.cookie.split(";");

  for (let i = 0; i < allCookieArray.length; i++) {
    const temp = allCookieArray[i].trim();

    if (temp.indexOf(name) == 0)
      return temp.substring(name.length, temp.length);
  }

  return "";
}

export function deleteCookie(cookieName) {
  document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
}

export function checkCookieExists(cookieName) {
  const user = getCookie(cookieName);

  if (user != "") {
    return true;
  } else {
    return false;
  }
}

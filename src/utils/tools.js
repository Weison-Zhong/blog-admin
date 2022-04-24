import { isArray } from "./is";
function getUrlParams(url = window.location.href) {
  if (!url.includes("?")) return;
  const theRequest = {};
  const params = url.split("?")[1];
  const str = params.split("&");
  for (let i = 0; i < str.length; i++) {
    theRequest[str[i].split("=")[0]] = encodeURI(str[i].split("=")[1]);
  }
  return theRequest;
}

function getFlattenChildrenMenuList(parentMenusArr) {
  if (!isArray(parentMenusArr)) return;
  const childrenArr = parentMenusArr.map((item) => item.children);
  const flattenChildMenus = [];
  childrenArr.forEach((item) => flattenChildMenus.push(...item));
  return flattenChildMenus;
}
// 引入js
function loadJS(url, callback) {
  const script = document.createElement("script");
  const fn = callback || function () {};
  script.type = "text/javascript";
  script.onload = function () {
    fn();
  };
  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
}
// 引入css
function loadCSS(url) {
  const link = document.createElement("link");
  link.setAttribute("rel", "stylesheet");
  link.setAttribute("type", "text/css");
  link.setAttribute("href", url);
  const heads = document.getElementsByTagName("head");
  if (heads.length) heads[0].appendChild(link);
}

export { getUrlParams, getFlattenChildrenMenuList, loadCSS, loadJS };

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

export { getUrlParams, getFlattenChildrenMenuList };

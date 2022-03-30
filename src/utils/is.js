export function isArray(val) {
  return Object.prototype.toString.call(val) === "[object Array]";
}
export function isObject(val) {
  return Object.prototype.toString.call(val) === "[object Object]";
}
export function isString(val) {
  return Object.prototype.toString.call(val) === "[object String]";
}

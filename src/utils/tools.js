function queryURLParams(url) {
  let pattern = /(\w+)=(\w+)/gi; //定义正则表达式
  let parames = {}; // 定义参数对象
  url.replace(pattern, ($, $1, $2) => {
    parames[$1] = $2;
  });
  return parames;
}

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

export { getUrlParams };

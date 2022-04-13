// 封装函数queryURLParams
// @params:url
// @return:参数
// function queryURLParams(url) {
//   let askIn = url.indexOf("?"),
//     wellIn = url.indexOf("#"),
//     askText = "",
//     wellText = "";
//   // #不存在
//   wellIn === -1 ? (wellIn = url.length) : null;
//   // ?存在
//   askIn >= 0 ? (askText = url.substring(askIn + 1, wellIn)) : null;
//   wellText = url.substring(wellIn + 1);
//   let result = {};
//   wellText !== "" ? (result["HASH"] = wellText) : null;
//   if (askText !== "") {
//     let ary = askText.split("&");
//     ary.forEach((item) => {
//       let aryText = item.split("=");
//       result[aryText[0]] = aryText[1];
//     });
//   }
//   return result;
// }

// export { queryURLParams };

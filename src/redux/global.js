import { UPDATE_USERINFO, UPDATE_MENUS } from "./actionTypes";
const userInfo = localStorage.getItem("userInfo");
const menus = localStorage.getItem("menus");
const initialState = {
  userInfo: userInfo
    ? JSON.parse(userInfo)
    : {
        userName: "未知用户",
        avatar: "",
      },
  menus: menus ? JSON.parse(menus) : [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case UPDATE_USERINFO: {
      const userInfo = action.payload || {};
      //数据持久化
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      return {
        ...state,
        userInfo,
      };
    }
    case UPDATE_MENUS: {
      const menus = action.payload || {};
      //数据持久化
      localStorage.setItem("menus", JSON.stringify(menus));
      setTimeout(() => {
        window.location.reload();
      }, 0);
      return {
        ...state,
        menus,
      };
    }
    default:
      return state;
  }
}

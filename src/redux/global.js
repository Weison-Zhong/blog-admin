const initialState = {
  userInfo: {
    name: "weison1",
    avatar:
      "https://img0.baidu.com/it/u=2314600222,1003014148&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",
  },
};

export default function (state = initialState, action) {
  switch (action.type) {
    // case UPDATE_ROLELIST: {
    //     const roleList = action.payload || [];
    //     //数据持久化
    //     sessionStorage.setItem("roleList", JSON.stringify(roleList));
    //     return {
    //         ...state,
    //         roleList,
    //     };
    // }
    default:
      return state;
  }
}

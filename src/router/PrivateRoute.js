import { message } from "antd";
import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
let authenticate = () => {
  const token = localStorage.getItem("WeisonToken");
  return token ? true : false;
};
const PrivateRoute = ({ component: Component, ...rest }) => {
  useEffect(() => {
    if (authenticate()) return;
    message.warning("请先登录");
  });
  return (
    <Route
      {...rest}
      render={(props) =>
        authenticate() ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location },
            }}
          />
        )
      }
    ></Route>
  );
};

export default PrivateRoute;

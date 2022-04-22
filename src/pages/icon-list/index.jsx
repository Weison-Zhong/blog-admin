import React, { Component } from "react";
import "./index.less";
const icons = [
  {
    name: "name",
    key: "icon-xiangyou1",
  },
  {
    name: "name",
    key: "icon-xiangyou1",
  },
  {
    name: "name",
    key: "icon-xiangyou1",
  },
  {
    name: "name",
    key: "icon-xiangyou1",
  },
  {
    name: "name",
    key: "icon-xiangyou1",
  },
  {
    name: "name",
    key: "icon-xiangyou1",
  },
  {
    name: "name",
    key: "icon-xiangyou1",
  },
  {
    name: "name",
    key: "icon-xiangyou1",
  },
  {
    name: "name",
    key: "icon-xiangyou1",
  },
  {
    name: "name",
    key: "icon-xiangyou1",
  },
  {
    name: "name",
    key: "icon-xiangyou1",
  },
  {
    name: "name",
    key: "icon-xiangyou1",
  },
  {
    name: "name",
    key: "icon-xiangyou1",
  },
  {
    name: "name",
    key: "icon-xiangyou1",
  },
  {
    name: "name",
    key: "icon-xiangyou1",
  },
  {
    name: "name",
    key: "icon-xiangyou1",
  },
  {
    name: "name",
    key: "icon-xiangyou1",
  },
  {
    name: "name",
    key: "icon-xiangyou1",
  },
  {
    name: "name",
    key: "icon-xiangyou1",
  },
];
export default class IconList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowMenu: false,
    };
  }
  handleLiHover(){
    this.setState({
      isShowMenu:true
    })
  }
  render() {
    const { isShowMenu } = this.state;
    return (
      <div className="icon-list"> 
        <ul>
          {icons.map((item) => {
            const { name, key } = item;
            return (
              <li key={key} onMouseEnter={this.handleLiHover.bind(this)}>
                {isShowMenu ? (
                  <IconMenu item={item} />
                ) : (
                  <IconItem item={item} />
                )}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

function IconMenu(props) {
  const { name, key } = props.item;
  return (
    <>
      <div>{name}</div>
    </>
  );
}

function IconItem(props) {
  const { name, key } = props.item;
  return (
    <>
      <i className={`iconfont ${key}`}></i>
      <span>{name}</span>
      <span>{key}</span>
    </>
  );
}

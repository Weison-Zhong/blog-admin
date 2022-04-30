import React, { Component } from "react";
import "./index.less";
import * as echarts from "echarts";
let chart1 = null;
export default class SystemStatus extends Component {
  constructor(props) {
    super(props);
    this.chart1Ref = React.createRef();
    this.state = {};
  }
  initChart1 = () => {
    const { current } = this.chart1Ref || {};
    if (typeof current === "undefined") return;
    chart1 = echarts.init(current);
    const option = {
      xAxis: {
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: [120, 200, 150, 80, 70, 110, 130],
          type: "bar",
        },
      ],
    };
    chart1.setOption(option);
  };
  componentDidMount() {
    this.initChart1();
  }
  render() {
    return (
      <div className="system-status">
        <div ref={this.chart1Ref} className="echart-container"></div>
      </div>
    );
  }
}

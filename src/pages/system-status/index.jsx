import React, { Component } from "react";
import "./index.less";
import { getGuestStatisticsApi } from "@/axios/api";
import * as echarts from "echarts";
let chart1 = null;
const chart1Data = {
  xData: Array(12).fill("2022"),
  yData: Array(12).fill(0),
};
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
        data: chart1Data.xData,
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: chart1Data.yData,
          type: "bar",
        },
      ],
    };
    chart1.setOption(option);
  };
  fetchData = async () => {
    const res = await getGuestStatisticsApi();
    const { code, data } = res || {};
    if (code !== 200) return;
    const {
      guestCityList,
      newGuestTrendList,
      todayNewGuestCount,
      todayAccssCount,
      totalAccessCount,
      totalGuestCount,
    } = data;
  };
  componentDidMount() {
    this.fetchData();
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

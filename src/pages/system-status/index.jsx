import React, { Component } from "react";
import "./index.less";
import { connect } from "react-redux";
import { getGuestStatisticsApi } from "@/axios/api";
import { UserOutlined, SwapOutlined } from "@ant-design/icons";
import * as echarts from "echarts";
let chart1 = null,
  chart2 = null,
  echartTimer = null, //饼图定时切换
  timer = null; //时间显示刷新
const weeks = [
  "星期日",
  "星期一",
  "星期二",
  "星期三",
  "星期四",
  "星期五",
  "星期六",
];
const chart1Data = {
  xData: Array(12).fill("2020-06"),
  yData: Array(12).fill(0),
};
let chart2Data = [
  { value: 0, name: "广州" },
  { value: 0, name: "深圳" },
  { value: 0, name: "佛山" },
  { value: 0, name: "东莞" },
  { value: 0, name: "珠海" },
  { value: 0, name: "其他" },
];
function tooltipFormatter({ unit, unitMap, params, indicator }) {
  if (Array.prototype.isPrototypeOf(params)) {
    let relVal = `<div>${params[0].axisValue}<br/>`;
    for (const data of params) {
      if (data.seriesName) {
        relVal += `${data.marker}${data.seriesName}&nbsp;&nbsp;&nbsp;&nbsp${
          data.value
        } ${unit || unitMap[data.seriesName]}<br/>`;
      }
    }
    relVal += "</div>";
    return relVal;
  } else {
    if (params.seriesType === "pie") {
      let htmlPie = `<div>`;
      htmlPie += `${params.marker} ${params.name}<br/>${params.value || "0"}${
        params.unit || unit || ""
      }<br/></div>`;
      return htmlPie;
    } else {
      let html = `<div>${params.name}<br/>`;
      indicator.forEach((item, index) => {
        html +=
          params.marker +
          item.name +
          "&nbsp;&nbsp;&nbsp;&nbsp;" +
          params.value[index] +
          unitMap[params.name] +
          "<br/>";
      });
      html += "</div>";
      return html;
    }
  }
}
class SystemStatus extends Component {
  constructor(props) {
    super(props);
    this.chart1Ref = React.createRef();
    this.chart2Ref = React.createRef();
    this.state = {
      guestData: {},
      timeStr: "",
    };
  }
  getNowStr = () => {
    const now = new Date();
    const day = now.getDay();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const week = weeks[day];
    let hour = now.getHours();
    let minute = now.getMinutes();
    let welcomeStr = "";
    if (hour < 3) {
      welcomeStr = "深夜了,早点休息了哈";
    } else if (hour < 6) {
      welcomeStr = "凌晨了,注意休息哈";
    } else if (hour < 9) {
      welcomeStr = "早上好";
    } else if (hour < 12) {
      welcomeStr = "上午好";
    } else if (hour < 15) {
      welcomeStr = "中午好";
    } else if (hour < 18) {
      welcomeStr = "下午好";
    } else if (hour < 20) {
      welcomeStr = "傍晚啦";
    } else {
      welcomeStr = "晚上好";
    }
    if (hour < 10) {
      hour = `0${hour}`;
    }
    if (minute < 10) {
      minute = `0${minute}`;
    }
    const formatText = `${welcomeStr},现在是${year}年${month}月${date}日 ${hour}:${minute} ${week}`;
    this.setState({ timeStr: formatText });
  };
  initChart1 = () => {
    const { current } = this.chart1Ref || {};
    if (typeof current === "undefined") return;
    chart1 = echarts.init(current);
    const option = {
      title: {
        text: "近一年新增访客数量",
        textStyle: {
          color: "#343844",
          fontSize: 15,
        },
      },
      xAxis: {
        type: "category",
        interval: 1,
        axisLabel: {
          show: true,
        },
        axisTick: {
          show: false,
        },
        data: chart1Data.xData,
      },
      yAxis: {
        type: "value",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        backgroundColor: "rgba(6, 47, 96, 0.8)",
        borderWidth: 0, // 提示框浮层的边框宽。
        textStyle: {
          // 提示框浮层的文本样式。
          color: "#fff",
          fontSize: 14,
        },
        confine: true,
        formatter: (params) => {
          return tooltipFormatter({ unit: "人", params });
        },
      },
      series: [
        {
          name: "新增访客",
          data: chart1Data.yData,
          type: "bar",
          label: {
            show: true,
            position: "top",
            color: "#000",
          },
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(4, 54, 141, 1)",
                },
                {
                  offset: 1,
                  color: "rgba(99, 178, 243, 1)",
                },
              ]),
            },
          },
        },
      ],
    };
    chart1.setOption(option);
  };

  initChart2() {
    const { current } = this.chart2Ref || {};
    let { totalGuestCount } = this.state.guestData;
    totalGuestCount || (totalGuestCount = 0);
    if (typeof current === "undefined") return;
    chart2 = echarts.init(current);
    const option = {
      tooltip: {
        trigger: "item",
        axisPointer: {
          type: "shadow",
        },
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        borderWidth: 0, // 提示框浮层的边框宽。
        // padding: this.$store.state.fontSize * 0.02, // 提示框浮层内边距，
        textStyle: {
          // 提示框浮层的文本样式。
          color: "#fff",
          fontSize: 14,
        },
        formatter: (params) => {
          params.unit = "人";
          return tooltipFormatter({ params });
        },
      },
      legend: {
        icon: "circle",
        bottom: "0%",
      },
      title: [
        {
          //eslint-disable-next-line no-useless-concat
          text: "{name|" + "访客总数" + "}\n{val|" + totalGuestCount + "}",
          top: "center",
          left: "center",
          textStyle: {
            rich: {
              name: {
                fontSize: 15,
                fontWeight: "normal",
                color: "#000",
                padding: [10, 0],
              },
              val: {
                fontSize: 26,
                fontWeight: "bolder",
                color: "#000",
              },
            },
          },
        },
        {
          text: "访客城市分布",
          textStyle: {
            color: "#343844",
            fontSize: 15,
          },
        },
      ],
      series: [
        {
          name: "",
          aria: {
            enabled: true,
          },
          type: "pie",
          radius: ["30%", "60%"],
          center: ["50%", "50%"],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: true,
              formatter: "{d}% ",
              textStyle: {
                fontSize: 12,
                color: "#666",
              },
            },
          },
          labelLine: {
            normal: {
              lineStyle: {
                color: "#5281B3",
              },
              length: 15,
            },
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 12,
            },
          },
          data: chart2Data,
        },
      ],
    };
    let indexBar = 0; //播放所在下标
    echartTimer = setInterval(function () {
      chart2.dispatchAction({
        type: "downplay",
        seriesIndex: 0,
      });
      chart2.dispatchAction({
        type: "highlight",
        seriesIndex: 0,
        dataIndex: indexBar % option.series[0].data.length,
      });
      chart2.dispatchAction({
        type: "showTip",
        seriesIndex: 0,
        dataIndex: indexBar % option.series[0].data.length,
      });
      indexBar++;
    }, 5000);
    chart2.on("mouseover", function (params) {
      indexBar = params.dataIndex;
      chart2.dispatchAction({
        type: "downplay",
        seriesIndex: 0,
      });
      chart2.dispatchAction({
        type: "showTip",
        seriesIndex: 1,
        dataIndex: indexBar % option.series[0].data.length,
      });
      chart2.dispatchAction({
        type: "highlight",
        seriesIndex: 1,
        dataIndex: indexBar % option.series[0].data.length,
      });
    });
    chart2.on("mouseout", function (params) {
      indexBar = params.dataIndex;
      chart2.dispatchAction({
        type: "downplay",
        seriesIndex: 0,
      });
      chart2.dispatchAction({
        type: "showTip",
        seriesIndex: 1,
        dataIndex: indexBar % option.series[0].data.length,
      });
      chart2.dispatchAction({
        type: "highlight",
        seriesIndex: 1,
        dataIndex: indexBar % option.series[0].data.length,
      });
    });
    chart2.setOption(option);
  }
  fetchData = async () => {
    const res = await getGuestStatisticsApi();
    const { code, data } = res || {};
    if (code !== 200) return;
    const {
      guestCityList,
      newGuestTrendList,
      todayAccssCount,
      totalAccessCount,
      totalGuestCount,
    } = data;
    const guestData = {
      todayAccssCount,
      totalAccessCount,
      totalGuestCount,
    };
    this.setState({ guestData });
    chart1Data.xData = [];
    chart1Data.yData = [];
    newGuestTrendList.forEach((item) => {
      const { year, month, count } = item || {};
      chart1Data.xData.push(`${year}-${month}`);
      chart1Data.yData.push(count);
    });
    this.initChart1();
    chart2Data = [];
    guestCityList.sort((a, b) => b.count - a.count);
    const others = guestCityList.splice(6);
    guestCityList.forEach((item) => {
      const { city, count } = item || {};
      if (!city) return; //接口返回太多查询ip地址失败的先不展示,后续考虑切换查询方式
      chart2Data.push({
        name: city,
        value: count || 0,
      });
    });

    if (others.length) {
      let othersTotal = 0;
      others.forEach((item) => (othersTotal += item.count));
      chart2Data.push({
        name: "其他",
        value: othersTotal,
      });
    }
    this.initChart2();
  };
  componentDidMount() {
    timer = setInterval(() => {
      this.getNowStr();
    }, 1000);
    this.fetchData();
    this.initChart1();
    this.initChart2();
  }
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
    echartTimer && clearInterval(echartTimer);
    timer && clearInterval(timer);
  }
  render() {
    const { todayAccssCount, totalAccessCount } = this.state.guestData;
    const { userInfo } = this.props;
    return (
      <div className="system-status">
        <div className="top">
          <div>
            <h6>欢迎，{userInfo && userInfo.userName}</h6>
            <h5>{this.state.timeStr}</h5>
          </div>
          <ul>
            <li>
              <UserOutlined />
              访问总数:({totalAccessCount})
            </li>
            <li>
              <SwapOutlined />
              今日流量:({todayAccssCount})
            </li>
          </ul>
        </div>
        <div className="echarts-wrapper">
          <div ref={this.chart1Ref} className="echart-container"></div>
          <div ref={this.chart2Ref} className="echart-container"></div>
        </div>
        <footer>
          <a
            href="https://github.com/Weison-Zhong"
            target="_blank"
            rel="noreferrer"
          >
            github
          </a>
        </footer>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  userInfo: state.global.userInfo,
});

export default connect(mapStateToProps)(SystemStatus);

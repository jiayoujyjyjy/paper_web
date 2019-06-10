<template>
  <div class="overviewPage">
    <div class="left">
      <div class="left_top" @click="fullscreen">
        <div class="left_top_left">
          <div id="incomePie"></div>
          <div class="incomePieTable">
            <thead>
              <tr>
                <th></th>
                <th>金额</th>
                <th>交易笔数</th>
              </tr>
            </thead>
            <tr>
              <td>
                <div class="tdDiv">
                  <div style="width:13px;height:13px;background-color:#15d0c1;border-radius:3px;margin-right:5px;"></div>
                  <span>在线支付</span>
                </div>
              </td>
              <td>10.00元</td>
              <td>2笔</td>
            </tr>
            <tr>
              <td>
                <div class="tdDiv">
                  <div style="width:13px;height:13px;background-color:#fd853d;border-radius:3px;margin-right:5px;"></div>
                  <span>广告收益</span>
                </div>
              </td>
              <td>10.00元</td>
              <td>--</td>
            </tr>
            <tr>
              <td>
                <div class="tdDiv">
                  <div style="width:13px;height:13px;background-color:#fff;border-radius:3px;margin-right:5px;"></div>
                  <span>总收益</span>
                </div>
              </td>
              <td>20.00元</td>
              <td>--</td>
            </tr>
          </div>
        </div>
        <div class="left_top_right">
          <div style="margin:40px 0;">
            <div style="line-height:20px">实时在线率</div>
            <div style="font-size:20px;font-weight:700;">66.7%</div>
          </div>
          <div class="general">
            <div>
              <div class="general_text">设备总数</div>
              <div style="font-size:16px">6</div>
            </div>
            <div>
              <div class="general_text">离线</div>
              <div style="color:red;font-size:16px">2</div>
            </div>
          </div>
        </div>
      </div>
      <div class="left_bottom">
        <div style="font-weight:bold;text-align:left;margin:10px 0 0 15px;">近30天收益分布Top10</div>
        <el-radio-group v-model="radio_left" size="small" @change="changeRadio">
          <el-radio-button label="场地"></el-radio-button>
          <el-radio-button label="设备"></el-radio-button>
        </el-radio-group>
        <div style="display: -webkit-flex;display: flex;flex-wrap: nowrap;justify-content: center">
          <el-button type="text" size="small" class="activeBt" @click="rankBt_active" v-show="rankActive">排行</el-button>
          <div class="inactiveBt"><el-button type="text" size="small" @click="rankBt_inactive" v-show="!rankActive">排行</el-button></div>
          <el-button type="text" size="small" class="activeBt" @click="trendBt_active" v-show="trendActive">趋势</el-button>
          <div class="inactiveBt"><el-button type="text" size="small" @click="trendBt_inactive" v-show="!trendActive">趋势</el-button></div>
        </div>
        <div id="diagram_left"></div>
      </div>
    </div>
    <div class="right">
      <div class="right_top">
        <div class="right_top_left">
          <div style="margin:40px 0;">
            <div style="line-height:20px">近90天顾客
              <el-popover
                placement="bottom-start"
                width="120"
                trigger="hover">
                <div>
                  <div>新顾客</div>
                  <div style="font-size:12px;">近90天初次购买你商品</div>
                  <div>老顾客</div>
                  <div style="font-size:12px;">近90天不止一次购买你商品的用户</div>
                </div>
                <el-button style="padding:0px;" slot="reference" type="text" size="medium" icon="el-icon-question"></el-button>
              </el-popover>
            </div>
            <div style="font-size:20px;font-weight:700;">0</div>
          </div>
          <div class="general">
            <div>
              <div class="general_text">新顾客</div>
              <div style="color:#67C23A;font-size:16px">0</div>
            </div>
            <div>
              <div class="general_text">老顾客</div>
              <div style="font-size:16px">0</div>
            </div>
          </div>
        </div>
        <div class="right_top_right">
          <div class="right_top_right_div">
            <span class="right_top_right_title">用户数</span>
            <div>
              <div class="right_top_right_progress">
                <div class="right_top_right_progress_left"></div>
                <div class="right_top_right_progress_right"></div>
              </div>
              <div style="margin-top:5px;">
                <div style="float:left">20%</div>
                <div style="float:right">20%</div>
              </div>
            </div>
          </div>
          <div class="right_top_right_div">
            <span class="right_top_right_title">交易金额</span>
            <div>
              <div class="right_top_right_progress">
                <div class="right_top_right_progress_left"></div>
                <div class="right_top_right_progress_right"></div>
              </div>
              <div style="margin-top:5px;">
                <div style="float:left">20%</div>
                <div style="float:right">20%</div>
              </div>
            </div>
          </div>
          <div class="right_top_right_div">
            <span class="right_top_right_title">交易笔数</span>
            <div>
              <div class="right_top_right_progress">
                <div class="right_top_right_progress_left"></div>
                <div class="right_top_right_progress_right"></div>
              </div>
              <div style="margin-top:5px;">
                <div style="float:left">20%</div>
                <div style="float:right">20%</div>
              </div>
            </div>
          </div>
          <div style="display: -webkit-flex;display: flex;flex-wrap: nowrap;justify-content: flex-end;align-items: center">
            <div style="width:12px;height:12px;border-radius:2px;background-color:#67c23a;margin-right:10px"></div>
            <div>新客户</div>
            <div style="width:12px;height:12px;border-radius:2px;background-color:red;margin:0 10px 0 20px"></div>
            <div>老客户</div>
          </div>
        </div>
      </div>
      <div class="right_bottom">
        <div style="font-weight:bold;text-align:left;margin:10px 0 10px 15px;">近30天支付趋势</div>
        <el-radio-group v-model="radio_right" size="small" @change="changeRadioRight">
          <el-radio-button label="交易数"></el-radio-button>
          <el-radio-button label="消费分布"></el-radio-button>
        </el-radio-group>
        <div id="diagram_right"></div>
      </div>
    </div>
    <div class="mask" v-show="ismask">
      <div style="font-size:20px;color:#fff;text-align:right;margin:30px 30px 50px 0;" @click="exitFullScreen">X</div>
      <div style="width:1200px;height:700px;margin:0 auto;" id="diagramMask"></div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import $ from 'jquery'
export default {
  data () {
    return {
      radio_left: '场地',
      radio_right: '交易数',
      rankActive: true,
      trendActive: false,
      ismask: false,
      colorlist: ['#337cf6', '#11E4D4', '#FF9243', '#5E56D4', '#00E3FF', '#FF5976', '#FFA500', '#9ACD32', '#FF3030', '#EED5B7'], // 左下角图例颜色
      colorlist_right: ['#5E98F8', '#FFB37C ', '#42E9DB'], // 右下角图例颜色
      data1: { // 模拟左下角折线图数据
        date: ['02-21', '02-22', '02-23', '02-24', '02-25', '02-26', '02-27', '02-28', '03-01', '03-02'],
        value1: [10, 8, 15, 12, 20, 10, 16, 18, 12, 15],
        value2: [12, 9, 12, 15, 18, 10, 16, 20, 12, 15]
      },
      data2: { // 模拟右下角折线图数据
        date: ['02-21', '02-22', '02-23', '02-24', '02-25', '02-26', '02-27', '02-28', '03-01', '03-02'],
        value1: [5, 3, 4, 2, 6, 4, 5, 8, 4, 6],
        value2: [20, 15, 12, 14, 16, 10, 15, 16, 18, 20],
        value3: [4, 3, 4, 1, 6, 4, 3, 6, 4, 5]
      },
      data3: { // 模拟左下角柱状图数据
        xdata: ['江泰国际广场1楼', '江泰国际广场2楼', '江泰国际广场3楼', '江泰国际广场4楼', '江泰国际广场5楼', '丽水金汇广场1楼', '丽水金汇广场2楼', '丽水金汇广场3楼', '丽水金汇广场4楼', '丽水金汇广场5楼'],
        ydata: [36, 25, 24, 22, 20, 20, 18, 16, 15, 12]
      }
    }
  },
  mounted: function () {
    var windowHeight = $(window).height()
    var mainHeight = windowHeight - 120
    $('.overviewPage').height(mainHeight)
    $('.left').height(mainHeight)
    $('.right').height(mainHeight)
    this.loadIncomePie('incomePie')
    this.loaddiagramBar(this.data3)
    this.loaddiagram(this.data2, 'diagram_right')
  },
  methods: {
    fullscreen: function () {
      this.ismask = true
      this.loadIncomePie('diagramMask')
    },
    exitFullScreen: function () {
      this.ismask = false
    },
    rankBt_active: function () {
      console.log('rankBt_active')
      console.log(this.radio_left)
      this.rankActive = true
      this.trendActive = false
      this.loaddiagramBar(this.data3)
    },
    rankBt_inactive: function () {
      console.log('rankBt_inactive')
      this.rankActive = true
      this.trendActive = false
      this.loaddiagramBar(this.data3)
    },
    trendBt_active: function () {
      console.log('trend_active')
      this.rankActive = false
      this.trendActive = true
      this.loaddiagram(this.data1, 'diagram_left')
    },
    trendBt_inactive: function () {
      console.log('trend_inactive')
      this.rankActive = false
      this.trendActive = true
      this.loaddiagram(this.data1, 'diagram_left')
    },
    changeRadio: function (val) {
      console.log(this.radio_left)
      if (val === '场地') {
        this.loaddiagram(this.data1, 'diagram_left')
      } else {
        this.loaddiagram(this.data1, 'diagram_left')
      }
    },
    changeRadioRight: function (val) {
      if (val === '交易数') {
        this.loaddiagram(this.data2, 'diagram_right')
      } else {
        this.loadIncomePie_right()
      }
    },
    // 加载图表 饼图
    loadIncomePie: function (id) {
      var diagramContainer = document.getElementById(id)
      var incomePie = echarts.init(diagramContainer)
      var option = {
        title: {
          text: '今日总收益',
          subtext: '10',
          x: 'center',
          y: 'center',
          top: '40%',
          textStyle: {
            fontSize: 16,
            fontWeight: 700
          },
          subtextStyle: {
            fontSize: 14,
            color: '#333',
            fontWeight: 500
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{d}%'
        },
        color: ['#15d0c1', '#fd853d'],
        // legend: {
        //   orient: 'vertical',
        //   left: 'left',
        //   data: ['在线支付', '广告收益']
        // },
        series: {
          name: '收益分布',
          type: 'pie',
          radius: ['90%', '75%'],
          data: [{
            value: 10, name: '在线支付'
          }, {
            value: 10, name: '广告收益'
          }],
          label: {
            normal: {
              show: false,
              position: 'center'
            }
          }
        }
      }
      incomePie.setOption(option)
    },
    // 加载图表 折线图
    loaddiagram: function (data, id) {
      let xdata = []
      console.log('xdata')
      console.log(data)
      for (let i = 0; i < data.date.length; i++) {
        xdata.push(data.date[i])
      }
      var diagramContainer = document.getElementById(id)
      var myChart = echarts.init(diagramContainer)
      var option = {
        // title: {
        //   text: '总收益',
        //   x: 'center'
        // },
        tooltip: {
          trigger: 'axis',
          axisPoniter: {
            type: 'cross'
          }
        },
        dataZoom: [
          {
            type: 'inside', // 鼠标缩放
            start: 0,
            end: 100
          }
        ],
        color: this.color(id),
        legend: {
          orient: 'horizontal',
          y: 'bottom',
          data: this.legend(id)
        },
        xAxis: {
          data: xdata
        },
        yAxis: {},
        series: this.series(data, id)
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
      window.onresize = function () {
        console.log('chartresize')
        myChart.resize()
      }
    },
    // 折线图图例颜色
    color: function (value) {
      var colorlist
      if (value === 'diagram_left') {
        colorlist = this.colorlist
      } else {
        colorlist = this.colorlist_right
      }
      console.log('colorlist')
      console.log(colorlist)
      return colorlist
    },
    // 折线图图例
    legend: function (value) {
      var legend
      if (value === 'diagram_left') {
        // legend = ['江泰国际广场', '丽水金汇广场']
        legend = ['江泰国际广场']
      } else {
        legend = ['交易笔数', '交易金额', '顾客数']
      }
      console.log('legend')
      console.log(legend)
      return legend
    },
    // 折线图的series
    series: function (data, id) {
      var series
      if (id === 'diagram_left') {
        series = {
          name: '江泰国际广场',
          type: 'line',
          smooth: true,
          data: [10, 8, 15, 12, 20, 10, 16, 18, 12, 15]
        }
      } else {
        series = [{
          name: '交易笔数',
          type: 'line',
          smooth: true,
          data: [5, 3, 4, 2, 6, 4, 5, 8, 4, 6]
        }, {
          name: '交易金额',
          type: 'line',
          smooth: true,
          data: [20, 15, 12, 14, 16, 10, 15, 16, 18, 20]
        }, {
          name: '顾客数',
          type: 'line',
          smooth: true,
          data: [4, 3, 4, 1, 6, 4, 3, 6, 4, 5]
        }]
      }
      console.log('series')
      console.log(series)
      return series
    },
    // 加载图表 柱状图
    loaddiagramBar: function (data) {
      let xdata = []
      for (let i = 0; i < data.xdata.length; i++) {
        xdata.push(data.xdata[i])
      }
      let ydata = []
      for (let j = 0; j < data.ydata.length; j++) {
        ydata.push(data.ydata[j])
      }
      var diagramContainer = document.getElementById('diagram_left')
      var myChartBar = echarts.init(diagramContainer)
      var option = {
        // title: {
        //   text: '总收益',
        //   x: 'center'
        // },
        tooltip: {
          trigger: 'axis',
          axisPoniter: {
            type: 'cross'
          }
        },
        dataZoom: [
          {
            type: 'inside', // 鼠标缩放
            start: 0,
            end: 100
          }
        ],
        color: ['#337cf6'],
        legend: {
          orient: 'horizontal',
          y: 'bottom',
          data: ['总收益']
        },
        xAxis: {
          data: xdata
        },
        yAxis: {},
        series: {
          name: '总收益',
          type: 'bar',
          barWidth: 25,
          data: ydata
        }
      }
      // 使用刚指定的配置项和数据显示图表。
      myChartBar.setOption(option)
      window.onresize = function () {
        console.log('chartresize')
        myChartBar.resize()
      }
    },
    // 加载图表 饼图 右下角
    loadIncomePie_right: function () {
      var diagramContainer = document.getElementById('diagram_right')
      var incomePieright = echarts.init(diagramContainer)
      var option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        color: ['#15d0c1', '#fd853d'],
        legend: {
          orient: 'horizontal', // 'vertical'
          y: 'bottom', // 'center' | 'bottom' | {number}
          data: ['纸巾', '湿巾']
        },
        series: {
          name: '收益分布',
          type: 'pie',
          radius: ['60%', '55%'],
          data: [{
            value: 12, name: '纸巾'
          }, {
            value: 8, name: '湿巾'
          }],
          label: {
            normal: {
              show: false,
              position: 'center'
            }
          }
        }
      }
      // 使用刚指定的配置项和数据显示图表。
      // 这里注意，echarts的option每次默认是合并的，如果我们第一次绘制三组数据的折线图，再在同一区域绘制环形图，
      // 会出现环形图代替折线图的第一组数据，折线图的第二三组数据仍然保留，出现折线图环形图并存的情况
      // chart.setOption(option, notMerge)
      incomePieright.setOption(option, true)
    }
  }
}
</script>

<style scoped>
.overviewPage {
  min-width: 1200px;
  height: 100%;
  padding: 20px;
  background-color: white;
  display: -webkit-flex;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  letter-spacing:2px;
}
.left {
  width:62.5%;
  min-width: 600px;
  height: 800px;
  margin-right: 15px;
}
.left_top {
  border: 1px solid #eee;
  border-radius: 10px;
  width: 100%;
  height: 23%;
  margin-bottom: 15px;
  display: -webkit-flex;
  display: flex;
  flex-wrap: nowrap;
}
.left_top_left {
  margin-left: 30px;
  position: relative;
  width: 70%;
  height: 100%;
  border-right: 1px solid #eee;
  display: -webkit-flex;
  display: flex;
  align-items: center;
}
#incomePie {
  width: 155px;
  height: 95%;
  margin: 0 20px 0 20px;
}
.incomePieTable {
  color:#606266;
  letter-spacing:3px;
  width: 480px;
  height: 95%;
  margin: 30px 0 0 3vw;
}
.incomePieTable tr th {
  /* padding: 0 20px 20px 20px; */
  padding: 0 1vw 1vw 1vw;
}
.incomePieTable tr td {
  padding: 0 1vw 1vw 1vw;
}
.tdDiv {
  display: -webkit-flex;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
}
.left_top_right {
  width: 30%;
  height: 100%;
  min-width: 140px;
}
.general {
  display: -webkit-flex;
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  justify-content: space-around;
  margin:0 30px;
}
.general_text {
  font-size:12px;
  line-height:16px
}
.left_bottom {
  border-radius: 10px;
  border: 1px solid #eee;
  width: 100%;
  height: 75%;
}
.left_bottom >>> .el-button {
  margin: 0 10px;
  font-size: 14px;
}
.inactiveBt >>> .el-button--text {
  color:#606266;
}
#diagram_left {
  margin: 0 auto;
  width: 90%;
  height: 500px;
}
.right {
  width: 37.5%;
  min-width:530px;
  height: 200px;
}
.right_top {
  border: 1px solid #eee;
  border-radius: 10px;
  width: 100%;
  height: 23%;
  margin-bottom: 15px;
  display: -webkit-flex;
  display: flex;
  flex-wrap: nowrap;
}
.right_top_left {
  min-width: 140px;
  width: 30%;
  height: 100%;
  border-right: 1px solid #eee;
}
.right_top_right {
  width: 70%;
  height: 100%;
  padding: 20px 20px 0 20px;
}
.right_top_right_div {
  margin-bottom: 20px;
  display: -webkit-flex;
  display: flex;
  flex-wrap: nowrap;
}
.right_top_right_title {
  width: 80px;
}
.right_top_right_progress {
  width: 270px;
  height: 5px;
  background-color: #e7e7e7;
}
.right_top_right_progress_left {
  height:100%;
  background-color:#67c23a;
  width:20%;
  float:left
}
.right_top_right_progress_right {
  height:100%;
  background-color:red;
  width:20%;
  float:right
}
.right_bottom {
  border-radius: 10px;
  border: 1px solid #eee;
   width: 100%;
   height: 75%;
}
#diagram_right {
  padding-top: 10px;
  margin: 0 auto;
  width: 80%;
  height: 500px;
}
.mask {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, .5);
  z-index: 999;
}
</style>

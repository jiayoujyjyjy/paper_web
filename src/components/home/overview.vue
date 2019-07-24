<template>
  <div class="overviewPage">
    <div class="left">
      <div class="left_top">
        <div class="left_top_left" @click="fullscreen">
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
              <td>{{topData.onlineIncome}}元</td>
              <td>{{topData.orderNum}}笔</td>
            </tr>
            <tr>
              <td>
                <div class="tdDiv">
                  <div style="width:13px;height:13px;background-color:#fd853d;border-radius:3px;margin-right:5px;"></div>
                  <span>广告收益</span>
                </div>
              </td>
              <td>{{topData.advertIncome}}元</td>
              <td>--</td>
            </tr>
            <tr>
              <td>
                <div class="tdDiv">
                  <div style="width:13px;height:13px;background-color:#fff;border-radius:3px;margin-right:5px;"></div>
                  <span>总收益</span>
                </div>
              </td>
              <td>{{topData.totalIncome}}元</td>
              <td>--</td>
            </tr>
          </div>
        </div>
        <div class="left_top_right">
          <div class="title">
            <div style="line-height:20px">实时在线率</div>
            <div style="font-size:20px;font-weight:700;">{{topData.onlineRate}}</div>
          </div>
          <div class="general">
            <div>
              <div class="general_text">设备总数</div>
              <div style="font-size:16px">{{topData.totalNum}}</div>
            </div>
            <div>
              <div class="general_text">离线</div>
              <div style="color:red;font-size:16px">{{topData.offlineNum}}</div>
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
          <div class="title">
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
            <div style="font-size:20px;font-weight:700;">{{userStatisList.newUser.userNum + userStatisList.oldUser.userNum}}</div>
          </div>
          <div class="general">
            <div>
              <div class="general_text">新顾客</div>
              <div style="color:#67C23A;font-size:16px">{{userStatisList.newUser.userNum}}</div>
            </div>
            <div>
              <div class="general_text">老顾客</div>
              <div style="font-size:16px">{{userStatisList.oldUser.userNum}}</div>
            </div>
          </div>
        </div>
        <div class="right_top_right">
          <div class="right_top_right_div">
            <span class="right_top_right_title">用户数</span>
            <div>
              <div class="right_top_right_progress right_top_right_progress_userNum">
                <div class="right_top_right_progress_left"></div>
                <div class="right_top_right_progress_right"></div>
              </div>
              <div style="margin-top:5px;">
                <div style="float:left">{{userStatisList.userNum}}</div>
                <div style="float:right">{{100 - userStatisList.userNum.split('%')[0] + '%'}}</div>
              </div>
            </div>
          </div>
          <div class="right_top_right_div">
            <span class="right_top_right_title">交易金额</span>
            <div>
              <div class="right_top_right_progress right_top_right_progress_income">
                <div class="right_top_right_progress_left"></div>
                <div class="right_top_right_progress_right"></div>
              </div>
              <div style="margin-top:5px;">
                <div style="float:left">{{userStatisList.income}}</div>
                <div style="float:right">{{100 - userStatisList.income.split('%')[0] + '%'}}</div>
              </div>
            </div>
          </div>
          <div class="right_top_right_div">
            <span class="right_top_right_title">交易笔数</span>
            <div>
              <div class="right_top_right_progress right_top_right_progress_orderNum">
                <div class="right_top_right_progress_left"></div>
                <div class="right_top_right_progress_right"></div>
              </div>
              <div style="margin-top:5px;">
                <div style="float:left">{{userStatisList.orderNum}}</div>
                <div style="float:right">{{100 - userStatisList.orderNum.split('%')[0] + '%'}}</div>
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
      <div class="mask_x" @click="exitFullScreen">X</div>
      <div style="width:1200px;height:700px;margin:0 auto;" id="diagramMask"></div>
    </div>
  </div>
</template>

<script>
import { back } from 'api'
import { sessionSetStore } from '@/components/config/Utils'
import echarts from 'echarts'
import $ from 'jquery'
export default {
  data () {
    return {
      param: {
        'currentPage': 1,
        'pagesize': 8,
        'currentPage_DiaDev': 1,
        'pagesize_DiaDev': 8
      },
      topData: {
        onlineIncome: '',
        orderNum: '',
        advertIncome: '',
        totalIncome: '',
        onlineRate: '',
        totalNum: '',
        offlineNum: '',
        onlineNum: ''
      },
      userStatisList: {
        newUser: { income: '', orderNum: '', userNum: '' },
        oldUser: { income: '', orderNum: '', userNum: '' },
        userNum: '', // 新客户比例
        income: '',
        orderNum: ''
      },
      radio_left: '场地',
      radio_right: '交易数',
      rankActive: true,
      trendActive: false,
      ismask: false,
      colorlist_right: ['#5E98F8', '#FFB37C ', '#42E9DB'], // 右下角图例颜色
      siteStatisTrendListResult: { // 模拟左下角折线图数据
        date: ['02-21', '02-22', '02-23', '02-24', '02-25', '02-26', '02-27', '02-28', '03-01', '03-02'],
        value1: [10, 8, 15, 12, 20, 10, 16, 18, 12, 15],
        value2: [12, 9, 12, 15, 18, 10, 16, 20, 12, 15]
      },
      siteStatisTrendListDateDataResult: [],
      siteStatisTrendListNameDataResult: [],
      deviceStatisTrendListResult: { // 模拟左下角折线图数据
        date: ['02-21', '02-22', '02-23', '02-24', '02-25', '02-26', '02-27', '02-28', '03-01', '03-02'],
        value1: [10, 8, 15, 12, 20, 10, 16, 18, 12, 15],
        value2: [12, 9, 12, 15, 18, 10, 16, 20, 12, 15]
      },
      deviceStatisTrendListDateDataResult: [],
      deviceStatisTrendListNameDataResult: [],
      statisTrendListResult: { // 模拟右下角折线图数据
        date: ['02-21', '02-22', '02-23', '02-24', '02-25', '02-26', '02-27', '02-28', '03-01', '03-02'],
        value1: [5, 3, 4, 2, 6, 4, 5, 8, 4, 6],
        value2: [20, 15, 12, 14, 16, 10, 15, 16, 18, 20],
        value3: [4, 3, 4, 1, 6, 4, 3, 6, 4, 5]
      },
      siteStatisListResult: { // 模拟左下角柱状图数据
        xdata: ['江泰国际广场1楼', '江泰国际广场2楼', '江泰国际广场3楼', '江泰国际广场4楼', '江泰国际广场5楼', '丽水金汇广场1楼', '丽水金汇广场2楼', '丽水金汇广场3楼', '丽水金汇广场4楼', '丽水金汇广场5楼'],
        ydata: [36, 25, 24, 22, 20, 20, 18, 16, 15, 12]
      },
      paperStatisListResult: []
    }
  },
  created: function () {
    this.pageQueSelInit()
    this.backQueConsoleStatis()
  },
  mounted: function () {
    // 初始化表格容器高度/最大高度
    this.tableContainerHeightSet()
    // 柱状图 折线图高宽自适应
    this.chartsInit()
    // 监听屏幕高度
    this.screenOnresizeFun()
  },
  // 注销window.onresize事件
  destroyed () {
    window.onresize = null
  },
  methods: {
    // 表格容器高度随窗口视口变化函数
    tableContainerHeightSet: function () {
      var windowHeight = $(window).height()
      var mainHeight = windowHeight - 40 - 60 - 40
      $('.overviewPage').height(mainHeight - 20)
      $('.left').height(mainHeight - 20)
      $('.right').height(mainHeight - 20)
    },
    // 监听屏幕高度
    screenOnresizeFun: function () {
      const that = this
      window.onresize = () => {
        return (() => {
          that.screenHeight = document.body.clientHeight
          console.log('that.screenHeight: ' + that.screenHeight)
        })() // 不加最后()会报错，并没有立即执行,立即执行函数
      }
    },
    // 柱状图 折线图高宽自适应
    chartsInit: function () {
      // 1.页面刷新调整高宽
      let barChartBox = document.getElementById('diagram_left')
      let lineChartBox = document.getElementById('diagram_right')
      let resizeBoxFun = function (boxName) {
        boxName.style.height = document.body.clientHeight * 0.40 + 'px'
      }
      resizeBoxFun(barChartBox)
      resizeBoxFun(lineChartBox)
      // 2.页面缩放调整高宽
      // let barChartInstance = echarts.init(barChartBox)
      // let lineChartInstance = echarts.init(lineChartBox)
      // window.onresize = function () {
      //   alert('resize') // 为啥执行了两次呢？
      //   resizeBoxFun(barChartBox)
      //   resizeBoxFun(lineChartBox)
      //   barChartInstance.resize()
      //   lineChartInstance.resize()
      // }
    },
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
      if (this.radio_left === '场地') {
        this.loaddiagramBar(this.siteStatisListResult)
      } else if (this.radio_left === '设备') {
        this.loaddiagramBar(this.deviceStatisListResult)
      }
    },
    rankBt_inactive: function () {
      console.log('rankBt_inactive')
      console.log(this.radio_left)
      this.rankActive = true
      this.trendActive = false
      if (this.radio_left === '场地') {
        this.loaddiagramBar(this.siteStatisListResult)
      } else if (this.radio_left === '设备') {
        this.loaddiagramBar(this.deviceStatisListResult)
      }
    },
    trendBt_active: function () {
      console.log('trend_active')
      console.log(this.radio_left)
      this.rankActive = false
      this.trendActive = true
      if (this.radio_left === '场地') {
        this.loaddiagram(this.siteStatisTrendListResult, 'diagram_left')
      } else if (this.radio_left === '设备') {
        this.loaddiagram(this.deviceStatisTrendListResult, 'diagram_left')
      }
    },
    trendBt_inactive: function () {
      console.log('trend_inactive')
      console.log(this.radio_left)
      this.rankActive = false
      this.trendActive = true
      if (this.radio_left === '场地') {
        this.loaddiagram(this.siteStatisTrendListResult, 'diagram_left')
      } else if (this.radio_left === '设备') {
        this.loaddiagram(this.deviceStatisTrendListResult, 'diagram_left')
      }
    },
    changeRadio: function (val) {
      this.rankBt_active()
    },
    changeRadioRight: function (val) {
      console.log('123456')
      console.log(val)
      if (val === '交易数') {
        this.loaddiagram(this.statisTrendListResult, 'diagram_right')
      } else if (val === '消费分布') {
        this.loadIncomePie_right()
      }
    },
    // 加载图表 饼图
    loadIncomePie: function (id) {
      console.log('aaaaaaaaaaaaa')
      console.log(this.topData)
      var diagramContainer = document.getElementById(id)
      var incomePie = echarts.init(diagramContainer)
      var option = {
        title: {
          text: '今日总收益',
          subtext: this.topData.totalIncome + '元',
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
        //   left: '0px',
        //   data: ['在线支付', '广告收益']
        // },
        series: {
          name: '收益分布',
          type: 'pie',
          radius: ['90%', '75%'],
          data: [{
            value: this.topData.onlineIncome, name: '在线支付'
          }, {
            value: this.topData.advertIncome, name: '广告收益'
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
    // 加载图表 折线图 左下角
    loaddiagram: function (data, id) {
      console.log('加载图表 折线图')
      console.log(data)
      console.log(id)
      // xdata不同折线图数据判断
      let xdata = []
      if (this.radio_left === '场地') {
        xdata = this.siteStatisTrendListDateDataResult
      } else if (this.radio_left === '设备') {
        xdata = this.deviceStatisTrendListDateDataResult
      } else if (this.radio_right === '交易数') {
        data.forEach(item => {
          xdata.push(item.date)
        })
      }
      var diagramContainer = document.getElementById(id)
      var myChart = echarts.init(diagramContainer)
      var option = {
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
        // 因为太多导致内容溢出，所以暂时隐藏
        // legend: {
        //   orient: 'horizontal',
        //   y: 'bottom',
        //   data: this.legend(id)
        // },
        xAxis: {
          data: xdata
        },
        yAxis: {},
        series: this.series(data, id) // 注意series字段与legend字段应相符
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option, true)
      // window.onresize = function () {
      //   console.log('chartresize')
      //   myChart.resize()
      // }
    },
    // 折线图图例
    legend: function (value) {
      var legend
      if (value === 'diagram_left') {
        legend = this.radio_left === '场地' ? this.siteStatisTrendListNameDataResult : this.deviceStatisTrendListNameDataResult
      } else if (value === 'diagram_right') {
        legend = ['交易笔数', '交易金额', '用户数']
      }
      console.log('legend')
      console.log(legend)
      return legend
    },
    // 折线图的series
    series: function (data, id) {
      let series
      console.log(data)
      if (id === 'diagram_left') {
        series = data
      } else {
        let orderNumData = []
        data.forEach(item => {
          orderNumData.push(item.orderNum)
        })
        let totalIncomeData = []
        data.forEach(item => {
          totalIncomeData.push(item.totalIncome)
        })
        let userNumData = []
        data.forEach(item => {
          userNumData.push(item.userNum)
        })
        series = [{
          name: '交易笔数',
          type: 'line',
          smooth: true,
          data: orderNumData
        }, {
          name: '交易金额',
          type: 'line',
          smooth: true,
          data: totalIncomeData
        }, {
          name: '用户数',
          type: 'line',
          smooth: true,
          data: userNumData
        }]
      }
      console.log('series')
      console.log(series)
      return series
    },
    // 加载图表 柱状图
    loaddiagramBar: function (data) {
      let xdata = []
      data.forEach(item => {
        xdata.push(item.siteName)
      })
      let ydata = []
      data.forEach(item => {
        ydata.push(item.totalIncome)
      })
      var diagramContainer = document.getElementById('diagram_left')
      var myChartBar = echarts.init(diagramContainer)
      var option = {
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
      myChartBar.setOption(option, true)
      // window.onresize = function () {
      //   console.log('chartresize bar')
      //   myChartBar.resize()
      // }
    },
    // 加载图表 饼图 右下角
    loadIncomePie_right: function () {
      console.log(this.paperStatisListResult)
      let legendData = []
      this.paperStatisListResult.forEach(item => {
        legendData.push(item.paperName)
      })
      let seriesData = []
      this.paperStatisListResult.forEach(item => {
        let obj = {}
        obj.value = item.income
        obj.name = item.paperName
        seriesData.push(obj)
      })
      console.log(legendData)
      console.log(seriesData)
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
          data: legendData
        },
        series: {
          name: '收益分布',
          type: 'pie',
          radius: ['60%', '55%'],
          data: seriesData,
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
    },
    /*
      *
      *******************   API调用   *********************
      *
    */
    // 控制台统计
    backQueConsoleStatis: function () {
      sessionSetStore('backName', '控制台统计')
      back.queConsoleStatis(this.param)
        .then((response) => {
          console.log(response)
          // 头部topData数据存储
          let topDataAlter = {}
          topDataAlter.onlineIncome = response.data.onlineIncome
          topDataAlter.orderNum = response.data.orderNum
          topDataAlter.advertIncome = response.data.advertIncome
          topDataAlter.totalIncome = response.data.totalIncome
          topDataAlter.onlineRate = response.data.onlineRate
          topDataAlter.totalNum = response.data.totalNum
          topDataAlter.offlineNum = response.data.offlineNum
          topDataAlter.onlineNum = response.data.onlineNum
          this.topData = topDataAlter
          this.loadIncomePie('incomePie')
          // 头部新老用户统计数据存储
          let userStatisListAlter = {}
          let newUserAlter = {}
          let oldUserAlter = {}
          response.data.userStatisList.forEach(item => {
            if (item.isOld) {
              oldUserAlter = item
            } else {
              newUserAlter = item
            }
          })
          userStatisListAlter.newUser = newUserAlter
          userStatisListAlter.oldUser = oldUserAlter
          // 计算并设置dom新老用户比例
          this.userStatisListRatio(userStatisListAlter)
          // 场地收益统计数据存储
          this.siteStatisListResult = response.data.siteStatisList
          this.rankBt_active() // 默认显示场地排行柱状图数据
          // 场地收益趋势数据存储
          this.siteStatisTrendListResult = this.merge(response.data.siteStatisTrendList, 'siteName', 'siteName')
          this.siteStatisTrendListResult.forEach(item => {
            this.siteStatisTrendListNameDataResult.push(item.name)
          })
          if (this.siteStatisTrendListResult) this.siteStatisTrendListDateDataResult = this.siteStatisTrendListResult[0].date
          // 设备收益统计数据存储
          this.deviceStatisListResult = response.data.deviceStatisList
          // 设备收益趋势数据存储
          this.deviceStatisTrendListResult = this.merge(response.data.deviceStatisTrendList, 'deviceId', 'deviceId')
          this.deviceStatisTrendListResult.forEach(item => {
            this.deviceStatisTrendListNameDataResult.push(item.name)
          })
          if (this.deviceStatisTrendListResult) this.deviceStatisTrendListDateDataResult = this.deviceStatisTrendListResult[0].date
          // 纸巾收益统计数据存储
          this.paperStatisListResult = response.data.paperStatisList
          // 近30天收益趋势统计数据存储
          this.statisTrendListResult = response.data.statisTrendList
          this.loaddiagram(this.statisTrendListResult, 'diagram_right')
        })
        .catch((error) => {
          console.log(error)
        })
    },
    // 分页查询请求可选项置空函数
    pageQueSelInit: function () {
      this.param.deviceId = ''
      this.param.siteId = ''
      this.param.beginDate = ''
      this.param.endDate = ''
      this.param.queryType = ''
    },
    backDelGroup: function () {
      console.log('删除产品')
    },
    // 数组对象合并
    merge: function (list, key, xname) {
      console.log(list)
      console.log(key)
      console.log(xname)
      let idArr = []
      for (let i = 0; i < list.length; i++) {
        if (idArr.indexOf(list[i][key]) === -1) {
          idArr.push(list[i][key])
        }
      }
      console.log(idArr)
      let result = []
      for (let i = 0; i < idArr.length; i++) {
        let obj = {}
        let orderData = []
        let incomeData = []
        let deviceNameData = []
        let siteNameData = []
        let dateData = []
        for (let j = 0; j < list.length; j++) {
          if (idArr[i] === list[j][key]) {
            orderData.push(list[j].orderNum)
            incomeData.push(list[j].totalIncome)
            deviceNameData.push(list[j].deviceName)
            siteNameData.push(list[j].siteName)
            dateData.push(list[j].date)
          }
        }
        obj.deviceId = idArr[i]
        if (xname === 'siteName') {
          obj.name = siteNameData[i]
        } else {
          obj.name = deviceNameData[i]
        }
        obj.type = 'line'
        obj.smooth = true
        obj.date = dateData
        obj.orderData = orderData
        obj.incomeData = incomeData
        obj.data = incomeData // 默认显示incomeData
        result.push(obj)
      }
      console.log(result)
      return result
    },
    // 计算并设置dom新老用户比例
    userStatisListRatio: function (data) {
      // 1.计算
      data.userNum = Math.round(data.newUser.userNum / (data.newUser.userNum + data.oldUser.userNum) * 10000) / 100.00 + '%'
      data.income = Math.round(data.newUser.income / (data.newUser.income + data.oldUser.income) * 10000) / 100.00 + '%'
      data.orderNum = Math.round(data.newUser.orderNum / (data.newUser.orderNum + data.oldUser.orderNum) * 10000) / 100.00 + '%'
      this.userStatisList = data
      // 2.设置dom宽度
      this.setCssDom('.right_top_right_progress_userNum', 0, data.userNum)
      this.setCssDom('.right_top_right_progress_userNum', 2, (100 - data.userNum.split('%')[0] + '%'))
      this.setCssDom('.right_top_right_progress_income', 0, data.income)
      this.setCssDom('.right_top_right_progress_income', 2, (100 - data.income.split('%')[0] + '%'))
      this.setCssDom('.right_top_right_progress_orderNum', 0, data.orderNum)
      this.setCssDom('.right_top_right_progress_orderNum', 2, (100 - data.orderNum.split('%')[0] + '%'))
    },
    // 设置dom属性
    setCssDom: function (cssName, nodeIndex, val) {
      let dom = $(cssName)[0].childNodes[nodeIndex]
      dom.style.width = val
    }
  }
}
</script>

<style scoped>
.overviewPage {
  /* height: 100%; */
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
  box-sizing: border-box;
  /* padding/margin效果都一样,因为box-sizing: border-box; */
  padding-right: 15px;
}
.left_top {
  border: 1px solid #eee;
  border-radius: 10px;
  width: 100%;
  height: 25%;
  margin-bottom: 15px;
  display: -webkit-flex;
  display: flex;
  flex-wrap: nowrap;
}
.left_top_left {
  margin-left: 5vw;
  position: relative;
  width: 70%;
  height: 100%;
  border-right: 1px solid #eee;
  display: -webkit-flex;
  display: flex;
  align-items: center;
  cursor: pointer;
}
#incomePie {
  width: 10%;
  height: 95%;
  margin: 0 10px 0 10px;
  cursor: pointer!important;
}
.incomePieTable {
  color:#606266;
  letter-spacing:3px;
  width: 90%;
  height: 95%;
  margin: 10px 0 0 3vw;
}
.incomePieTable tr th {
  /* padding: 0 20px 20px 20px; */
  padding: 0 0.1vw 1vh 0.1vw;
}
.incomePieTable tr td {
  padding: 0 1vw 1vh 1vw;
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
.left_top_right .title, .right_top_left .title{
  margin: 4vh 0;
}
.general {
  display: -webkit-flex;
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  justify-content: space-around;
  margin:0 1vw;
}
.general_text {
  font-size:12px;
  line-height:16px
}
.left_bottom {
  border-radius: 10px;
  border: 1px solid #eee;
  width: 100%;
  height: 70%;
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
  height: 25%;
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
  padding: 2vh 1vw 0 1vw;
}
.right_top_right_div {
  margin-bottom: 2.2vh;
  display: -webkit-flex;
  display: flex;
  flex-wrap: nowrap;
}
.right_top_right :nth-child(3) {
  margin-bottom: 1vh;
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
  /* width: 100%; */
  height: 70%;
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
.mask_x {
  font-size: 20px;
  color: #fff;
  text-align: right;
  margin: 3vh 3vw 3vh 0;
  cursor: pointer;
}
</style>

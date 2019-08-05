// 8数据分析  -> 8-1订单分析
<template>
  <div class="orderAnalyPage">
    <div class="flexbox">
      <div class="box box-one">
        <h3>订单分析</h3>
      </div>
      <!-- <div class="box box-two">
        <el-select v-model="timeSelected" placeholder="请选择" @change="updataTime">
          <el-option
            v-for="item in timeSelectData"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div> -->
      <div class="box box-three">
        <el-date-picker
          v-model="dateValue"
          type="daterange"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd">
        </el-date-picker>      
      </div>
      <div class="box box-four">
        <el-select v-model="siteOrGroupTypeSelected" placeholder="请选择" @change="queTypeChange">
          <el-option
            v-for="item in siteOrGroupTypeSelectData"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="box box-five">
        <el-select v-model="siteOrGroupIdSelected" placeholder="请选择">
          <el-option
            v-for="item in siteOrGroupIdSelectData"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="box box-six">
        <el-button type="primary" size="small" @click="searchBt">查询</el-button>
      </div>
    </div>

    <div class="order-container">
      <div class="order-amount-container">
        <span class="little-title">订单数量和金额分析</span>
        <div id="orderNumberChart" class="chart-container"></div>
      </div>
      <div class="order-time-container">
        <span class="little-title">订单下单时间分布</span>
        <div id="orderTimerChart" class="chart-container"></div>
      </div>
    </div>

  </div>
</template>

<script>
import { back } from 'api'
import { sessionGetStore, sessionSetStore } from '@/components/config/Utils'
import { character } from '@/components/config/Character'
import echarts from 'echarts'
import $ from 'jquery'
export default {
  data () {
    return {
      param: {
        'beginDate': '',
        'endDate': '',
        'siteId': '',
        'groupId': '',
        'address': '',
        'name': ''
      },
      timeSelected: 'day',
      timeSelectData: [
        { value: 'day', label: '最近一天' },
        { value: 'week', label: '最近一周' },
        { value: 'month', label: '最近一月' },
        { value: 'custom', label: '自定义' }
      ],
      siteOrGroupTypeSelected: 'site',
      siteOrGroupTypeSelectData: [
        { value: 'site', label: '按场地' },
        { value: 'group', label: '按分组' }
      ],
      siteOrGroupIdSelected: 'all',
      siteOrGroupIdSelectData: [
        { value: 'one', label: '丽晶广场1' },
        { value: 'two', label: '江泰广场2' }
      ],
      siteList: [{ value: 'all', label: '全部' }],
      groupList: [{ value: 'all', label: '全部' }],
      // 日期选择器
      pickerOptions: {
        shortcuts: [{
          text: '最近一天',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      orderList: [],
      timeList: [],
      totalOrderNum: null,
      totalmoney: null,
      dateValue: [],
      screenHeight: document.body.clientHeight, // 监听变化辅助用，一定要设初始值
      onresizeTimer: false // 屏幕高度变化定时器，避免频繁调用window.onresize()方法
    }
  },
  watch: {
    // 监听屏幕高度改变表格高度
    screenHeight (val) {
      /* 触发dom操作，考虑到函数节流，避免window.onresize()方法频繁触发
      强调一点，window.onresize()方法频繁触发也无所谓，前提是在不操作dom的情况下 */
      if (!this.onresizeTimer) {
        this.tableContainerHeightSet()
        this.onresizeTimer = true
        const that = this
        setTimeout(function () {
          that.onresizeTimer = false
        }, 400)
      }
    }
  },
  created: function () {
    // session获取登录者关键参数
    this.param.id = sessionGetStore('managerId')
    // 分页查询请求可选项置空函数
    this.pageQueSelInit()
    this.backQueArea()
    this.backQueGroupList()
    // 默认查询一月范围
    this.dateValueInit()
    this.backQueOrderAnalysis()
  },
  mounted: function () {
    // // 初始化表格容器高度/最大高度
    // this.tableContainerHeightSet()
    // // 监听屏幕高度
    // this.screenOnresizeFun('orderNumberChart')
  },
  methods: {
    // 表格容器高度随窗口视口变化函数
    tableContainerHeightSet: function () {
      var windowHeight = $(window).height()
      var mainHeight = windowHeight - 40 - 40 - 40
      $('.tableDiv').height(mainHeight - 62 - 53)
      this.tableMaxHeght = windowHeight - 62 - 53 // header outerPadding interPadding searchDiv 分页Div 
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
    // 时间选择处理函数
    updataTime: function () {
      console.log(this.timeSelected)
      const end = character.getCurrentTime()
      const start = character.getCurrentTime()
      switch (this.timeSelected) {
        case 'day':
          console.log(1)
          character.getCurrentTime()
          this.dateValue = [start, end]
          this.param.beginDate = start
          this.param.endDate = end
          this.backQueOrderAnalysis()
          break
        case 'week':
          console.log(2)
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
          this.dateValue = [start, end]
          this.param.beginDate = start
          this.param.endDate = end
          this.backQueOrderAnalysis()
          break
        case 'month':
          console.log(3)
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
          this.dateValue = [start, end]
          this.param.beginDate = start
          this.param.endDate = end
          this.backQueOrderAnalysis()
          break
        case 'custom':
          console.log(4)
          this.customTime()
          break
        default:
          console.log(5)
      }
    },
    // 自定义时间
    customTime: function () {
      console.log(this.dateValue)
      this.param.beginDate = this.dateValue[0]
      this.param.endDate = this.dateValue[1]
      this.backQueOrderAnalysis()
    },
    // 默认查询时间范围处理函数
    dateValueInit: function () {
      let endTime = character.getCurrentTime(0)
      let startTime = character.getCurrentTime(3600 * 1000 * 24 * 30)
      console.log(endTime)
      console.log(startTime)
      this.dateValue = [startTime, endTime]
      this.param.beginDate = startTime
      this.param.endDate = endTime
    },
    // 查询类型改变事件
    queTypeChange: function () {
      console.log(this.siteOrGroupTypeSelected)
      if (this.siteOrGroupTypeSelected === 'site') {
        this.siteOrGroupIdSelectData = this.siteList
      } else {
        this.siteOrGroupIdSelectData = this.groupList
      }
      this.siteOrGroupIdSelected = this.siteOrGroupIdSelectData[0].value
    },
    // 搜索按钮
    searchBt: function () {
      // 场地/分组区分
      if (this.siteOrGroupTypeSelected === 'site') {
        this.param.siteId = this.siteOrGroupIdSelected
        this.param.groupId = ''
      } else {
        this.param.siteId = ''
        this.param.groupId = this.siteOrGroupIdSelected
      }
      // 全部/个别区分
      if (this.siteOrGroupIdSelected === 'all') {
        this.param.groupId = ''
        this.param.siteId = ''
      }
      if (this.dateValue[0] === undefined || this.dateValue[1] === undefined) {
        this.param.beginDate = ''
        this.param.endDate = ''
      } else {
        this.param.beginDate = this.dateValue[0]
        this.param.endDate = this.dateValue[1]
      }
      console.log(this.dateValue)
      this.backQueOrderAnalysis()
    },
    // 加载图表
    loaddiagram: function (id, data) {
      console.log('加载图表')
      console.log(id)
      console.log(data)
      let xdata = []
      data.forEach(item => {
        xdata.push(item.date)
      })
      var diagramContainer = document.getElementById(id)
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
      myChartBar.setOption(option, true)
      window.onresize = function () {
        console.log('chartresize bar')
        myChartBar.resize()
      }
    },
    // 折线图图例
    legend: function (value) {
      let legend
      if (value === 'orderNumberChart') {
        legend = ['订单数', '金额']
      } else if (value === 'orderTimerChart') {
        legend = ['订单数量', '订单占比']
      }
      return legend
    },
    // 折线图的series
    series: function (data, id) {
      let series
      if (id === 'orderNumberChart') {
        let orderNumData = []
        data.forEach(item => {
          orderNumData.push(item.orderNum)
        })
        let moneyData = []
        data.forEach(item => {
          moneyData.push(item.money)
        })
        series = [{
          name: '订单数',
          type: 'line',
          smooth: true,
          data: orderNumData
        }, {
          name: '金额',
          type: 'line',
          smooth: true,
          data: moneyData
        }]
      } else {
        let orderNumData = []
        data.forEach(item => {
          orderNumData.push(item.orderNum)
        })
        let moneyData = []
        let val
        if (this.totalOrderNum === 0) {
          val = '0%'
          data.forEach(item => {
            moneyData.push(val)
          })
        } else {
          data.forEach(item => {
            moneyData.push(Math.round(item.orderNum / this.totalOrderNum * 10000) / 100.00 + '%')
          })
        }
        series = [{
          name: '订单数量',
          type: 'line',
          smooth: true,
          data: orderNumData
        }, {
          name: '订单占比',
          type: 'line',
          smooth: true,
          data: moneyData
        }]
      }
      return series
    },
    /*
      *
      *******************   API调用   *********************
      *
    */
    // 订单分析
    backQueOrderAnalysis: function () {
      sessionSetStore('backName', '订单分析')
      back.queOrderAnalysis(this.param)
        .then(function (res) {
          console.log(res)
          this.totalOrderNum = res.data.totalOrderNum
          this.totalmoney = res.data.totalmoney
          this.orderList = res.data.orderList
          this.timeList = res.data.timeList
          this.loaddiagram('orderNumberChart', res.data.orderList)
          this.loaddiagram('orderTimerChart', res.data.timeList)
        }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
    },
    // 场地查询，用在显示场地搜索中，显示场地编码 siteId=id
    backQueArea: function () {
      sessionSetStore('bacName', '场地查询')
      back.queArea(this.param).then(function (response) {
        if (response.code === 0) {
          console.log(response.data)
          for (var i = 0; i < response.data.length; i++) {
            let obj = {}
            obj.value = response.data[i].id
            obj.label = response.data[i].name
            this.siteList.push(obj)
          }
          console.log(this.siteList)
          // 默认查询场地的
          this.siteOrGroupIdSelectData = this.siteList
        } else {
          this.$message.error('场地获取错误')
        }
      }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
    },
    // 分组查询，用在显示场地搜索中，显示场地编码 siteId=id
    backQueGroupList: function () {
      sessionSetStore('bacName', '分组查询')
      back.queGroupList(this.param).then(function (response) {
        if (response.code === 0) {
          console.log(response.data)
          for (var i = 0; i < response.data.length; i++) {
            let obj = {}
            obj.value = response.data[i].id
            obj.label = response.data[i].name
            this.groupList.push(obj)
          }
          console.log(this.groupList)
        } else {
          this.$message.error('分组获取错误')
        }
      }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
    },

    /*
      *
      *******************   辅助函数   *********************
      *
    */
    // 分页查询请求可选项置空函数
    pageQueSelInit: function () {
      this.param.deviceId = ''
      this.param.groupId = ''
    },
    // 可关闭式通知提示，titlePara为标题，messagePara为通知内容
    notificationInfo: function (titlePara, messagePara) {
      const h = this.$createElement
      this.$notify({
        title: titlePara,
        message: h('i', {style: 'color: teal'}, `${messagePara}`)
      })
    }
  }
}
</script>

<style scoped>
.orderAnalyPage {
  height: 100%;
}
.orderAnalyPage h3 {
  display: inline-block;
  font-size: 20px;
  padding: 0 20px 0 10px;
  border-left: 6px solid #2f75f5;
  line-height: 22px;
  margin: 10px 0;
}
.flexbox {
  /* margin: 20px 80px 20px 0; */
  height: 40px;
  margin: 20px 0;
  margin-top: 0;
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
}
.box {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-wrap: nowrap;
  /* justify-content: space-between; */
  margin-right: 20px;
  width:auto;
  min-width: 116px;
}
.order-container {
  text-align: left;
}
.little-title {
  position: relative;
  padding-left: 16px;
  margin: 20px 0;
  font-weight: 700;
  color: #353841;
  text-align: left;
  font-size: 16px;
}
.little-title:after {
  content: "";
  display: inline-block;
  position: absolute;
  left: 0;
  top: 30%;
  margin-top: -.05rem;
  width: .6rem;
  height: .6rem;
  border-radius: 50%;
  background-color: #2f75f5;
}
.order-container {
  height: calc(100% - 60px);
}
.order-container > div {
  height: 50%;
}
.chart-container {
  /* height: 250px; */
  height: 90%;
}
</style>

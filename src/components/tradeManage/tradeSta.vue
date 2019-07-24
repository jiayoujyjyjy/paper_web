更改为3交易管理-> 3-2交易统计
<template>
  <div class="placePage">
    <div class="flexbox1">
      <el-button size="small" type="primary" plain @click="dayTable">日报表</el-button>
      <el-button size="small" type="primary" plain @click="weekTable">周报表</el-button>
      <el-button size="small" type="primary" plain @click="monthTable">月报表</el-button>
      <span style="margin: auto 0 1% 10%">统计维度：</span>
      <el-select v-model="value" placeholder="请选择" @change="select(value)">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <!-- 场地类型统计 -->
    <div v-show="areaSta" class="tableDiv">
      <el-table :max-height="tableMaxHeght" :header-cell-style="{'font-size':'14px'}" :data="areaData" stripe border size="small" style="width: 100%;font-size:12px;">
        <el-table-column align="center" prop="siteName" label="场地"></el-table-column>
        <el-table-column align="center" prop="deviceNum" label="设备数量"></el-table-column>
        <el-table-column align="center" prop="orderNum" label="交易笔数"></el-table-column>
        <el-table-column align="center" prop="onlineIncome" label="在线收益"></el-table-column>
        <el-table-column align="center" prop="advertIncome" label="广告收益"></el-table-column>
        <el-table-column align="center" prop="totalIncome" label="总收益"></el-table-column>
      </el-table>
    </div>
    <!-- 按设备统计 -->
    <div v-show="devSta" class="tableDiv">
      <el-table :max-height="tableMaxHeght" :header-cell-style="{'font-size':'14px'}" :data="devData" stripe border size="small" style="width: 100%;font-size:12px;">
        <el-table-column align="center" prop="deviceName" label="设备名称"></el-table-column>
        <el-table-column align="center" prop="deviceId" label="设备编码"></el-table-column>
        <el-table-column align="center" prop="state" label="设备状态"></el-table-column>
        <el-table-column align="center" prop="orderNum" label="交易笔数"></el-table-column>
        <el-table-column align="center" prop="onlineIncome" label="在线收益"></el-table-column>
        <el-table-column align="center" prop="advertIncome" label="广告收益"></el-table-column>
        <el-table-column align="center" prop="totalIncome" label="总收益"></el-table-column>
      </el-table>
    </div>
    <!-- 按商品类型统计 -->
    <div v-show="productSta" class="tableDiv">
      <el-table :max-height="tableMaxHeght" :header-cell-style="{'font-size':'14px'}" :data="goods" stripe border size="small" style="width: 100%;font-size:12px;">
        <el-table-column align="center" prop="siteName" label="场地"></el-table-column>
        <el-table-column align="center" prop="deviceId" label="设备编码"></el-table-column>
        <el-table-column align="center" prop="state" label="设备状态"></el-table-column>
        <el-table-column align="center" prop="orderNum" label="交易笔数"></el-table-column>
        <el-table-column align="center" prop="onlineIncome" label="在线收益"></el-table-column>
        <el-table-column align="center" prop="advertIncome" label="广告收益"></el-table-column>
        <el-table-column align="center" prop="totalIncome" label="总收益"></el-table-column>
      </el-table>
    </div>
    <el-pagination
      @current-change="handlePaginationChange"
      :current-page="param.currentPage"
      :page-size="param.pagesize"
      layout="total, prev, pager, next, jumper"
      :total="eltotal">
    </el-pagination>

  </div>
</template>

<script>
import { back } from 'api'
import { sessionSetStore, sessionGetStore } from '@/components/config/Utils'
import $ from 'jquery'
export default {
  data () {
    return {
      param: {
        'currentPage': 1,
        'pagesize': 8,
        'currentPage_DiaDev': 1,
        'pagesize_DiaDev': 8,
        siteId: '',
        beginDate: '',
        endDate: '',
        queryType: ''
      },
      currentPage: 1,
      pagesize: 15,
      eltotal: 20,
      areaSta: true,
      devSta: false,
      productSta: false,
      areaData: [], // 存储场地列表数据
      devData: [], // 存储设备统计列表
      goods: [], // 存储商品类型列表
      options: [{
        value: '选项1',
        label: '按场地分析'
      }, {
        value: '选项2',
        label: '按设备分析'
      }, {
        value: '选项3',
        label: '按商品类型分析',
        disabled: true
      }],
      value: '按场地分析',
      tableMaxHeght: document.body.clientHeight - 40 - 40 - 40 - 40 - 15 - 53, // ===tableDiv的高度
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
    this.backQueSiteStatis()
    // 分页可置空函数
    this.pageQueSelInit()
    this.param.managerId = sessionGetStore('managerId')
    this.roleId = sessionGetStore('roleId')
  },
  mounted: function () {
    this.tableContainerHeightSet()
    // 监听屏幕高度
    this.screenOnresizeFun()
    // var windowHeight = $(window).height()
    // var mainHeight = windowHeight - 100
    // $('.placePage').height(mainHeight)
    // $('.el-table').height(mainHeight - 93)
  },
  // 注销window.onresize事件
  destroyed () {
    window.onresize = null
  },
  methods: {
    // 表格容器高度随窗口视口变化函数
    tableContainerHeightSet: function () {
      var windowHeight = $(window).height()
      var mainHeight = windowHeight - 40 - 40 - 40
      $('.tableDiv').height(mainHeight - 40 - 15 - 53)
      this.tableMaxHeght = mainHeight - 40 - 15 - 53
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
    // 每次切换页码之前清空table数据
    handlePaginationChange: function (value) {
      console.log(value)
      this.param.currentPage = value
      // 分页查询请求可选项置空函数
      this.pageQueSelInit()
      this.backQueSiteStatis()
    },
    // 获取日报
    dayTable: function () {
      this.param.queryType = 1
      if (this.areaSta) {
        this.backQueSiteStatis()
      } else if (this.devSta) {
        this.backQueDeviceStatis()
      } else if (this.productSta) {
        this.backgoodsType()
      }
    },
    // 获取周报
    weekTable: function () {
      this.param.queryType = 3
      if (this.areaSta) {
        this.backQueSiteStatis()
      } else if (this.devSta) {
        this.backQueDeviceStatis()
      } else if (this.productSta) {
        this.backgoodsType()
      }
    },
    // 获取月报
    monthTable: function () {
      this.param.queryType = 4
      if (this.areaSta) {
        this.backQueSiteStatis()
      } else if (this.devSta) {
        this.backQueDeviceStatis()
      } else if (this.productSta) {
        this.backgoodsType()
      }
    },
    // 选择维度统计的类型
    select: function (value) {
      console.log(this.value)
      switch (this.value) {
        case '选项1':
          this.areaSta = true
          this.devSta = false
          this.productSta = false
          this.backQueSiteStatis()
          break
        case '选项2':
          this.areaSta = false
          this.devSta = true
          this.productSta = false
          this.backQueDeviceStatis()
          break
        case '选项3':
          this.areaSta = false
          this.devSta = false
          this.productSta = true
          this.backgoodsType()
          break
      }
    },
    /*
      *
      *******************   API调用   *********************
      *
    */
    // 场地统计
    backQueSiteStatis: function () {
      sessionSetStore('backName', '场地统计')
      this.param.pageNo = this.currentPage
      this.param.pageSize = this.pagesize
      back.queSiteStatis(this.param).then(function (response) {
        console.log(response)
        // 总条数
        this.eltotal = response.data.total
        let tableDataAlter = []
        if (response.data.records) {
          for (let i = 0; i < response.data.records.length; i++) {
            let obj = {}
            obj.siteName = response.data.records[i].siteName
            obj.deviceNum = response.data.records[i].deviceNum
            obj.orderNum = response.data.records[i].orderNum
            obj.onlineIncome = response.data.records[i].onlineIncome
            obj.advertIncome = response.data.records[i].advertIncome
            obj.totalIncome = response.data.records[i].totalIncome
            tableDataAlter.push(obj)
          }
        }
        this.areaData = tableDataAlter
      }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
    },
    // 设备统计
    backQueDeviceStatis: function () {
      sessionSetStore('backName', '设备统计')
      this.param.pageNo = this.currentPage
      this.param.pageSize = this.pagesize
      back.queDeviceStatis(this.param).then(function (response) {
        console.log(response)
        // 总条数
        this.eltotal = response.data.total
        let tableDataAlter = []
        if (response.data.records) {
          for (let i = 0; i < response.data.records.length; i++) {
            let obj = {}
            obj.deviceName = response.data.records[i].deviceName
            obj.deviceId = response.data.records[i].deviceId
            obj.state = response.data.records[i].state ? '在线' : '离线'
            obj.orderNum = response.data.records[i].orderNum
            obj.onlineIncome = response.data.records[i].onlineIncome
            obj.advertIncome = response.data.records[i].advertIncome
            obj.totalIncome = response.data.records[i].totalIncome
            tableDataAlter.push(obj)
          }
        }
        this.devData = tableDataAlter
      }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
    },
    // 按商品类型分析
    backgoodsType: function () {
    },
    // 分页查询请求可选项置空函数
    pageQueSelInit: function () {
      this.param.siteId = ''
      this.param.beginDate = ''
      this.param.endDate = ''
      this.param.queryType = ''
    }
  }
}
</script>

<style scoped>
.placePage {
  background-color: white;
}
.flexbox1 {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 15px;
}
.flexbox {
  display: -webkit-flex;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
}
.popdiv {
  border: 1px solid #ebeef5;
  margin: 5px;
}
.el-checkbox {
  margin: 5px 0;
}
.dividingLine {
  margin: 6px 10px 0 10px;
  color: #409eff;
}
.chartsRadio {
  margin: 20px 0;
}
#diagram {
  margin: 0 auto;
  width: 75vw;
  height: 66vh;
  border: 1px solid #ebeef5;
  padding:10px;
}
.placePage >>> .el-dialog__header {
  background-color: #f4f4f4;
}
</style>

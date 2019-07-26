更改为3交易管理-> 3-2交易统计
<template>
  <div class="placePage">
    <div class="flexbox1">
      <el-button size="small" type="primary" plain @click="dayTable">日报表</el-button>
      <el-button size="small" type="primary" plain @click="weekTable">周报表</el-button>
      <el-button size="small" type="primary" plain @click="monthTable">月报表</el-button>
      <span style="margin: auto 0 10px 10%">统计维度：</span>
      <el-select v-model="value" placeholder="请选择" @change="select(value)">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <!-- 交易统计统计 -->
    <div class="tableDiv">
      <el-table :max-height="tableMaxHeght" :header-cell-style="{'font-size':'14px'}" :data="tableData" stripe border size="small" style="width: 100%;font-size:12px;">
        <el-table-column align="center" prop="name" :label="nameType"></el-table-column>
        <el-table-column align="center" prop="totalIncome" label="总交易额"></el-table-column>
        <el-table-column align="center" prop="orderNum" label="交易笔数"></el-table-column>
        <el-table-column align="center" prop="averageIncome" label="平均交易额"></el-table-column>
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
        'pagesize': 15,
        'currentPage_DiaDev': 1,
        'pagesize_DiaDev': 8,
        siteId: '',
        beginDate: '',
        endDate: '',
        queryType: '',
        type: 1
      },
      currentPage: 1,
      pagesize: 15,
      eltotal: 20,
      tableData: [],
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
      nameType: '场地名称',
      tableMaxHeght: document.body.clientHeight - 40 - 40 - 40 - 40 - 22 - 53, // ===tableDiv的高度
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
    // 分页可置空函数
    this.pageQueSelInit()
    this.param.managerId = sessionGetStore('managerId')
    this.roleId = sessionGetStore('roleId')
    this.backgoodsType()
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
      $('.tableDiv').height(mainHeight - 40 - 22 - 53)
      this.tableMaxHeght = mainHeight - 40 - 22 - 53
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
      this.backgoodsType()
    },
    // 获取周报
    weekTable: function () {
      this.param.queryType = 3
      this.backgoodsType()
    },
    // 获取月报
    monthTable: function () {
      this.param.queryType = 4
      this.backgoodsType()
    },
    // 选择维度统计的类型
    select: function (value) {
      console.log(this.value)
      switch (this.value) {
        case '选项1':
          this.param.type = 1
          this.nameType = '场地名称'
          this.backgoodsType()
          break
        case '选项2':
          this.param.type = 2
          this.nameType = '设备名称'
          this.backgoodsType()
          break
        case '选项3':
          this.param.type = 3
          this.nameType = '商品类型名称'
          this.backgoodsType()
          break
      }
    },
    /*
      *
      *******************   API调用   *********************
      *
    */
    // 收益类型分析
    backgoodsType: function () {
      sessionSetStore('backName', '收益类型分析')
      back.tradeStatis(this.param).then(function (response) {
        console.log(response.data)
        this.eltotal = response.data.total
        this.tableData = []
        if (response.data.records) {
          for (let i = 0; i < response.data.records.length; i++) {
            let obj = {}
            obj.name = response.data.records[i].name
            obj.totalIncome = response.data.records[i].totalIncome
            obj.orderNum = response.data.records[i].orderNum
            obj.averageIncome = response.data.records[i].averageIncome
            this.tableData.push(obj)
          }
        }
      }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
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

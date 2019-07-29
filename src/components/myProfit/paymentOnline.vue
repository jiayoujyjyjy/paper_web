// 2 在线支付记录
<template>
  <div class="paymentOnline">
    <div class="flexbox">
      <div class="box">
        <span style="width:80px;margin: auto">日期</span>
        <el-date-picker
          style="width: 300px; height:40px;"
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
        <el-button style="margin-left:3%;" type="primary" size="small" @click="searchBt">查询</el-button>
      </div>
    </div>
    <div class="tableDiv">
      <el-table
        :header-cell-style="{'font-size':'12px'}"
        :data="tableData"
        stripe
        border
        :max-height="tableMaxHeght"
        style="font-size:12px;">
        <el-table-column
          align="center"
          prop="date"
          label="时间"
          min-width="100%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="income"
          label="收益">
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="handlePaginationChange"
        :current-page="param.pageNo"
        :page-size="param.pageSize"
        layout="total, prev, pager, next, jumper"
        :total="eltotal">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { back } from 'api'
import { sessionGetStore, sessionSetStore } from '@/components/config/Utils'
import $ from 'jquery'
export default {
  data () {
    return {
      param: {
        pageNo: 1,
        pageSize: 6,
        beginDate: '',
        endDate: ''
      },
      eltotal: 20,
      tableData: [],
      // 日期选择器
      pickerOptions: {
        shortcuts: [{
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
        }, {
          text: '最近三个月',
          onClic (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      dateValue: '',
      tableMaxHeght: document.body.clientHeight - 40 - 40 - 40 - 150 - 60 - 103, // ===tableDiv的高度
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
    // this.param.beginDate = ''
    // this.param.endDate = ''
    // 分页查询请求可选项置空函数
    this.backMyIncomeDate()
  },
  mounted: function () {
    this.tableContainerHeightSet()
    // 监听屏幕高度
    this.screenOnresizeFun()
  },
  methods: {
    // 表格容器高度随窗口视口变化函数
    tableContainerHeightSet: function () {
      var windowHeight = $(window).height()
      var mainHeight = windowHeight - 40 - 40 - 40
      $('.tableDiv').height(mainHeight - 150 - 60 - 103)
      this.tableMaxHeght = mainHeight - 150 - 60 - 103
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
    // 搜索按钮
    searchBt: function () {
      this.param.beginDate = this.dateValue[0]
      this.param.endDate = this.dateValue[1]
      this.param.pageNo = 1
      this.param.page = 6
      this.backMyIncomeDate()
    },
    // 每次切换页码之前清空table数据
    handlePaginationChange: function (value) {
      console.log(value)
      this.param.pageNo = value
      this.backMyIncomeDate()
    },
    /*
      *
      *******************   API调用   *********************
      *
    */
    // 收益查询
    backMyIncomeDate: function () {
      sessionSetStore('backName', '收益查询')
      console.log(this.param)
      back.myIncomeDate(this.param).then(function (response) {
        console.log(response)
        if (response.code === 0) {
          this.tableData = []
          this.eltotal = response.data.incomeList.total
          for (var i = 0; i < response.data.incomeList.records.length; i++) {
            let arr = {}
            arr.date = response.data.incomeList.records[i].date
            arr.income = response.data.incomeList.records[i].income
            this.tableData.push(arr)
          }
        } else {
          this.notificationInfo('error', '收益获取失败！')
        }
      }.bind(this))
        .catch((error) => {
          console.log(error)
        })
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
.paymentOnline {
  background-color: white;
  font-size: 14px;
  width: 100%;
}
.flexbox {
  /* margin: 20px 80px 20px 0; */
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-wrap: nowrap;
  /* justify-content: space-around; */
  height: 40px;
  margin-bottom: 10px;
}
.box {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  box-align: left;
}
</style>

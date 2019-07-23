// 2 在线支付记录
<template>
  <div class="paymentOnline">
    <div class="flexbox">
      <div class="box">
        <span style="width:80px;margin: auto 6px">日期</span>
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
        <el-button style="margin-left:2%;" type="primary" size="small" @click="searchBt">查询</el-button>
      </div>
    </div>
    <div class="tableDiv">
      <el-table
        :header-cell-style="{'font-size':'12px'}"
        :data="tableData"
        stripe
        border
        :max-height="tableMaxHeght"
        style="width: 100%;font-size:12px;">
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
        beginDate: '',
        endDate: ''
      },
      tableData: [],
      // 表格最大高度 header mainOuterPadding tabs mainInPadding footer serachDiv bugSet
      tableMaxHeght: 357,
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
      dateValue: ''
    }
  },
  created: function () {
    // session获取登录者关键参数
    this.param.id = sessionGetStore('managerId')
    // 分页查询请求可选项置空函数
    this.backMyIncome()
  },
  mounted: function () {
    var windowWidth = $(window).width()
    $('.tableDiv').width(windowWidth - 200 - 20) // 解决表格滚动条分页益处问题
    var windowHeight = $(window).height()
    var mainHeight = windowHeight - 40 - 115 - 54 - 127
    $('.paymentOnline').height(mainHeight)
    $('.tableDiv').height(mainHeight - 40 - 20)
  },
  methods: {
    // 搜索按钮
    searchBt: function () {
      this.param.beginDate = this.dateValue[0]
      this.param.endDate = this.dateValue[1]
      this.backMyIncome()
    },
    // 时间格式化为 yyyy-MM-dd
    getDay (day) {
      var today = new Date()
      var targetdayMilliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day
      today.setTime(targetdayMilliseconds) // 注意，这行是关键代码
      var tYear = today.getFullYear()
      var tMonth = today.getMonth()
      var tDate = today.getDate()
      tMonth = this.doHandleMonth(tMonth + 1)
      tDate = this.doHandleMonth(tDate)
      return tYear + '-' + tMonth + '-' + tDate
    },
    doHandleMonth (month) {
      var m = month
      if (month.toString().length === 1) {
        m = '0' + month
      }
      return m
    },
    /*
      *
      *******************   API调用   *********************
      *
    */
    // 收益查询
    backMyIncome: function () {
      sessionSetStore('backName', '收益查询')
      this.param.beginDate = this.getDay(-30)
      this.param.endDate = this.getDay(0)
      console.log(this.param)
      back.myIncome(this.param).then(function (response) {
        console.log(response)
        if (response.code === 0) {
          let arr = {}
          for (var i = 0; i < response.data.incomeList.length; i++) {
            arr.date = response.data.incomeList[i].date
            arr.income = response.data.incomeList[i].income
            this.tableData.push(arr)
            arr = {}
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
  margin: 20px 80px 20px 0;
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
}
.box {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
    /* width:auto; */
  margin-left: 2%;
}
</style>

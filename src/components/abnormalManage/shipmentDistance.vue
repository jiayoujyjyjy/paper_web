异常管理 --> 远程出货
<template>
  <div class="shipmentDistance">
    <div class="tableDiv">
      <el-table
        :header-cell-style="{'font-size':'14px'}"
        :data="tableData"
        border
        style="width: 100%;font-size:12px;"
        :max-height="tableMaxHeght">
        <el-table-column
          align="center"
          prop="id"
          label="记录编码"
          min-width="20%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="site"
          label="场地名称"
          min-width="30%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="address"
          label="详细地址"
          min-width="10%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="deviceId"
          label="设备编码"
          min-width="10%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="device"
          label="设备名称"
          min-width="10%">
        </el-table-column>

        <el-table-column
          align="center"
          prop="manager"
          label="操作人名称"
          min-width="10%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="paper"
          label="纸巾名称"
          min-width="10%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="type"
          label="纸巾类型"
          min-width="10%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="num"
          label="数量"
          min-width="10%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="createTime"
          label="创建时间"
          min-width="10%">
        </el-table-column>
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
import { sessionGetStore, sessionSetStore } from '@/components/config/Utils'
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
      currentPage: 1,
      pagesize: 10,
      eltotal: 20,
      // 表格数据
      tableData: [],
      // 表格最大高度 header mainOuterPadding tabs mainInPadding footer serachDiv bugSet
      tableMaxHeght: document.body.clientHeight - 40 - 20 - 40 - 40 - 40 - 40 - 46 // ===tableDiv的高度
    }
  },
  created: function () {
    // session获取登录者关键参数
    this.param.managerId = sessionGetStore('managerId')
    this.param.roleId = sessionGetStore('roleId')
    this.backStockAlarm()
    this.backStockAlarm()
  },
  mounted: function () {
    var windowWidth = $(window).width()
    $('.tableDiv').width(windowWidth - 200 - 20 - 40) // 解决表格滚动条分页益处问题
    var windowHeight = $(window).height()
    var mainHeight = windowHeight - 20 - 40 - 40 // header mainOuterPadding tabs mainInPadding
    console.log(mainHeight) // 617
    $('.shipmentDistance').height(mainHeight) // 设置的是内容高度，巨坑啊卧槽
    $('.tableDiv').height(mainHeight - 40 - 40 - 40 - 46) // serachDiv 几台设备Div footer +13的原因是element的控件boder-sizing为content
  },
  methods: {
    // 每次切换页码之前清空table数据
    handlePaginationChange: function (value) {
      // this.tableMaxHeght = document.body.clientHeight - 40 - 20 - 40 - 40 - 40 - 42 - 53 // ===tableDiv的高度
      console.log(value)
      this.param.currentPage = value
      // 分页查询请求可选项置空函数
      this.pageQueSelInit()
      this.backStockAlarm()
    },
    /*
      *
      *******************   API调用   *********************
      *
    */
    // 库存分页查询
    backStockAlarm: function () {
      // degugger
      this.param.pageNo = this.currentPage
      this.param.pageSize = this.pagesize
      sessionSetStore('backName', '库存分页查询')
      back.stockAlarm(this.param).then(function (response) {
        console.log(response)
        this.eltotal = response.data.total
        if (response.data.records) {
          this.tableData = []
          for (let i = 0; i < response.data.records.length; i++) {
            let obj = {}
            obj.deviceId = response.data.records[i].deviceId
            obj.siteName = response.data.records[i].siteName
            obj.paperName = response.data.records[i].paperName
            obj.stockNum = response.data.records[i].stockNum
            obj.shortageNum = response.data.records[i].shortageNum
            this.tableData.push(obj)
          }
        } else {
          this.tableData = []
        }
      }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
    },
    //
    // *******************   辅助函数   *********************
    //
    // 分页查询请求可选项置空函数
    pageQueSelInit: function () {
      this.param.devId = ''
      this.param.deviceId = ''
      this.param.siteId = ''
      this.param.managerId = ''
      this.param.userId = ''
      this.param.state = ''
      this.param.site = ''
      this.param.id = ''
      this.param.paperId = ''
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
.shipmentDistance {
  padding: 20px;
  background-color: white;
  width: 100%;
}
.select {
  width: 100%;
  height: 40px;
  text-align: left;
  margin-top: 1%;
}
.el-select >>> .el-input {
  font-size: 12px;
}
.select .el-input {
  width: 230px;
  margin-right: 5px;
}
.flexbox {
  /* margin: 20px 0 0 0; */
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  height: 30px;
  margin: 6px 0;
}
.box2 {
  font-size:15px;
  letter-spacing:3px
}
.box2 p {
  margin: 0;
}
.devListPage >>> .el-dialog__header {
  border-bottom: 1px solid #CDC9C9;
}
.tableDiv {
  margin-top: 2%;
  height: 373px;
}
</style>

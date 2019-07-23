// 异常管理 --> 异常列表
<template>
  <div class="productmanagePage">
        <div class="select">
        <span style="margin: auto 1%;">设备编号</span>
        <el-input size="small" v-model="id" placeholder="请输入设备编号"></el-input>
        <!-- <span style="margin: auto 1%">异常类型</span>
        <el-select v-model="selected" placeholder="请选择">
            <el-option
            v-for="item in selectData"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select> -->
        <el-button type="primary" size="small" style="margin: auto 1%" @click="searchBt">搜索</el-button>
      </div>
    <div class="tableDiv" style="margin-top: 1%">
      <el-table
        :header-cell-style="{'font-size':'14px'}"
        :data="tableData"
        stripe
        border
        :max-height="tableMaxHeght"
        style="width: 100%;font-size:12px;">
        <el-table-column
          align="center"
          prop="id"
          label="设备编码"
          min-width="10%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="name"
          label="设备名称"
          min-width="20%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="site"
          label="场地名称"
          min-width="20%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="state"
          label="设备状态"
          min-width="10%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="faultType"
          label="故障类型"
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
        'pagesize_DiaDev': 8,
        id: ''
      },
      currentPage: 1,
      pagesize: 10,
      eltotal: 20,
      id: '',
      selectData: [
        {
          value: '',
          label: '全部'
        }
      ], // 下拉选择框
      tableData: [],
      // 表格最大高度 header mainOuterPadding tabs mainInPadding footer serachDiv bugSet
      tableMaxHeght: document.body.clientHeight - 40 - 20 - 40 - 72 + 13 // ===tableDiv的高度
    }
  },
  created: function () {
    // session获取登录者关键参数
    this.param.managerId = sessionGetStore('managerId')
    this.param.roleId = sessionGetStore('roleId')
    this.backDevNormal()
  },
  mounted: function () {
    var windowWidth = $(window).width()
    $('.tableDiv').width(windowWidth - 200 - 20 - 40) // 解决表格滚动条分页益处问题
    var windowHeight = $(window).height()
    var mainHeight = windowHeight - 40 - 20 - 40
    $('.productmanagePage').height(mainHeight)
    $('.tableDiv').height(mainHeight - 72 - 26 + 13)
  },
  methods: {
    // 搜索按钮
    searchBt: function () {
      console.log(this.id)
      this.param.id = this.id
      this.backDevNormal()
    },
    // 每次切换页码之前清空table数据
    handlePaginationChange: function (value) {
      console.log(value)
      this.param.pageNo = value
      // 分页查询请求可选项置空函数
      this.pageQueSelInit()
      this.backDevNormal()
    },
    /*
      *
      *******************   API调用   *********************
      *
    */
    // 异常设备分页查询
    backDevNormal: function () {
      this.param.pageNo = this.currentPage
      this.param.pageSize = this.pagesize
      sessionSetStore('backName', '异常设备分页查询')
      back.devNormal(this.param).then(function (response) {
        console.log(response)
        this.eltotal = response.data.total
        if (response.data.records) {
          this.tableData = []
          for (let i = 0; i < response.data.records.length; i++) {
            let obj = {}
            obj.id = response.data.records[i].id
            obj.name = response.data.records[i].name
            obj.site = response.data.records[i].site
            obj.state = response.data.records[i].state
            obj.faultType = response.data.records[i].faultType
            this.tableData.push(obj) // 或用this.tableData[i] = obj亦可
          }
        } else {
          this.tableData = []
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
      this.param.devId = ''
      this.param.operationType = '2'
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
.productmanagePage {
  padding: 20px;
  background-color: white;
}
.box {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
}
.productmanagePage >>> .el-dialog__header {
  border-bottom: 1px solid #CDC9C9;
}
.select {
  width: 100%;
  height: 40px;
  text-align: left;
}
.el-select >>> .el-input {
  font-size: 12px;
}
.select .el-input {
  width: 230px;
  margin-right: 5px;
}
</style>

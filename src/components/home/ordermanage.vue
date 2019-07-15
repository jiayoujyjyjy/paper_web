<template>
  <div class="ordermanagePage">
    <div class="flexbox">
      <!-- <div class="box">
        <span style="width:120px;margin-top:6px">支付用户编号</span>
        <el-input size="small" v-model="selection.userId" placeholder="请输入用户ID号"></el-input>
      </div> -->
      <div class="box">
        <span style="width:80px;margin-top:6px">订单编码</span>
        <el-input size="small" v-model="selection.orderId" placeholder="请输入交易/商户订单号"></el-input>
      </div>
      <!-- 去除了输入自动匹配功能 -->
      <div style="margin: 0 20px;">设备编码
        <el-autocomplete
          size="small"
          class="inline-input"
          suffix-icon="el-icon-arrow-down"
          v-model="selection.deviceId"
          :fetch-suggestions="querySearch_DevId"
          placeholder="请输入或选择编号">
        </el-autocomplete>
      </div>
      <div>场地名称
        <el-autocomplete
          size="small"
          class="inline-input"
          suffix-icon="el-icon-arrow-down"
          v-model="selection.site"
          :fetch-suggestions="querySearch_Loca"
          placeholder="请输入或选择场地">
        </el-autocomplete>
      </div>
      <el-button type="primary" size="small" @click="searchBt">查询</el-button>
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
          prop="orderId"
          label="订单编码"
          min-width="100%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="device"
          label="设备名称">
        </el-table-column>
        <!-- <el-table-column
          align="center"
          prop="orderId"
          label="交易单号">
        </el-table-column> -->
        <!-- <el-table-column
          align="center"
          prop="merchantId"
          label="商户单号">
        </el-table-column> -->
        <el-table-column
          align="center"
          prop="site"
          label="场地名称">
        </el-table-column>
        <el-table-column
          align="center"
          prop="manager"
          label="管理员名称">
        </el-table-column>
        <el-table-column
          align="center"
          prop="user"
          label="用户名称">
        </el-table-column>
        <el-table-column
          align="center"
          prop="deviceId"
          label="设备编码"
          min-width="100%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="money"
          label="订单金额">
        </el-table-column>
        <el-table-column
          align="center"
          prop="state"
          label="订单状态">
        </el-table-column>
        <el-table-column
          align="center"
          prop="isFree"
          label="是否免费">
        </el-table-column>
        <el-table-column
          align="center"
          prop="paper"
          label="纸巾名称">
        </el-table-column>
        <!-- <el-table-column
          align="center"
          prop="userId"
          label="支付用户编号">
        </el-table-column> -->
        <!-- <el-table-column
          label="详情"
          align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="detailBt(scope.$index, scope.row)">查看</el-button>
          </template>
        </el-table-column> -->
      </el-table>
    </div>

    <el-pagination
      @current-change="handlePaginationChange"
      :current-page="param.currentPage"
      :page-size="param.pagesize"
      layout="total, prev, pager, next, jumper"
      :total="eltotal">
    </el-pagination>

    <!--查看对话框-->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogEditVisible"
      width="20%"
      center>
      <el-form :model="detailForm" label-width="100px">
        <el-form-item label="产品名称">
          <el-input v-model="detailForm.productName" :disabled="isedit"></el-input>
        </el-form-item>
        <el-form-item label="产品类型">
          <el-input v-model="detailForm.productType" :disabled="isedit"></el-input>
        </el-form-item>
        <el-form-item label="数量">
          <el-input v-model="detailForm.productNum" :disabled="isedit"></el-input>
        </el-form-item>
        <el-form-item label="总价">
          <el-input v-model="detailForm.productPrice" :disabled="isedit"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="editConfirm">确 定</el-button>
      </span>
    </el-dialog>
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
      siteList: [{
        value: '江泰国际广场1楼'
      }, {
        value: '江泰国际广场2楼'
      }, {
        value: '江泰国际广场3楼'
      }, {
        value: '江泰国际广场4楼'
      }],
      devIdlist: [],
      isedit: false,
      dialogTitle: '', // 详情对话框标题
      detailForm: {
        productName: '纸巾',
        productType: '小包纸', // 小包纸/抽纸
        productNum: 100,
        productPrice: '2元'
      },
      dialogEditVisible: false,
      tableData: [{
        orderId: '',
        refundReason: '',
        deviceId: '',
        site: '',
        money: 2,
        userId: ''
      }],
      selection: {
        orderId: '',
        deviceId: '',
        site: ''
      },
      // 表格最大高度 header mainOuterPadding tabs mainInPadding footer serachDiv bugSet
      tableMaxHeght: document.body.clientHeight - 40 - 20 - 40 - 72 - 53 + 13
    }
  },
  created: function () {
    // session获取登录者关键参数
    this.param.id = sessionGetStore('managerId')
    // 分页查询请求可选项置空函数
    this.pageQueSelInit()
    this.backQueOrderPage()
  },
  mounted: function () {
    var windowWidth = $(window).width()
    $('.tableDiv').width(windowWidth - 200 - 20 - 40) // 解决表格滚动条分页益处问题
    var windowHeight = $(window).height()
    var mainHeight = windowHeight - 40 - 20 - 40
    $('.ordermanagePage').height(mainHeight)
    $('.tableDiv').height(mainHeight - 72 - 53 + 13)
  },
  methods: {
    // 选择投放地址自动完成
    querySearch_Loca: function (queryString, cb) {
      var siteList = this.siteList
      var results = queryString ? siteList.filter(this.createFilter_Loca(queryString)) : siteList
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter_Loca: function (queryString) {
      return (siteList) => {
        return (siteList.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    // 选择设备编码自动完成
    querySearch_DevId: function (queryString, cb) {
      var devIdlist = this.devIdlist
      var results = queryString ? devIdlist.filter(this.createFilter_DevId(queryString)) : devIdlist
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter_DevId: function (queryString) {
      return (devIdlist) => {
        return (devIdlist.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    // 详情信息按钮
    detailBt: function (index, row) {
      this.dialogTitle = '详情'
      this.isedit = true
      // this.detailForm = {
      //   productName: this.tableData[index].productName,
      //   productNum: this.tableData[index].productNum,
      //   productPrice: this.tableData[index].productPrice
      // }
      this.dialogEditVisible = true
    },
    // 详情对话框确定按键
    editConfirm: function () {
      console.log('详情对话框确定按键')
      this.dialogEditVisible = false
    },
    // 搜索按钮
    searchBt: function () {
      console.log(this.selection)
      this.param.id = this.selection.orderId
      this.param.deviceId = this.selection.deviceId
      this.param.site = this.selection.site
      this.backQueOrderPage()
    },
    // 每次切换页码之前清空table数据
    handlePaginationChange: function (value) {
      console.log(value)
      this.param.currentPage = value
      // 分页查询请求可选项置空函数
      this.pageQueSelInit()
      this.backQueOrderPage()
    },
    /*
      *
      *******************   API调用   *********************
      *
    */
    // 订单分页查询
    backQueOrderPage: function () {
      sessionSetStore('backName', '订单分页查询')
      back.queOrderPage(this.param).then(function (response) {
        console.log(response)
        this.eltotal = response.data.total
        if (response.data.records) {
          this.tableData = []
          for (let i = 0; i < response.data.records.length; i++) {
            // 存储表格数据
            let obj = {}
            obj.orderId = response.data.records[i].id
            obj.device = response.data.records[i].device
            obj.site = response.data.records[i].site
            obj.manager = response.data.records[i].manager
            obj.user = response.data.records[i].user
            obj.money = response.data.records[i].money
            obj.state = response.data.records[i].state === 1 ? '全额退款' : '交易成功'
            obj.refundReason = response.data.records[i].refundReason
            obj.deviceId = response.data.records[i].deviceId
            obj.isFreeNum = response.data.records[i].isFree
            obj.isFree = response.data.records[i].isFree === 1 ? '免费' : '收费'
            obj.paper = response.data.records[i].paper
            this.tableData.push(obj) // 或用this.tableData[i] = obj亦可
            // 存储设备编码列表
            let devObj = {}
            devObj.value = response.data.records[i].deviceId
            this.devIdlist[i] = devObj
            // 存储场地名称列表
            let siteObj = {}
            siteObj.value = response.data.records[i].site
            this.siteList[i] = siteObj
          }
        } else {
          this.tableData = []
          this.siteList = []
          this.devIdlist = []
        }
      }.bind(this))
        .catch((error) => {
          console.log(error)
        })
    },
    // 修改订单
    backUpdateOrder: function () {
      sessionSetStore('backName', '修改订单')
      back.updateOrder(this.param).then(function (response) {
        console.log(response)
        this.backQueOrderPage()
      }.bind(this))
        .catch((error) => {
          console.log(error)
        })
    },
    // 查看订单详情
    backQueOrderInfo: function () {
      return new Promise(function (resolve, reject) {
        sessionSetStore('backName', '查看订单详情')
        back.queOrderInfo(this.param).then(function (response) {
          console.log(response)
          let obj = {}
          if (response.data !== undefined) {
            obj.deviceId = response.data.id
            obj.productName = response.data.name
            obj.productType = response.data.type
            obj.num = response.data.num
            obj.price = response.data.price
          }
          this.editform = obj
          resolve()
        }.bind(this))
          .catch(function (error) {
            console.log(error)
            reject()
          })
      }.bind(this))
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
.ordermanagePage {
  padding: 20px;
  background-color: white;
  font-size: 14px;
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
  width:auto;
}
.ordermanagePage >>> .el-dialog__header {
  border-bottom: 1px solid #CDC9C9;
}
</style>

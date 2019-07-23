// 3交易管理  -> 3-1交易订单
<template>
  <div class="ordermanagePage">
    <div class="flexbox">
      <!-- <div class="box">
        <span style="width:120px;margin-top:6px">支付用户编号</span>
        <el-input size="small" v-model="selection.userId" placeholder="请输入用户ID号"></el-input>
      </div> -->
      <!-- 模糊搜索 -->
      <div class="box">
        <span style="width:80px;margin-top:6px">订单编码</span>
        <el-input size="small" v-model="selection.orderId" placeholder="请输入交易/商户订单号"></el-input>
      </div>
      <div class="box">
        <span style="width:80px;margin-top:6px">设备编码</span>
        <el-input size="small" v-model="selection.deviceId" placeholder="请输入设备编码"></el-input>
      </div>
      <div class="box">
        <span style="width:80px;margin-top:6px">场地名称</span>
        <el-input size="small" v-model="selection.site" placeholder="请输入场地名称"></el-input>
      </div>
      <div class="box">
        <span style="width:80px;margin-top:6px">日期</span>
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
        <el-table-column
          align="center"
          prop="createTime"
          label=下单时间>
        </el-table-column>
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
      siteList: [],
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
      tableMaxHeght: document.body.clientHeight - 40 - 40 - 40 - 62 - 53,
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
    this.backQueOrderPage()
  },
  mounted: function () {
    // 初始化表格容器高度/最大高度
    this.tableContainerHeightSet()
    // 监听屏幕高度
    this.screenOnresizeFun()
  },
  methods: {
    // 表格容器高度随窗口视口变化函数
    tableContainerHeightSet: function () {
      var windowHeight = $(window).height()
      var mainHeight = windowHeight - 40 - 40 - 40
      $('.tableDiv').height(mainHeight - 62 - 53)
      this.tableMaxHeght = windowHeight - 40 - 40 - 40 - 62 - 53 // header outerPadding interPadding searchDiv 分页Div 
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
    // 详情信息按钮
    detailBt: function (index, row) {
      this.dialogTitle = '详情'
      this.isedit = true
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
      this.param.beginDate = this.dateValue[0]
      this.param.endDate = this.dateValue[1]
      console.log(this.dateValue)
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
            obj.createTime = response.data.records[i].createTime
            this.tableData.push(obj) // 或用this.tableData[i] = obj亦可
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
      this.param.beginDate = ''
      this.param.endDate = ''
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
.flexbox {
  /* margin: 20px 80px 20px 0; */
  height: 30px;
  margin: 16px 0;
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
